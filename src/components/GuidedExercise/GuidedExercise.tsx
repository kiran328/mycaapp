import React, { FC, useEffect, useState } from 'react';
import { Button, Dimensions, Text, TouchableOpacity, View, Image, BackHandler, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import colours from '../../common/constants/styles.json';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import styles from './ExerciseStepsStyle';
import FastImage from 'react-native-fast-image';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import { setIsAnimationRunning, setIsPaused, setIsPlaying } from '../../redux/actions';
import LottieView from 'lottie-react-native';
import NoData from '../../../assets/lottie/man-doing-workout.json';
import { useQuery } from 'react-query';
import { getGuidedExerciseSteps } from '../../common/apis/api';
import AudioPlayer from '../../common/StyledComponents/AudioPlayer/AudioPlayerBC';
import SoundPlayer from 'react-native-sound-player';
import * as Progress from 'react-native-progress';
import { formatTime } from '../../common/functionUtils/functionUtils';
import Back from '../../../assets/svg/back';

interface GuidedExerciseStepsProps { }

const GuidedExerciseSteps: FC<GuidedExerciseStepsProps> = () => {

    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const [exerciseSteps, setExerciseSteps] = useState<any>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number | any>(null);
    const [stepRemainingTime, setStepRemainingTime] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [countDownTimer, setCountDownTimer] = useState<number | any>(null);
    const currentStep = exerciseSteps[currentStepIndex];
    let progress: number = 0;

    const exerciseDetails: any = useSelector((state: RootState) => state.app.exerciseDetails);
    const isPlaying: any = useSelector((state: RootState) => state.app.isPlaying);

    const navigateToBreathingList = () => {
        navigation.navigate('GuidedExercise');
        try {
            dispatch(setIsPlaying(false));
            SoundPlayer.stop();
        } catch (error) {
            console.log('Error pausing audio:', error);
        }
    };

    useEffect(() => {
        const handleBackPress = () => {
            navigateToBreathingList();
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [dispatch]);

    useQuery({
        queryKey: ["exercise-steps"],
        queryFn: () => getGuidedExerciseSteps(exerciseDetails.id),
        onSuccess: (response) => {
            const steps = response.data.response;
            if (steps) {
                setExerciseSteps(steps.sort((a: any, b: any) => a.sequence - b.sequence));
                const totalTime = steps.reduce((total: any, step: any) => {
                    const time = parseInt(step.time, 10) * 1000
                    return total + time;
                }, 0);

                setRemainingTime(totalTime);
                if (totalTime > 0) {
                    dispatch(setIsPlaying(true));
                }
            }
        }
    });

    useEffect(() => {
        if (exerciseSteps.length > 0) {
            const stepDuration = parseInt(exerciseSteps[currentStepIndex]?.time, 10) * 1000

            setStepRemainingTime(stepDuration);
            setCountDownTimer(stepDuration);
        }
    }, [exerciseSteps, currentStepIndex, exerciseDetails.mode]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countDownTimer > 0) {
            timer = setInterval(() => {
                setCountDownTimer((prevTime: any) => {
                    if (prevTime <= 1000) {
                        clearInterval(timer);
                        // Move to the next step if there are more steps
                        if (currentStepIndex + 1 < exerciseSteps.length) {
                            setCurrentStepIndex((prevIndex) => {
                                const nextIndex = prevIndex + 1;
                                const newStepDuration = parseInt(exerciseSteps[nextIndex]?.time, 10) * 1000;
                                setStepRemainingTime(newStepDuration);
                                return nextIndex;
                            });
                        } else {
                            // No more steps, session is finished
                            setRemainingTime(0);
                        }
                        return 0; // Set timer to 0 to avoid negative values
                    } else {
                        // Decrease both the step timer and total remaining time
                        setRemainingTime((prevTime: number) => prevTime - 1000);
                        return prevTime - 1000;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isPlaying, countDownTimer, exerciseSteps, currentStepIndex]);

    // Show the modal when all steps are completed
    useEffect(() => {
        if (remainingTime === 0 && currentStepIndex === exerciseSteps.length - 1) {
            setShowModal(true);
            dispatch(setIsPlaying(false));
            SoundPlayer.stop();
        }
    }, [remainingTime, currentStepIndex, dispatch, exerciseSteps.length]);


    // Calculate progress
    progress = (1 - (countDownTimer / stepRemainingTime));

    // Cap progress at 1 if it goes to infinity or becomes invalid
    if (!isFinite(progress) || progress < 0) {
        progress = 1;
    }

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={exerciseDetails.title}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                onLeftIconPress={navigateToBreathingList}
                leftIcon={<Back />}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8
                }}>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    gap: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Progress.Bar
                        progress={progress}
                        width={Dimensions.get("window").width}
                        color='hotpink'
                        borderWidth={0}
                        animationConfig={{
                            bounciness: 0
                        }}
                        animationType='timing'
                    />
                    <View style={{
                        width: '75%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                    }}>
                        {exerciseSteps.map((num: any) => (
                            <View
                                key={num.sequence}
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 100,
                                    backgroundColor: num.sequence === currentStep?.sequence ? 'hotpink' : '#C0C0C0',
                                }}
                            />
                        ))}
                    </View>
                    {/* <Text style={styles.text}>{currentStep?.sequence + 1}/{exerciseSteps?.length}</Text> */}
                </View>

                {remainingTime !== 0 && <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    // marginTop: 16
                }}>
                    <Text style={{ color: 'black', fontSize: 24, marginTop: 20, fontWeight: '500' }}>{`${formatTime(countDownTimer / 1000)}`}</Text>
                </View>}

                {currentStep?.media_type === 'LOTTIE' ?
                    <LottieView
                        source={{ uri: currentStep?.media_url }}
                        autoPlay
                        loop
                        style={{ width: Dimensions.get('window').width * 0.5, height: Dimensions.get('window').height * 0.45, aspectRatio: 1.45 }}
                    />
                    :
                    <FastImage
                        style={[
                            styles.imageView,
                            {
                                height: Dimensions.get('window').height * 0.5,
                                width: Dimensions.get('window').width,
                                aspectRatio: 1
                            },
                        ]}
                        source={{ uri: currentStep?.media_url }}
                        resizeMode={FastImage.resizeMode.contain}
                    />}
                <Text style={{ color: 'black', fontWeight: '500', fontSize: 24, textAlign: 'center' }}>{currentStep?.name}</Text>
                <Text style={{ color: 'black', fontSize: 16, marginTop: 20, fontWeight: '500' }}>{currentStep?.equipment && `Equipment required: ${currentStep?.equipment}`}</Text>

                <View style={{
                    display: 'none'
                }}>
                    <AudioPlayer content_url={currentStep?.audio_url} contentType={"AUDIO"} />
                </View>
            </ScrollView>

            <CustomModal visible={showModal}>
                <View style={styles.modalContainer}>
                    <LottieView source={NoData} style={styles.lottieStyles} autoPlay loop />
                    <Text style={{ color: 'black', fontWeight: '500', fontSize: 26, top: -20 }}>Congratulations!!!</Text>
                    <Text style={{ color: 'gray', fontWeight: '500', fontSize: 16, top: -20 }}>You have completed this session</Text>
                    <TouchableOpacity
                        style={styles.expertAnswer}
                        activeOpacity={0.6}
                        onPress={() => {
                            navigation.navigate("GuidedExercise")
                        }}
                    >
                        <Text style={styles.text}>{'Continue'}</Text>
                    </TouchableOpacity>
                </View>
            </CustomModal>
        </View>
    );
};

export default GuidedExerciseSteps;
