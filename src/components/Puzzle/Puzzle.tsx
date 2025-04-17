import React, { FC, useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../common/StyledComponents/Header';
import colour from '../../common/constants/styles.json';
import { useNavigation } from '@react-navigation/native';
import styles from './PuzzleStyle';
import HTML from 'react-native-render-html';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getPuzzle } from '../../common/apis/api';
import { RootState } from '../../redux/rootReducer';
import FastImage from 'react-native-fast-image';
import WebView from 'react-native-webview';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import translate from '../../context/Translations';
import { formatTime, getYoutubeVideo } from '../../common/functionUtils/functionUtils';
import LottieView from 'lottie-react-native'; // Import Lottie
import Loading from '../../../assets/lottie/loading.json'; // Path to your Lottie file
import Back from '../../../assets/svg/back';

interface PuzzleProps { }

const Puzzle: FC<PuzzleProps> = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const puzzleID: any = useSelector((state: RootState) => state.app.puzzleId);
    const puzzleName: any = useSelector((state: RootState) => state.app.puzzleName);
    const [puzzleInfo, setPuzzleInfo] = useState<any[]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [timer, setTimer] = useState<number | null>(null);
    const [timerActive, setTimerActive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        if (puzzleInfo.length > 0) {
            startTimer(puzzleInfo[0].wait_time);
        }
    }, [puzzleInfo]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerActive && timer !== null) {
            interval = setInterval(() => {
                setTimer((prevTimer: number | null) => {
                    if (prevTimer !== null) {
                        if (prevTimer === 1) { // Check if the next value will be 0
                            setTimerActive(false);
                            clearInterval(interval);
                            setIsButtonDisabled(false);
                            return 0; // Immediately set to 0 and stop the timer
                        } else {
                            return prevTimer - 1;
                        }
                    }
                    return prevTimer;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timerActive, timer]);


    const startTimer = (initialTime: number) => {
        setTimer(initialTime);
        setTimerActive(true);
    };

    useQuery({
        queryKey: ["puzzle"],
        queryFn: () => getPuzzle(puzzleID),
        onSuccess(response) {
            if (response.data && response.data.response.length > 0) {
                setPuzzleInfo(response.data.response);
            }
            setLoading(false); // Set loading to false once data is fetched
        },
        onError() {
            setLoading(false); // Set loading to false in case of error
        }
    });

    const navigateToPuzzleList = () => {
        navigation.navigate('PuzzleList');
    };

    const handleExpertAnswerClick = () => {
        setShowAnswer(true);
    };

    const renderYoutubeVideo = (content_url: string) => {
        const youtubeVideo = getYoutubeVideo(content_url);
        if (youtubeVideo) {

            return (
                <View style={styles.VideoStyle}>
                    <WebView
                        style={{ flex: 1, borderRadius: 16 }}
                        javaScriptEnabled={true}
                        allowsFullscreenVideo={true}
                        source={{ uri: youtubeVideo }}
                    />
                </View>
            );
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                title={puzzleName}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToPuzzleList}
            />

            <View style={styles.container}>
                {loading ? (
                    <LottieView
                        autoPlay
                        loop
                        style={{ width: 200, height: 200 }}
                        source={Loading}
                    />
                ) : (
                    <>
                        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                            {puzzleInfo[0]?.puzzle_media_type === 'IMAGE' ?
                                <FastImage
                                    style={{
                                        height: Dimensions.get('window').height * 0.35,
                                        width: Dimensions.get('window').width,
                                        borderRadius: 18
                                    }}
                                    source={{ uri: puzzleInfo[0]?.puzzle_media }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                :
                                renderYoutubeVideo(puzzleInfo[0]?.puzzle_media)
                            }

                            <View style={styles.puzzleQuestion}>
                                <HTML
                                    baseStyle={styles.baseFontStyle}
                                    source={{
                                        html: puzzleInfo[0]?.puzzle_content || '<span></span>',
                                    }}
                                    contentWidth={Dimensions.get('window').width}
                                />
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.expertAnswer, isButtonDisabled && { backgroundColor: 'gray' }]}
                            activeOpacity={0.6}
                            onPress={handleExpertAnswerClick}
                            disabled={isButtonDisabled}
                        >
                            {timer !== null && timer > 0 ?
                                <Text style={styles.text}>
                                    {translate("SeeExpertAnswer")} ({formatTime(timer)})
                                </Text> :
                                <Text style={styles.text}>
                                    {translate("SeeExpertAnswer")}
                                </Text>
                            }
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <CustomModal
                visible={showAnswer}
                onRequestClose={() => setShowAnswer(false)}
            >
                <View style={styles.puzzleAnswer}>
                    <HTML
                        baseStyle={styles.baseFontStyle}
                        source={{
                            html: puzzleInfo[0]?.puzzle_answer || '<span></span>',
                        }}
                        contentWidth={Dimensions.get('window').width}
                    />
                </View>
            </CustomModal>
        </View>
    );
};

export default Puzzle;
