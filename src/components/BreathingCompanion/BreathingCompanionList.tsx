
import React, { FC, useCallback, useState } from 'react'
import { View, Text, Button, ScrollView, FlatList, RefreshControl, TouchableOpacity, Modal, ToastAndroid, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import translate from '../../context/Translations';
import colours from '../../common/constants/styles.json'
import { useQuery, useQueryClient } from 'react-query';
import { getBreathingLevels } from '../../common/apis/api';
import LottieView from 'lottie-react-native';
import styles from './BreathingCompanionStyles';
import { useDispatch, useSelector } from 'react-redux';
import { setBreathingDetails, setIsAnimationRunning, setIsPlaying } from '../../redux/actions';
import HealthWorkerPNG from '../../../assets/lottie/breathing-exercise.json';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import ScrollTimerPicker from '../../common/StyledComponents/ScrollTimePicker/ScrollTimePicker';
import { RootState } from '../../redux/rootReducer';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import FastImage from 'react-native-fast-image';
import Back from '../../../assets/svg/back';

interface BreathingCompanionProps { }

interface Exercise {
    id: number;
    level_name: string;
    img_url: string;
}

const BreathingCompanion: FC<BreathingCompanionProps> = () => {

    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const exerciseTimer: any = useSelector((state: RootState) => state.app.timer);

    const [breathingLevels, setBreathingLevels] = useState<any>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);

    const navigateToWellBeing = () => {
        navigation.navigate('WellBeing');
    };

    useQuery({
        queryKey: ["breathingLevels"],
        queryFn: getBreathingLevels,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data) {
                setBreathingLevels(response.data.response.level_list)
            }
        }
    });

    const navigateToBreathingScreen = (mode: string) => {
        dispatch(setBreathingDetails({
            id: selectedExercise?.id,
            title: selectedExercise?.level_name,
            image_url: selectedExercise?.img_url,
            description: selectedExercise?.description,
            mode: mode
        }))
        dispatch(setIsPlaying(true));
        dispatch(setIsAnimationRunning(false))
        setIsVisible(false);
        navigation.navigate('BreathingExercise');
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("breathingLevels");
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }

    }, []);

    const renderChapterItem = ({ item }: { item: Exercise }) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.chapterItem]}
            onPress={() => {
                setIsVisible(true)
                setSelectedExercise(item);
            }}>
            <FastImage
                source={{ uri: item.img_url }}
                resizeMode={FastImage.resizeMode.contain}
                style={styles.thumbnail}
            />
            <Text
                style={{ color: 'black', fontSize: 18, fontWeight: '500', flex: 1, marginLeft: 8 }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {item?.level_name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate('BreathingCompanion')}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                onLeftIconPress={navigateToWellBeing}
                leftIcon={<Back />}
            />
            {breathingLevels.length === 0 ? (
                <View style={styles.NodataLottie}>
                    <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                </View>
            ) : (
                <>
                    <View style={styles.profileContainer}>
                        <LottieView source={HealthWorkerPNG} style={styles.lottieStyles} autoPlay loop />
                    </View>
                    <FlatList
                        data={breathingLevels}
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

            <CustomModal
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            >
                <View style={[styles.modalContent, { alignItems: 'center' }]}>
                    <Text style={{ color: 'black', fontWeight: '500', fontSize: 20 }}>Press 'Start' to begin</Text>
                    <View style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 16
                    }}>
                        {/* <TouchableOpacity
                            style={[styles.expertAnswer]}
                            activeOpacity={0.6}
                            onPress={() => {
                                navigateToBreathingScreen("moderate");
                            }}
                        >
                            <Text style={styles.text}>{'Moderate'}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            style={styles.expertAnswer}
                            activeOpacity={0.6}
                            onPress={() => {
                                navigateToBreathingScreen("simple");
                            }}
                        >
                            <Text style={styles.text}>{'Start'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CustomModal>
        </View>
    )
}

export default BreathingCompanion
