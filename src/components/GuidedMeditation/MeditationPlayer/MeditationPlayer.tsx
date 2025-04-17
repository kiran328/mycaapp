import React, { FC, useEffect, useState } from 'react';
import { BackHandler, Dimensions, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './MeditationPlayerStyle';
import SoundPlayer from 'react-native-sound-player';
import { RepeatMode, setCurrentTrackIndex, setIsPlaying, setIsRepeat, setIsShuffle, setPlaylist, setShowMeditationPlayer } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import WebView from 'react-native-webview';
import { getYoutubeVideo } from '../../../common/functionUtils/functionUtils';
import FastImage from 'react-native-fast-image';
import MeditationAudioPlayer from '../../../common/StyledComponents/AudioPlayer/MeditationPlayer';
import Upward from '../../../../assets/svg/upward';
import PrevTrack from '../../../../assets/svg/prevTrack';
import NextTrack from '../../../../assets/svg/nextTrack';
import { RootState } from '../../../redux/rootReducer';
import CircleIcon from '../../../../assets/svg/filledCircle';
import Repeat from '../../../../assets/svg/noRepeat';
import ShuffleIcon from '../../../../assets/svg/shuffle';
import RepeatPlaylist from '../../../../assets/svg/repeatPlaylist';
import RepeatTrack from '../../../../assets/svg/repeatTrack';
import { useQueryClient } from 'react-query';

interface ChaptersProps {
    recordDetails: any
}

const MeditationPlayer: FC<ChaptersProps> = ({ recordDetails }) => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const playlist: any = useSelector((state: RootState) => state.app.playlist);
    const isRepeat: any = useSelector((state: RootState) => state.app.isRepeat);
    const isShuffle: any = useSelector((state: RootState) => state.app.isShuffle);
    const currentTrackIndex: any = useSelector((state: RootState) => state.app.currentTrackIndex);

    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (recordDetails?.media_type === 'VIDEO') {
            setIsVideoPlaying(true);
            try {
                dispatch(setIsPlaying(false));
                SoundPlayer.pause();
            } catch (error) {
                console.log('Error pausing audio:', error);
            }
        } else {
            dispatch(setIsPlaying(true));
        }
    }, [recordDetails]);

    useEffect(() => {
        const handleBackPress = () => {
            try {
                dispatch(setIsPlaying(false));
                SoundPlayer.pause();
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

    const handleVideo = (content_url: string) => {
        const youtubeVideo = getYoutubeVideo(content_url);
        if (youtubeVideo && isVideoPlaying) {

            return (
                <View style={styles.VideoStyle}>
                    <WebView
                        style={{ flex: 1 }}
                        allowsFullscreenVideo={true}
                        javaScriptEnabled={true}
                        source={{ uri: youtubeVideo }}
                    />
                </View>
            );
        }
        return null;
    };

    const handleNextTrack = async () => {
        const newIndex = (currentTrackIndex + 1) % playlist.length;

        if (newIndex === 0 && isRepeat !== 'repeatPlaylist') {
            dispatch(setIsPlaying(true));
            ToastAndroid.show('Playlist End', ToastAndroid.SHORT);
        } else {
            dispatch(setCurrentTrackIndex(newIndex));
            dispatch(setIsPlaying(true));
        }
    };

    const handlePrevTrack = () => {
        const newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;

        if (newIndex === playlist.length - 1 && isRepeat !== 'repeatPlaylist') {
            dispatch(setIsPlaying(true));
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

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                queryClient.invalidateQueries("guidedPlaylist")
                dispatch(setShowMeditationPlayer(false))
            }
            } style={{ padding: 16, marginTop: 16 }}>
                <Upward height={24} width={24} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.mediaContainer} horizontal={false} showsVerticalScrollIndicator={false}>
                {recordDetails?.media_type === 'VIDEO' ? handleVideo(recordDetails?.media_url) :
                    <FastImage
                        style={[
                            styles.imageView,
                            {
                                height: Dimensions.get('window').height * 0.35,
                                width: Dimensions.get('window').width,
                            },
                        ]}
                        source={{ uri: recordDetails?.media_url }}
                        resizeMode={FastImage.resizeMode.contain}
                    />}
                <View style={styles.title}>
                    <Text style={styles.titleText}>{recordDetails?.name}</Text>
                </View>
                {recordDetails?.media_type === 'VIDEO' ?
                    (<View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 64,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TouchableOpacity onPress={handleRepeat} style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {isRepeat === 'noRepeat' ? <Repeat /> : isRepeat === 'repeatPlaylist' ? <RepeatPlaylist /> : <RepeatTrack />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePrevTrack}>
                            <PrevTrack />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextTrack}>
                            <NextTrack />
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
                    ) : (
                        <MeditationAudioPlayer recordDetails={recordDetails} />
                    )}
                <View style={styles.description}>
                    <ScrollView contentContainerStyle={{
                        flexGrow: 1,
                        height: Dimensions.get('window').height * 0.5
                    }} showsVerticalScrollIndicator={true}>
                        <Text style={styles.descriptionText}>{recordDetails?.description}</Text>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

export default MeditationPlayer;
