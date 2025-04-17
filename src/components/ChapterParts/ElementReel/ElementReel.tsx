import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Dimensions, Platform, ActivityIndicator, ToastAndroid, BackHandler, AppState, Alert, Button } from 'react-native';
import HTML, { RenderHTML } from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import { GestureHandlerRootView, LongPressGestureHandler, TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';
import { handlePPTViewer, setFontFamilies, getYoutubeVideo } from '../../../common/functionUtils/functionUtils'; // Import helper functions for PDF and PPT viewers
import WebView from 'react-native-webview';

import PPTDOwnload from '../../../../assets/lottie/ppt-file-document.json'
import styles from './ElementReelStyles';
import AudioPlayer from '../../../common/StyledComponents/AudioPlayer/AudioPlayerBC';
import Pdf from 'react-native-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPlaying, setPartId } from '../../../redux/actions';
import SoundPlayer from 'react-native-sound-player';
import translate from '../../../context/Translations';
import Previous from '../../../../assets/svg/previous';
import Next from '../../../../assets/svg/next';
import CloseReel from '../../../../assets/svg/closeReel';
import Timer from '../../../../assets/svg/timer';
import { sendComponentTimeSpent } from '../../../common/apis/api';
import { RootState } from '../../../redux/rootReducer';
import { useQueryClient } from 'react-query';
import Loading from '../../../../assets/lottie/loading.json';
import CompletedTimer from '../../../../assets/svg/completedTimer';
import ZoomIn from '../../../../assets/svg/zoomin';
import ZoomOut from '../../../../assets/svg/zoomout';
import colour from '../../../common/constants/styles.json'
import AudioPlayerReel from '../../../common/StyledComponents/AudioPlayer/AudioPlayerReel';
import Speaker from '../../../../assets/svg/speaker';
import Stop from '../../../../assets/svg/stop';
import Tts from 'react-native-tts';
import Downward from '../../../../assets/svg/downward';
import Upward from '../../../../assets/svg/upward';
import Download from '../../../../assets/svg/download';
import PlayText from './TextToSpeech';

interface ElementProps {
    partContent: any;
    onClose: (elementTime: any) => void
    initialIndex: number;
    loading: boolean;
}

const ElementsReel: FC<ElementProps> = ({ partContent, onClose, initialIndex, loading }) => {

    const courseID: any = useSelector((state: RootState) => state.app.courseId);
    const chapterID: any = useSelector((state: RootState) => state.app.chapterId);
    const partID: any = useSelector((state: RootState) => state.app.partId);
    const isPlaying: any = useSelector((state: RootState) => state.app.isPlaying);

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [appState, setAppState] = useState(AppState.currentState);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [timerValues, setTimerValues] = useState<{ [key: number]: number }>({});
    const [timerKey, setTimerKey] = useState(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const modalFontSize: number = 18;
    const [fontSize, setFontSize] = useState<number>(modalFontSize);
    const dispatch = useDispatch();
    const timerRef = useRef<NodeJS.Timeout | null | any>(null);
    const timerValuesRef = useRef<any>(timerValues);
    const queryClient = useQueryClient();
    const [playText, setPlayText] = useState(false);

    const startTimer = () => {
        timerRef.current = setTimeout(() => {
            setElapsedTime(prevElapsedTime => {
                const newElapsedTime = prevElapsedTime + 1;
                setTimerValues(prevTimers => {
                    const updatedTimers = {
                        ...prevTimers,
                        [partContent[currentIndex].id]: newElapsedTime,
                    };
                    return updatedTimers;
                });
                return newElapsedTime;
            });
            startTimer();
        }, 1000);
    };

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        timerValuesRef.current = timerValues;
    }, [timerValues]);

    useEffect(() => {
        partContent.map((part: any) => (
            dispatch(setPartId(part.part_id))
        ));
    }, []);

    useEffect(() => {
        if (partContent && partContent.length > 0) {
            setIsLoading(false);
        }

        if (partContent[currentIndex].content_type === 'AUDIO') {
            SoundPlayer.play();
            dispatch(setIsPlaying(true))
        }
    }, [partContent, currentIndex]);

    useEffect(() => {
        const currentContent = partContent[currentIndex];
        const componentID = currentContent.id;
        const timeSpent = currentContent.component_info.total_time_completed;

        if (partContent[currentIndex]?.content_type === 'VIDEO') {
            setIsVideoPlaying(true);
        }

        if (timeSpent === 0) {
            setSeconds(timeSpent + 1);
        } else {
            setSeconds(timeSpent)
        }

        setTimerKey(prevKey => prevKey + 1);
        setElapsedTime(0);

        setTimerValues(prevTimers => {
            const updatedTimers = {
                ...prevTimers,
                [componentID]: timeSpent
            };
            return updatedTimers;
        });

        startTimer();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [currentIndex]);

    useEffect(() => {
        const currentContent = partContent[currentIndex];
        if (currentContent.content_type === 'AUDIO') {
            if (isPlaying) {
                const startTimer = () => {
                    timerRef.current = setTimeout(() => {
                        setElapsedTime(prevElapsedTime => {
                            const newElapsedTime = prevElapsedTime + 1;
                            setTimerValues(prevTimers => {
                                const updatedTimers = {
                                    ...prevTimers,
                                    [currentContent.id]: newElapsedTime,
                                };
                                return updatedTimers;
                            });
                            return newElapsedTime;
                        });
                        startTimer();
                    }, 1000);
                };
                startTimer();
            } else {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            }
        }
    }, [isPlaying, currentIndex]);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState: any) => {
            const updatedTimerValues = { ...timerValuesRef.current };

            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App has come to the foreground!');
            }

            if (nextAppState === 'inactive' || nextAppState === 'background') {
                await sendComponentTimeSpent(courseID, chapterID, partID, updatedTimerValues);
                queryClient.invalidateQueries("chapterParts")
            }

            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            const updatedTimerValues = { ...timerValuesRef.current };
            sendComponentTimeSpent(courseID, chapterID, partID, updatedTimerValues);
            subscription.remove();
        };
    }, [appState === 'background' || appState === 'inactive']);

    useEffect(() => {
        const handleBackPress = () => {
            handleReelsExit();
            queryClient.invalidateQueries("chapterParts")
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [timerRef.current]);

    const handleReelsExit = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            queryClient.invalidateQueries("chapterParts")
        }

        dispatch(setIsPlaying(false))

        const updatedTimerValues = { ...timerValues };

        onClose(updatedTimerValues);

    };

    const handleFontSize = (mode: string) => {
        setFontSize((prevFontSize) => {
            if (mode === 'increase' && prevFontSize < 32) {
                return prevFontSize + 1;
            } else if (mode === 'decrease' && prevFontSize > 16) {
                return prevFontSize - 1;
            }
            return prevFontSize;
        });
    };

    const handleNext = async () => {
        const updatedTimerValues = { ...timerValues };

        setIsLoading(true);
        setTimerKey(prevKey => prevKey + 1);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        let nextIndex = currentIndex + 1;
        while (nextIndex < partContent.length && partContent[nextIndex].content_type === 'QUIZ') {
            nextIndex++;
        }
        try {
            const response = await sendComponentTimeSpent(courseID, chapterID, partID, updatedTimerValues);
            queryClient.invalidateQueries("chapterPartComponent");
            if (nextIndex < partContent.length && response?.data) {
                setCurrentIndex(nextIndex);
                if (partContent[currentIndex].component_info.total_time_completed === 0) {
                    setSeconds(partContent[currentIndex].component_info.total_time_completed + 1);
                } else {
                    setSeconds(partContent[currentIndex].component_info.total_time_completed)
                }

                if (partContent[currentIndex].content_type !== 'VIDEO') {
                    setIsVideoPlaying(true);
                } else {
                    setIsVideoPlaying(false);
                }

                if (partContent[currentIndex].content_type !== 'AUDIO') {
                    try {
                        dispatch(setIsPlaying(false));
                        SoundPlayer.stop();
                    } catch (error) {
                        console.log('Error pausing audio:', error);
                    }
                } else {
                    dispatch(setIsPlaying(true));
                }

                if (playText) {
                    setPlayText(false);
                    Tts.stop();
                }
            } else {
                ToastAndroid.show(translate("EndofElements"), ToastAndroid.SHORT);
                handleReelsExit();
            }
        } catch (err) {
            console.error("Error going to next component", err)
        }
    };

    const handlePrevious = async () => {
        const updatedTimerValues = { ...timerValues };

        setIsLoading(true);
        setTimerKey(prevKey => prevKey - 1);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        let prevIndex = currentIndex - 1;
        while (prevIndex >= 0 && partContent[prevIndex].content_type === 'QUIZ') {
            prevIndex--;
        }
        try {
            const response = await sendComponentTimeSpent(courseID, chapterID, partID, updatedTimerValues);
            queryClient.invalidateQueries("chapterPartComponent");

            if (prevIndex >= 0 && response?.data) {
                setCurrentIndex(prevIndex);

                // Update based on the new currentIndex
                if (partContent[prevIndex].component_info.total_time_completed === 0) {
                    setSeconds(partContent[prevIndex].component_info.total_time_completed + 1);
                } else {
                    setSeconds(partContent[prevIndex].component_info.total_time_completed);
                }

                if (partContent[prevIndex].content_type !== 'VIDEO') {
                    setIsVideoPlaying(true);
                } else {
                    setIsVideoPlaying(false);
                }

                if (partContent[prevIndex].content_type !== 'AUDIO') {
                    try {
                        dispatch(setIsPlaying(true));
                        SoundPlayer.stop();
                    } catch (error) {
                        console.log('Error pausing audio:', error);
                    }
                } else {
                    dispatch(setIsPlaying(true));
                }

                if (playText) {
                    setPlayText(false);
                    Tts.stop();
                }
            } else {
                ToastAndroid.show(translate("NoPreviousElements"), ToastAndroid.SHORT);
            }
        } catch (err) {
            console.error("Error going to the previous component", err);
        }
    };
    const handlePlayText = () => {
        setPlayText(prevPlayText => {
            if (prevPlayText) {
                // Stop playback
                Tts.stop();
                return false;
            } else {
                // Start playback
                return true;
            }
        });
    };

    const handleOpenLink = () => {
        console.log("Opening Link...")
    }

    const renderElement = (part: any) => {
        const { content_type, content_url, content } = part;

        switch (content_type) {

            case 'TEXT':
                return (
                    <View style={styles.HTMLText}>
                        {playText ? (
                            <PlayText
                                content={partContent[currentIndex].content}
                                contentIndex={0}
                                key={0}
                                playingIndex={0}
                                playing={playText}
                                handleSpeech={setPlayText}
                                chapter_id={chapterID || -1}
                                part_id={partID || -1}
                                componentID={partContent[currentIndex].id}
                                handleOpenLink={handleOpenLink}
                            />
                        ) :
                            <RenderHTML
                                baseStyle={{ color: 'black', textAlign: 'justify' }}
                                source={{
                                    html: content || '<span></span>',
                                }}
                                tagsStyles={{
                                    h1: {
                                        fontWeight: 'normal',
                                        textDecorationColor: 'white',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    h2: {
                                        fontWeight: 'normal',
                                        textDecorationColor: 'white',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    h3: {
                                        fontWeight: 'normal',
                                        textDecorationColor: 'white',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    h4: {
                                        fontWeight: 'normal',
                                        textDecorationColor: 'white',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    h5: {
                                        fontWeight: 'normal',
                                        textDecorationColor: 'white',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    h6: {
                                        fontWeight: 'normal',
                                        textDecorationColor: 'white',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    span: {
                                        textDecorationColor: 'white',
                                        fontWeight: 'normal',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    div: {
                                        textDecorationColor: 'white',
                                        fontWeight: 'normal',
                                        fontSize: fontSize,
                                        margin: 0,
                                        padding: 0,
                                    },
                                    p: {
                                        margin: 0,
                                        padding: 0,
                                        textDecorationColor: 'white',
                                        fontWeight: 'normal',
                                        fontSize: fontSize
                                    },
                                    li: {
                                        margin: 0,
                                        padding: 0,
                                        textDecorationColor: 'white',
                                        fontWeight: 'normal',
                                        fontSize: fontSize
                                    }
                                }}
                                contentWidth={Dimensions.get('window').width}
                            />
                        }
                    </View>
                );
            case 'QUIZ':
                return null;
            case 'IMAGE':
                return (
                    <View style={styles.imageStyle}>
                        <FastImage
                            style={[
                                styles.imageView,
                                {
                                    height: Dimensions.get('window').height * 0.5,
                                    width: Dimensions.get('window').width,
                                },
                            ]}
                            source={{ uri: content_url }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>{content}</Text>
                    </View>
                );
            case 'AUDIO':
                return (
                    <View style={styles.AudioStyle}>
                        <AudioPlayerReel content_url={content_url} contentType={partContent[currentIndex].content_type} />
                    </View>
                );
            case 'PDF':
                return (
                    <View style={{
                        flex: 1,
                        display: 'flex',
                        width: '100%'
                    }}>
                        <Pdf
                            trustAllCerts={false}
                            source={{ uri: content_url, cache: true }}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`Number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log('PDF Error:', error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link pressed: ${uri}`);
                            }}
                            style={{ flex: 1, height: Dimensions.get('window').height }}
                        />
                        {/* <Text>No PDF</Text */}
                    </View>
                );

            case 'PPT':
                const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${content_url}&embedded=true`;
                return (
                    <View style={{ flex: 1, width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }}>
                        <WebView
                            style={{ flex: 1 }}
                            source={{ uri: googleDocsViewerUrl }}
                            javaScriptEnabled={true}
                            scrollEnabled={true} // Enable scrolling
                            startInLoadingState={true}
                            renderLoading={() => <ActivityIndicator size="large" color="blue" />}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView error: ', nativeEvent);
                            }}
                        />
                        <GestureHandlerRootView>
                            <RNGHTouchableOpacity onPress={() => handlePPTViewer(content_url)} style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
                                <Text style={{ color: 'black', fontWeight: '500', fontSize: 16, textAlign: 'center' }}>Download PPT <Download /></Text>
                            </RNGHTouchableOpacity>
                        </GestureHandlerRootView>
                    </View>
                );

            case 'VIDEO':
                const youtubeVideo = getYoutubeVideo(content_url);
                if (youtubeVideo && isVideoPlaying) {

                    return (
                        <View style={styles.VideoStyle}>
                            <View style={styles.videoContainer}>
                                <WebView
                                    style={{ flex: 1, borderRadius: 16 }}
                                    javaScriptEnabled={true}
                                    allowsFullscreenVideo={true}
                                    source={{ uri: youtubeVideo }}
                                />
                            </View>
                            {content &&
                                <ScrollView style={styles.textContainer}>
                                    <Text style={styles.text}>{content}</Text>
                                </ScrollView>
                            }
                        </View>
                    );
                }
                return null;

            case 'GFORM':
                return (
                    <View style={styles.GFormStyle}>
                        <WebView
                            style={{ width: Dimensions.get('window').width * 0.8, height: 500 }}
                            javaScriptEnabled={true}
                            source={{ uri: content_url }}
                            scrollEnabled={true}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <ActivityIndicator size="large" color="blue" />
                            )}
                        />
                    </View>
                );
            case 'GIF':
                return (
                    <View style={styles.GifStyle}>
                        <FastImage
                            style={[
                                styles.imageView,
                                {
                                    height: Dimensions.get('window').height * 0.5,
                                    width: Dimensions.get('window').width,
                                },
                            ]}
                            source={{ uri: content_url }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>{content}</Text>
                    </View>
                );
            case 'LOTTIE':
                return (
                    <View style={styles.lottieStyle}>
                        <LottieView
                            source={{ uri: content_url }}
                            autoPlay
                            loop
                            style={{
                                height: Dimensions.get('window').height * 0.5,
                                width: Dimensions.get('window').width,
                                aspectRatio: 1.45
                            }}
                        />
                        <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>{content}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <View style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                padding: 16,
                backgroundColor: 'white'
            }}>
                <TouchableOpacity onPress={handleReelsExit}>
                    <CloseReel />
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 1,
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                backgroundColor: 'white',
            }}>
                {isLoading || loading ? (
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: -50 }}>
                        <LottieView
                            autoPlay
                            loop
                            style={{ width: 150, height: 150 }}
                            source={Loading}
                        />
                        <Text style={{ color: 'black' }}>Please Wait</Text>
                    </View>
                ) : (
                    <>
                        {partContent[currentIndex]?.content_type === 'PPT' ? (
                            <View style={{ flex: 1 }}>
                                {renderElement(partContent[currentIndex])}
                            </View>
                        ) : (
                            <ScrollView>
                                {partContent?.map((part: any, index: number) => (
                                    <View key={index} style={{
                                        flex: 1,
                                        margin: 15,
                                        display: index === currentIndex ? 'flex' : 'none',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {renderElement(part)}
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                        <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                            {partContent[currentIndex]?.content_type === 'TEXT' &&
                                <View style={styles.fontSizeButtons}>
                                    {!playText ?
                                        <>
                                            <TouchableOpacity style={{ backgroundColor: colour['theme-color'], borderRadius: 32, padding: 4, opacity: 0.75 }} onPress={() => handleFontSize('increase')}>
                                                <ZoomIn />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: colour['theme-color'], borderRadius: 32, padding: 4, opacity: 0.75 }} onPress={() => handleFontSize('decrease')}>
                                                <ZoomOut />
                                            </TouchableOpacity>
                                        </> :
                                        <></>
                                    }
                                    <TouchableOpacity style={{ backgroundColor: colour['theme-color'], borderRadius: 32, padding: 4, opacity: 0.75 }} onPress={handlePlayText}>
                                        {!playText ? <Speaker /> : <Stop />}
                                    </TouchableOpacity>
                                </View>}
                            <View style={styles.reelNavigationButtons}>
                                <TouchableOpacity onPress={handlePrevious}>
                                    <Previous />
                                </TouchableOpacity>
                                {partContent[currentIndex]?.component_info?.is_component_completed ?
                                    <CompletedTimer /> :
                                    <Timer
                                        timerKey={timerKey}
                                        seconds={seconds}
                                        timeAllotted={partContent[currentIndex].time}
                                        isPlaying={partContent[currentIndex].content_type === 'AUDIO' ? isPlaying : true}
                                    />
                                }
                                <TouchableOpacity onPress={handleNext}>
                                    <Next />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </>
    );
};

export default ElementsReel;