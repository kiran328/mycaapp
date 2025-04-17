
import React, { FC, useCallback, useState } from 'react'
import { View, Text, Button, ScrollView, FlatList, RefreshControl, TouchableOpacity, Modal, ToastAndroid, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import translate from '../../context/Translations';
import colours from '../../common/constants/styles.json'
import { useQuery, useQueryClient } from 'react-query';
import { getGuidedExercises } from '../../common/apis/api';
import LottieView from 'lottie-react-native';
import styles from './GuidedExerciseStyle';
import { useDispatch, useSelector } from 'react-redux';
import { setBreathingDetails, setExerciseDetails, setIsAnimationRunning, setIsPlaying } from '../../redux/actions';
import HealthWorkerPNG from '../../../assets/lottie/breathing-exercise.json';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import ScrollTimerPicker from '../../common/StyledComponents/ScrollTimePicker/ScrollTimePicker';
import { RootState } from '../../redux/rootReducer';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import FastImage from 'react-native-fast-image';
import Back from '../../../assets/svg/back';

interface GuidedExerciseProps { }

interface Exercise {
    id: number;
    exercise_name: string;
    img_url: string;
}

const GuidedExercise: FC<GuidedExerciseProps> = () => {

    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const exerciseTimer: any = useSelector((state: RootState) => state.app.timer);

    const [guidedExercise, setGuidedExercise] = useState<any>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);

    const navigateToWellBeing = () => {
        navigation.navigate('WellBeing');
    };

    useQuery({
        queryKey: ["guidedExercises"],
        queryFn: getGuidedExercises,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data) {
                const steps = response.data.response.level_list
                setGuidedExercise(steps);
            }
        }
    });

    const navigateToExerciseScreen = () => {
        dispatch(setExerciseDetails({
            id: selectedExercise?.id,
            title: selectedExercise?.exercise_name,
            description: selectedExercise?.description,
        }))
        dispatch(setIsPlaying(true));
        dispatch(setIsAnimationRunning(false))
        setIsVisible(false);
        navigation.navigate('ExerciseSteps');
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("guidedExercises");
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
                {item?.exercise_name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate('GuidedExercise')}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToWellBeing}
            />
            {guidedExercise.length === 0 ? (
                <View style={styles.NodataLottie}>
                    <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                </View>
            ) : (
                <>
                    <View style={styles.profileContainer}>
                        <LottieView source={HealthWorkerPNG} style={styles.lottieStyles} autoPlay loop />
                    </View>
                    <FlatList
                        data={guidedExercise}
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
                <View style={styles.modalContent}>
                    <Text style={{ color: 'black', fontWeight: '500', fontSize: 20 }}>Exercise Details</Text>
                    <View style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 16,
                        gap: 8
                    }}>
                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 16, textAlign: 'center' }}>{selectedExercise?.exercise_name}</Text>
                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>LEVEL: {selectedExercise?.difficulty_level}</Text>
                        <TouchableOpacity
                            style={styles.expertAnswer}
                            activeOpacity={0.6}
                            onPress={() => {
                                navigateToExerciseScreen();
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

export default GuidedExercise
