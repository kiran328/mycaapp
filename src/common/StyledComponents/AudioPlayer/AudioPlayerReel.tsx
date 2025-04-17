import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import Slider from '@react-native-community/slider';
import WebView from 'react-native-webview';
import { setIsPaused, setIsPlaying } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import Svg, { G, Path, Rect } from 'react-native-svg';

interface AudioProps {
    content_url: string;
    contentType: string
}

const AudioPlayerReel: React.FC<AudioProps> = ({ content_url, contentType }) => {
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
            SoundPlayer.stop(); // Stop any ongoing audio when component unmounts
            dispatch(setIsPlaying(false)); // Reset isPlaying state
        };
    }, []);

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
                <View style={styles.audioButton}>
                    <Text style={styles.audioButtonText}>{isPlaying ?
                        <Svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                            <G id="SVGRepo_bgCarrier" strokeWidth="0"></G>
                            <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></G>
                            <G id="SVGRepo_iconCarrier">
                                <Rect x="4" y="4" width="6" height="16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></Rect>
                                <Rect x="14" y="4" width="6" height="16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></Rect>
                            </G>
                        </Svg> :
                        <Svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                            <G id="SVGRepo_bgCarrier" strokeWidth="0"></G>
                            <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></G>
                            <G id="SVGRepo_iconCarrier">
                                <Path d="M6 18V6L17 12L6 18Z" stroke="white" strokeWidth="2" strokeLinejoin="round"></Path>
                            </G>
                        </Svg>}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.audioContainer}>
            <View style={styles.audioControls}>
                {renderPlayPauseButton()}
                <Text style={styles.timeStyles}>{formatTime(currentTime)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={currentTime}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor="#007FFF"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#007FFF"
                />
                <Text style={styles.timeStyles}>{formatTime(duration)}</Text>
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
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 20,
    },
    audioControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    audioButton: {
        backgroundColor: '#007FFF',
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

export default AudioPlayerReel;
