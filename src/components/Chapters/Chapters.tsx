import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, GestureResponderEvent, RefreshControl, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { addChapterSummary, getChapterParts, getChapters } from '../../common/apis/api';
import styles from './ChapterStyles';
import LottieView from 'lottie-react-native';
import HealthWorkerPNG from '../../../assets/lottie/winter-traveler.json';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import Header from '../../common/StyledComponents/Header';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import colour from '../../common/constants/styles.json'
import { useQuery, useQueryClient } from 'react-query';
import { setChapterId, setChapterTimer, setChapterTitle, setShowSummary } from '../../redux/actions';
import Back from '../../../assets/svg/back';
import FastImage from 'react-native-fast-image';
import CompletedTimer from '../../../assets/svg/completedTimer';
import Complete from '../../../assets/svg/complete';

interface ChaptersProps { }

type LeftComponentProps = {
    icon: string;
    color: string;
    onPress: (event: GestureResponderEvent) => void;
};

interface Chapter {
    id: number;
    chapter_name: string;
    chapter_no: number;
    chapter_percent: string
}

const Chapters: FC<ChaptersProps> = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const courseId: any = useSelector((state: RootState) => state.app.courseId);
    const courseName: any = useSelector((state: RootState) => state.app.courseName);
    const chapterId: any = useSelector((state: RootState) => state.app.chapterId);
    const chapterTimer: any = useSelector((state: RootState) => state.app.chapterTimer);
    const wallpapers: any = useSelector((state: RootState) => state.app.wallpapers);

    const [chapterList, setChapterList] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [chapterWallpapaer, setChapterWallpaper] = useState<any>("");

    const handleBackPress = () => {
        navigation.navigate('Courses');
        dispatch(setChapterId(''));
        dispatch(setChapterTimer(null));
        dispatch(setShowSummary(false));
    };

    const addSummary = async () => {
        try {
            await addChapterSummary(Number(chapterId), Number(chapterTimer));
        } catch (err) {
            console.error("Error sending summary", err)
        }
    }

    useEffect(() => {
        if (chapterTimer) {
            addSummary();
        }
    }, [chapterTimer]);

    useQuery({
        queryKey: ["chapterList"],
        queryFn: () => getChapters(courseId),
        // refetchInterval: 5000,
        onSuccess: (response) => {
            if (response.data) {
                const sortedChapters = response.data.response.sort((a: any, b: any) => a.chapter_no - b.chapter_no);
                setChapterList(sortedChapters);
            }
        }
    });

    useFocusEffect(
        useCallback(() => {
            queryClient.invalidateQueries("chapterList");

            wallpapers?.dynamic?.find((item: any) => {
                if (item.location === 'CHAPTERS') {
                    setChapterWallpaper(item?.content_url);
                }
            });
        }, [])
    );

    const navigateToChapterParts = (chapterID: any, chapterTitle: string) => {
        dispatch(setChapterId(chapterID));
        dispatch(setChapterTitle(chapterTitle));
        navigation.navigate('Chapter Parts', {
            chapterId: chapterID,
            chapterTitle: chapterTitle
        });
    };

    const renderChapterItem = ({ item }: { item: Chapter }) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.chapterItem}
                onPress={() => {
                    navigateToChapterParts(item.id, item.chapter_name);
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 26,
                            fontWeight: '700',
                            backgroundColor: colour['theme-color'],
                            padding: 18,
                            borderTopLeftRadius: 32,
                            borderBottomLeftRadius: 32,
                            width: 70,
                            textAlign: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {item.chapter_no}
                    </Text>
                    <Text
                        style={{ color: 'black', fontSize: 16, fontWeight: '500', flex: 1 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.chapter_name}
                    </Text>
                    {!item.chapter_percent || item.chapter_percent === "0%" || item.chapter_percent === null ? (
                        <View />
                    ) : (
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                right: 'auto',
                                marginRight: 16,
                                backgroundColor: colour['theme-color'],
                                padding: 6,
                                width: 44,
                                height: 44,
                                alignItems: 'center',
                                borderRadius: 20,
                            }}
                        >
                            {item.chapter_percent === '100%' ?
                                <Complete />
                                :
                                <Text style={{ color: 'black', fontSize: 13, fontWeight: '500' }}>
                                    {item.chapter_percent}
                                </Text>
                            }
                        </View>
                    )}

                </View>
            </TouchableOpacity>

        )
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("wallpaper");
            const response = await getChapters(courseId);
            if (response.data) {
                const sortedChapters = response.data.response.sort((a: any, b: any) => a.chapter_no - b.chapter_no);
                setChapterList(sortedChapters);
            }
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Header
                title={courseName}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                leftIcon={<Back />}
                onLeftIconPress={handleBackPress}
            />
            {chapterList.length === 0 ? (
                <View style={styles.NodataLottie}>
                    <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                </View>
            ) : (
                <>
                    <FastImage
                        source={{ uri: chapterWallpapaer }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').height * 0.3,
                        }}
                    />
                    <FlatList
                        data={chapterList}
                        showsVerticalScrollIndicator={false}
                        style={styles.chapterList}
                        renderItem={renderChapterItem}
                        keyExtractor={(item) => item.id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </>
            )}
        </View>
    );
};

export default Chapters;
