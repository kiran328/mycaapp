import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import Slider from '@react-native-community/slider';
import WebView from 'react-native-webview';
import { setIsPlaying, setIsPaused } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import Svg, { G, Path, Rect } from 'react-native-svg';

interface AudioProps {
    content_url: string;
    contentType: string;
}

const AudioPlayer: React.FC<AudioProps> = ({ content_url, contentType }) => {
    const dispatch = useDispatch();
    const isPlaying: any = useSelector((state: RootState) => state.app.isPlaying);
    const isPaused: any = useSelector((state: RootState) => state.app.isPaused);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);

    const updateCurrentTime = useCallback(async () => {
        try {
            const info = await SoundPlayer.getInfo();
            if (info && info.currentTime !== null) {
                setCurrentTime(info.currentTime);
            }
        } catch (error) {
            console.log('Error getting current time:', error);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(interval);
    }, [updateCurrentTime]);

    useEffect(() => {
        return () => {
            SoundPlayer.stop();
            dispatch(setIsPlaying(false));
        };
    }, []);

    useEffect(() => {
        if (contentType === 'AUDIO') {
            handlePlayAudio();
        }
    }, [contentType, content_url]);

    useEffect(() => {
        const onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', () => {
            dispatch(setIsPlaying(false));
        });

        return () => {
            onFinishedPlayingSubscription.remove();
        };
    }, [dispatch]);

    const handlePlayAudio = async () => {
        try {
            dispatch(setIsPlaying(true));
            if (isPaused) {
                await SoundPlayer.resume();
            } else {
                await SoundPlayer.playUrl(content_url);
            }
            const info = await SoundPlayer.getInfo();
            if (info && info.duration !== null) {
                setDuration(info.duration);
            }
            dispatch(setIsPaused(false));
        } catch (error) {
            console.log('Error playing audio:', error);
        }
    };

    const handlePauseAudio = async () => {
        try {
            dispatch(setIsPlaying(false));
            await SoundPlayer.pause();
            dispatch(setIsPaused(true));
        } catch (error) {
            console.log('Error pausing audio:', error);
        }
    };

    const handleSeek = async (value: number) => {
        try {
            await SoundPlayer.seek(value);
            setCurrentTime(value);
        } catch (error) {
            console.log('Error seeking audio:', error);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderPlayPauseButton = () => {
        return (
            <TouchableOpacity onPress={isPlaying ? handlePauseAudio : handlePlayAudio}>
                <View style={[styles.audioButton]}>
                    <Text style={styles.audioButtonText}>
                        {isPlaying ? (
                            <Svg
                                fill="#e598ec"
                                height="100px"
                                width="100px"
                                viewBox="0 0 512 512"
                                stroke="#e598ec"
                            >
                                <Path d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M224,320 c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z M352,320 c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z" />
                            </Svg>
                        ) : (
                            <Svg
                                height="100px"
                                width="100px"
                                viewBox="0 0 512 512"
                                fill="#e598ec"
                                stroke="#e598ec"
                            >
                                <G id="SVGRepo_bgCarrier" strokeWidth="0"></G>
                                <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></G>
                                <G id="SVGRepo_iconCarrier">
                                    <Path
                                        d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
                                C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
                                c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
                                l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"
                                    />
                                </G>
                            </Svg>
                        )}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.audioContainer}>
            <View style={styles.audioControls}>
                {renderPlayPauseButton()}
            </View>
            {Platform.OS === 'ios' ? (
                <WebView
                    style={styles.audioWebView}
                    javaScriptEnabled={true}
                    source={{ uri: content_url }}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    audioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    audioControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    audioButton: {
        // backgroundColor: ,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 4,
        marginRight: 16,
    },
    audioButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    audioWebView: {
        width: '100%',
        height: 150,
        marginTop: 10,
    },
    timeStyles: {
        color: 'black'
    }
});

export default AudioPlayer;
