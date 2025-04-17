import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, ToastAndroid } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import Slider from '@react-native-community/slider';
import WebView from 'react-native-webview';
import { RepeatMode, setCurrentTrackIndex, setIsPaused, setIsPlaying, setIsRepeat, setIsShuffle, setPlaylist } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import Svg, { G, Path, Rect } from 'react-native-svg';
import PrevTrack from '../../../../assets/svg/prevTrack';
import NextTrack from '../../../../assets/svg/nextTrack';
import Repeat from '../../../../assets/svg/noRepeat';
import ShuffleIcon from '../../../../assets/svg/shuffle';
import CircleIcon from '../../../../assets/svg/filledCircle';
import RepeatPlaylist from '../../../../assets/svg/repeatPlaylist';
import RepeatTrack from '../../../../assets/svg/repeatTrack';

interface AudioProps {
    recordDetails: any
}

const MeditationAudioPlayer: React.FC<AudioProps> = ({ recordDetails }) => {
    const dispatch = useDispatch();
    const isPlaying: any = useSelector((state: RootState) => state.app.isPlaying);
    const isPaused: any = useSelector((state: RootState) => state.app.isPaused);
    const playlist: any = useSelector((state: RootState) => state.app.playlist);
    const currentTrackIndex: any = useSelector((state: RootState) => state.app.currentTrackIndex);
    const isRepeat: any = useSelector((state: RootState) => state.app.isRepeat);
    const isShuffle: any = useSelector((state: RootState) => state.app.isShuffle);

    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);


    useEffect(() => {
        const updateCurrentTime = async () => {
            try {
                const info = await SoundPlayer.getInfo();
                if (info && info.currentTime !== null) {
                    setCurrentTime(info.currentTime);
                }
            } catch (error) {
                console.log('Error getting current time:', error);
            }
        };

        dispatch(setIsPlaying(true));

        const interval = setInterval(() => {
            updateCurrentTime();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (recordDetails?.media_type === 'AUDIO') {
            playCurrentTrack();
        }
    }, [currentTrackIndex]);

    useEffect(() => {
        const onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', () => {
            if (isRepeat === 'repeatTrack') {
                handlePlayAudio();
            } else {
                SoundPlayer.stop();
                dispatch(setIsPlaying(false));
            }
        });

        return () => {
            onFinishedPlayingSubscription;
        };
    }, [dispatch]);

    const playCurrentTrack = async () => {
        try {
            const currentTrack = playlist[currentTrackIndex];
            await SoundPlayer.playUrl(currentTrack.audio_url);
            const info = await SoundPlayer.getInfo();
            if (info && info.duration !== null) {
                setDuration(info.duration);
            }
        } catch (error) {
            console.log('Error playing audio:', error);
        }
    };

    const handlePlayAudio = async () => {
        try {
            dispatch(setIsPlaying(true));
            if (isPaused) {
                await SoundPlayer.resume();
            } else {
                await SoundPlayer.playUrl(playlist[currentTrackIndex].audio_url);
            }
            dispatch(setIsPaused(false));
        } catch (error) {
            console.log('Error playing audio:', error);
        }
    };

    const handlePauseAudio = async () => {
        try {
            dispatch(setIsPlaying(false));
            SoundPlayer.pause();
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

    const handleNextTrack = async () => {
        // Calculate the next index
        const newIndex = (currentTrackIndex + 1) % playlist.length;
        // Dispatch action with the new index as payload

        if (newIndex === 0 && isRepeat !== 'repeatPlaylist') {
            dispatch(setIsPlaying(true));
            // Show toast message or handle end of playlist behavior
            ToastAndroid.show('Playlist End', ToastAndroid.SHORT);
        } else {
            dispatch(setCurrentTrackIndex(newIndex));
            dispatch(setIsPlaying(true));
        }
    };

    const handlePrevTrack = () => {
        // Calculate the previous index
        const newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;

        // Dispatch action with the new index as payload
        if (newIndex === playlist.length - 1 && isRepeat !== 'repeatPlaylist') {
            dispatch(setIsPlaying(true));
            // Show toast message or handle end of playlist behavior
            ToastAndroid.show('Playlist End', ToastAndroid.SHORT);
        } else {
            dispatch(setCurrentTrackIndex(newIndex));
            dispatch(setIsPlaying(true));
        }
    };


    const handleShuffle = () => {
        const shuffle = isShuffle
        { shuffle ? ToastAndroid.show('Shuffle Off', ToastAndroid.SHORT) : ToastAndroid.show('Shuffle On', ToastAndroid.SHORT); }
        dispatch(setIsShuffle(!shuffle));

        if (!shuffle) {
            const shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5);
            dispatch(setPlaylist(shuffledPlaylist));
        }
    };

    const handleRepeat = () => {
        let nextMode: RepeatMode;

        // Determine the next repeat mode based on current state
        switch (isRepeat) {
            case 'noRepeat':
                nextMode = 'repeatTrack';
                ToastAndroid.show('Repeat Track On', ToastAndroid.SHORT);
                break;
            case 'repeatTrack':
                nextMode = 'repeatPlaylist';
                ToastAndroid.show('Repeat Playlist On', ToastAndroid.SHORT);
                break;
            case 'repeatPlaylist':
                nextMode = 'noRepeat';
                ToastAndroid.show('Repeat Off', ToastAndroid.SHORT);
                break;
            default:
                nextMode = 'noRepeat';
        }

        dispatch(setIsRepeat(nextMode));
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.audioContainer}>
            <View style={styles.audioControls}>
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
            <View style={styles.controls}>
                <TouchableOpacity onPress={handleRepeat} style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {isRepeat === 'noRepeat' ? <Repeat /> : isRepeat === 'repeatPlaylist' ? <RepeatPlaylist /> : <RepeatTrack />}
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePrevTrack}>
                    {/* <View style={styles.audioButton}> */}
                    <PrevTrack />
                    {/* </View> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? handlePauseAudio : handlePlayAudio}>
                    <View style={styles.audioButton}>
                        <Text style={styles.audioButtonText}>{isPlaying ?
                            <Svg width="35px" height="35px" viewBox="0 0 24 24" fill="none">
                                <G id="SVGRepo_bgCarrier" strokeWidth="0"></G>
                                <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></G>
                                <G id="SVGRepo_iconCarrier">
                                    <Rect x="4" y="4" width="6" height="16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></Rect>
                                    <Rect x="14" y="4" width="6" height="16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></Rect>
                                </G>
                            </Svg> :
                            <Svg width="35px" height="35px" viewBox="0 0 24 24" fill="none">
                                <G id="SVGRepo_bgCarrier" strokeWidth="0"></G>
                                <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></G>
                                <G id="SVGRepo_iconCarrier">
                                    <Path d="M6 18V6L17 12L6 18Z" stroke="white" strokeWidth="2" strokeLinejoin="round"></Path>
                                </G>
                            </Svg>}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNextTrack}>
                    {/* <View style={styles.audioButton}> */}
                    <NextTrack />
                    {/* </View> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShuffle} style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: isShuffle ? -10 : 0
                }}>
                    {isShuffle && <View style={{ top: 8 }}>
                        <CircleIcon />
                    </View>}
                    <ShuffleIcon />
                </TouchableOpacity>
            </View>
            {Platform.OS === 'ios' ? (
                <WebView
                    style={styles.audioWebView}
                    javaScriptEnabled={true}
                    source={{ uri: playlist[currentTrackIndex].audio_url }}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    audioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 20,
    },
    audioControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32
    },
    audioButton: {
        backgroundColor: '#007FFF',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 100,
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

export default MeditationAudioPlayer;
