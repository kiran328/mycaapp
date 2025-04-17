import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, RefreshControl, BackHandler, InteractionManager } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getChapterParts, getChapterPercent, getPartComponent, sendComponentTimeSpent } from '../../common/apis/api';
import LottieView from 'lottie-react-native';
import Loading from '../../../assets/lottie/loading.json';
import PartTab from './PartTabs/PartTabs';
import Elements from './Elements/Elements';
import Header from '../../common/StyledComponents/Header';
import ElementsReel from './ElementReel/ElementReel';
import colour from '../../common/constants/styles.json'
import { useQuery, useQueryClient } from 'react-query';
import { setChapterId, setChapterTimer, setIsPlaying, setShowSummary } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import SoundPlayer from 'react-native-sound-player';
import Summary from './Summary/Summary';
import { RootState } from '../../redux/rootReducer';
import Complete from '../../../assets/svg/complete';
import Incomplete from '../../../assets/svg/incomplete';
import styles from './PartsStyle';
import Back from '../../../assets/svg/back';

interface ChapterPartsProps { }

const ChapterParts: FC<ChapterPartsProps> = () => {
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const scrollViewRef = useRef<ScrollView>(null); // Ref to store scroll view
    const scrollPosition = useRef(0); // Ref to track the scroll position

    const handleScroll = (event: any) => {
        scrollPosition.current = event.nativeEvent.contentOffset.y; // Save the scroll position
    };

    const showSummary: any = useSelector((state: RootState) => state.app.showSummary);
    const courseID: any = useSelector((state: RootState) => state.app.courseId);
    const chapterID: any = useSelector((state: RootState) => state.app.chapterId);
    const partID: any = useSelector((state: RootState) => state.app.partId);

    const { chapterId, chapterTitle } = route.params;
    const [partList, setPartList] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<any>(null);
    const [partContent, setPartContent] = useState<any[]>([]);
    const [showDetailsScreen, setShowDetailsScreen] = useState(false);
    const [elementID, setElementID] = useState<number | null>(null);
    const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(null);
    const [noData, setNoData] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0);
    const [isElementComplete, setIsElementComplete] = useState<boolean[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [percent, setPercent] = useState<string>('');

    const navigateToChapters = () => {
        navigation.navigate('Chapters');

        dispatch(setChapterTimer(timer));
        dispatch(setChapterId(chapterId));
        dispatch(setShowSummary(false));

        try {
            dispatch(setIsPlaying(false));
            SoundPlayer.stop();
        } catch (error) {
            console.log('Error pausing audio:', error);
        }
    };

    // Start timer on component mount
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);

        return () => {
            clearInterval(interval); // Stop timer on component unmount
        };
    }, []);

    useEffect(() => {
        if (!showDetailsScreen && scrollViewRef.current) {
            // Restore scroll position when returning to the main screen
            scrollViewRef.current.scrollTo({ y: scrollPosition.current, animated: false });
        }
    }, [showDetailsScreen]);

    useEffect(() => {
        const handleBackPress = () => {
            navigateToChapters();
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [dispatch]);

    useQuery({
        queryKey: ["chapterParts"],
        queryFn: () => getChapterParts(chapterId),
        onSuccess: (response) => {
            const parts = response?.data?.response;
            setPartList(parts);
            if (parts.length > 0) {
                setActiveTab(parts[0]);
            }
        }
    });

    useQuery({
        queryKey: ["chapterPercent"],
        queryFn: () => getChapterPercent(chapterId),
        onSuccess: (response) => {
            const percent = response?.data?.response;
            setPercent(percent);
        }
    });

    useQuery({
        queryKey: ["chapterPartComponent", activeTab?.id],
        queryFn: () => {
            if (activeTab && activeTab.id) {
                return getPartComponent(activeTab.id);
            } else {
                return Promise.resolve({ data: null });
            }
        },
        onSuccess: (response) => {
            if (response?.data?.response) {
                const componentData = response?.data?.response
                setPartContent(componentData);
                const componentID = componentData.map((comp: any) => comp.id);
                setElementID(componentID);
                const isCompleteArray = componentData.map((component: any) => component?.component_info?.is_component_completed || false);
                setIsElementComplete(isCompleteArray);
            } else {
                setNoData(true);
            }
            setIsLoading(false); // Set loading to false once data is loaded
        }
    });

    const handleTabPress = (selectedTab: any) => {
        setActiveTab(selectedTab);
        setIsLoading(true);
        dispatch(setShowSummary(false));
        dispatch(setChapterId(chapterId));
        queryClient.invalidateQueries(["chapterPartComponent", selectedTab.id]);

        try {
            dispatch(setIsPlaying(false));
            SoundPlayer.stop();
        } catch (error) {
            console.log('Error pausing audio:', error);
        }
    };

    const handleElementPress = (index: any, part: any) => {
        if (part.content_type === 'QUIZ') {
            navigation.navigate("Quiz", { quizID: part.id });
        } else {
            setSelectedPartIndex(index);
            setShowDetailsScreen(true);
        }
    };

    const handleCloseDetailsScreen = async (elementTime: any) => {
        try {
            setIsLoading(true);
            const response = await sendComponentTimeSpent(courseID, chapterID, partID, elementTime);
            if (response?.data) {
                setShowDetailsScreen(false);
                queryClient.invalidateQueries("chapterPartComponent");
                queryClient.invalidateQueries("chapterPercent");
                try {
                    dispatch(setIsPlaying(false));
                    SoundPlayer.stop();
                } catch (error) {
                    console.log('Error pausing audio:', error);
                } finally {
                    setIsLoading(false)
                }
            }
            // Trigger a layout animation for a smooth transition
            InteractionManager.runAfterInteractions(() => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ y: scrollPosition.current, animated: false });
                }
            });
        } catch (error) {
            console.error("Error sending componentTime", error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("chapterParts");
            queryClient.invalidateQueries("chapterPartComponent");
            queryClient.invalidateQueries("chapterPercent");
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, [chapterId, partList, activeTab]);

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <Header
                title={chapterTitle}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                onLeftIconPress={navigateToChapters}
                leftIcon={<Back />}
                showPercent={percent}
            />
            {showDetailsScreen ? (
                <ElementsReel
                    partContent={partContent}
                    onClose={handleCloseDetailsScreen}
                    initialIndex={selectedPartIndex !== null ? selectedPartIndex : 0}
                    loading={isLoading}
                />
            ) : (
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1, backgroundColor: colour['theme-backgroung-color'] }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {isLoading ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 200 }}>
                            <LottieView
                                autoPlay
                                loop
                                style={{ width: 200, height: 200 }}
                                source={Loading}
                            />
                            <Text style={{ color: 'black', fontWeight: '500' }}>Loading...</Text>
                        </View>
                    ) : (
                        <View>
                            <PartTab
                                tabs={partList}
                                activeTab={activeTab}
                                onChange={handleTabPress}
                            />
                            {showSummary ? (
                                <Summary />
                            ) : (
                                partContent?.length === 0 ? (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 200 }}>
                                        <View>
                                            <LottieView
                                                autoPlay
                                                loop
                                                style={{ width: 200, height: 200 }}
                                                source={Loading}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    partContent?.map((element: any, index: number) => (
                                        <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => handleElementPress(index, element)} style={{ marginHorizontal: 10 }}>
                                            <View style={styles.isCompleteMark}>
                                                {element.content_type === 'QUIZ' ? <View /> : isElementComplete[index] ? <Complete /> : <Incomplete />}
                                            </View>
                                            <Elements part={element} />
                                        </TouchableOpacity>
                                    ))
                                )
                            )}
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default ChapterParts;
