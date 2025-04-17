import React, { FC, useEffect, useState } from 'react';
import { View, ScrollView, Text, BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getChapterParts, getDailyActivity, getPartComponent } from '../../common/apis/api';
import LottieView from 'lottie-react-native';
import Loading from '../../../assets/lottie/loading.json';
import Elements from '../ChapterParts/Elements/Elements';
import Header from '../../common/StyledComponents/Header';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import colour from '../../common/constants/styles.json'
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setIsPlaying } from '../../redux/actions';
import SoundPlayer from 'react-native-sound-player';
import Back from '../../../assets/svg/back';

interface DailyActivityProps { }

const DailyActivity: FC<DailyActivityProps> = () => {
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const dispatch = useDispatch();
    const { activityID, activityName } = route.params;
    const [dailyActivity, setDailyActivity] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<any>(null);

    const navigateToDashboard = () => {
        navigation.navigate('Dashboard');
        try {
            dispatch(setIsPlaying(false));
            SoundPlayer.stop();
        } catch (error) {
            console.log('Error pausing audio:', error);
        }
    };

    useEffect(() => {
        const handleBackPress = () => {
            try {
                dispatch(setIsPlaying(false));
                SoundPlayer.stop();
            } catch (error) {
                console.log('Error pausing audio:', error);
            }
            return false;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [dispatch]);

    useQuery({
        queryKey: ["chapterParts"],
        queryFn: () => getChapterParts(activityID),
        // refetchInterval: 5000,
        onSuccess: (response) => {
            const parts = response.data.response;
            setActiveTab(parts[0]);
        }
    });

    useQuery({
        queryKey: ["chapterPartComponent", activeTab?.id], // Include activeTab.id in the query key
        queryFn: () => {
            if (activeTab && activeTab.id) {
                return getPartComponent(activeTab.id);
            } else {
                // Handle null id, possibly by returning a default value or an empty response
                return Promise.resolve({ data: null });
            }
        },
        // refetchInterval: 5000,
        onSuccess: (response) => {
            if (response?.data?.response) {
                setDailyActivity(response.data.response);
            }
        }
    });
    return (
        <View style={{ flex: 1 }}>
            <Header
                title={activityName}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                showBackButton={true}
                onLeftIconPress={navigateToDashboard}
                leftIcon={<Back />}
            />
            <ScrollView style={{ flex: 1, backgroundColor: colour['theme-backgroung-color'] }}>
                {dailyActivity.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 200 }}>
                        <LottieView
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                            source={Loading}
                        />
                        <Text style={{ color: 'black' }}>Please Wait</Text>
                    </View>
                ) : (
                    dailyActivity.length > 0 ? (
                        dailyActivity?.map((part: any, index: number) => (
                            <View style={{ margin: 12 }} key={index}>
                                {/* <GestureHandlerRootView> */}
                                    <Elements part={part} />
                                {/* </GestureHandlerRootView> */}
                            </View>
                        ))
                    ) : (
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
                    )
                )}
            </ScrollView>
        </View>


    );
};

export default DailyActivity;
