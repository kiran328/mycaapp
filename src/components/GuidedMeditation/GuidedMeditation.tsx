import React, { FC, useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Modal, Animated, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import styles from './GuidedMeditationStyles';
import colours from '../../common/constants/styles.json';
import { useQuery } from 'react-query';
import { getMeditationPlaylist } from '../../common/apis/api';
import LottieView from 'lottie-react-native';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import NoData from '../../../assets/lottie/girl-doing-meditation.json';
import FastImage from 'react-native-fast-image';
import VerticalEllipses from '../../../assets/svg/verticalEllipses';
import AlbumArt from '../../../assets/images/music-video.png';
import MeditationPlayer from './MeditationPlayer/MeditationPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrackIndex, setIsPlaying, setPlaylist, setShowMeditationPlayer } from '../../redux/actions';
import { RootState } from '../../redux/rootReducer';
import SoundPlayer from 'react-native-sound-player';
import translate from '../../context/Translations';
import Back from '../../../assets/svg/back';

interface GuidedMeditationProps { }

interface Playlist {
    id: number;
    name: string;
    media_url: string;
}

const GuidedMeditation: FC<GuidedMeditationProps> = () => {
    const navigation: any = useNavigation();
    const dispatch: any = useDispatch();
    const [recordDetails, setRecordDetails] = useState<any>(null);

    const modalAnimatedValue = new Animated.Value(0);

    const playlist: any = useSelector((state: RootState) => state.app.playlist);
    const currentTrackIndex: any = useSelector((state: RootState) => state.app.currentTrackIndex);
    const showMeditationPlayer: any = useSelector((state: RootState) => state.app.showMeditationPlayer);

    const navigateToWellBeing = () => {
        navigation.navigate('WellBeing');
        dispatch(setCurrentTrackIndex(null))
        try {
            dispatch(setIsPlaying(false));
            SoundPlayer.stop();
        } catch (error) {
            console.log('Error pausing audio:', error);
        }
    };

    useEffect(() => {
        if (playlist && currentTrackIndex !== null && currentTrackIndex !== undefined) {
            setRecordDetails(playlist[currentTrackIndex]);
        }
    }, [playlist, currentTrackIndex]);

    useQuery({
        queryKey: ["guidedPlaylist"],
        queryFn: () => getMeditationPlaylist(),
        onSuccess(response) {
            if (response.data) {
                dispatch(setPlaylist(response.data.response.playlist));
            }
        }
    });

    useEffect(() => {
        const handleBackPress = () => {
            dispatch(setCurrentTrackIndex(null))
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

    useEffect(() => {
        if (showMeditationPlayer) {
            dispatch(setShowMeditationPlayer(true));
            Animated.timing(modalAnimatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(modalAnimatedValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }).start(() => {
                dispatch(setShowMeditationPlayer(false));
            });
        }
    }, [showMeditationPlayer]);

    const renderChapterItem = ({ item, index }: { item: Playlist, index: number }) => {
        const isYouTubeLink = item?.media_url?.includes('youtu');
        const isActiveTrack = index === currentTrackIndex;

        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.chapterItem, isActiveTrack && styles.activeChapterItem]}
                onPress={() => {
                    dispatch(setShowMeditationPlayer(true));
                    setRecordDetails(item);
                    dispatch(setCurrentTrackIndex(index))
                }}>
                <View style={styles.itemContainer}>
                    <View style={styles.itemContent}>
                        {!isYouTubeLink && item?.media_url ? (
                            <FastImage
                                source={{ uri: item?.media_url }}
                                resizeMode={FastImage.resizeMode.contain}
                                style={styles.thumbnail}
                            />
                        ) : (
                            <FastImage
                                source={AlbumArt}
                                resizeMode={FastImage.resizeMode.contain}
                                style={styles.thumbnail2}
                            />
                        )}
                        <Text
                            style={{ color: 'black', fontSize: 18, fontWeight: '500', flex: 1 }}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {item.name}
                        </Text>
                        {/* <TouchableOpacity style={styles.ellipsisButton} onPress={() => console.log("Pressed Dots")}>
                            <VerticalEllipses />
                        </TouchableOpacity> */}
                    </View>

                </View>
            </TouchableOpacity>
        );
    };

    const modalTranslateY = modalAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1000, 0]
    });

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate("GuidedMeditation")}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToWellBeing}
            />
            {/* <ScrollView contentContainerStyle={styles.upperContainer} horizontal={false} showsVerticalScrollIndicator={false}> */}
            {playlist?.length === 0 ? (
                <View style={styles.NodataLottie}>
                    <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                </View>
            ) : (
                <>
                    <View style={styles.profileContainer}>
                        <LottieView source={NoData} style={styles.lottieStyles} autoPlay loop />
                    </View>
                    <FlatList
                        data={playlist}
                        showsVerticalScrollIndicator={false}
                        style={styles.chapterList}
                        renderItem={renderChapterItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </>
            )}
            {/* </ScrollView> */}

            <Modal
                statusBarTranslucent
                transparent={true}
                visible={showMeditationPlayer}
                onRequestClose={() => dispatch(setShowMeditationPlayer(false))}
            >
                <Animated.View style={[styles.modalStyle, { transform: [{ translateY: modalTranslateY }] }]}>
                    <MeditationPlayer recordDetails={recordDetails} />
                </Animated.View>
            </Modal>
        </View>
    );
};

export default GuidedMeditation;
