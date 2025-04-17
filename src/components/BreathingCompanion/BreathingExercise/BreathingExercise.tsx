import React, { FC, useEffect, useState } from 'react';
import { Button, Dimensions, Text, TouchableOpacity, View, Image, BackHandler, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../common/StyledComponents/Header';
import colours from '../../../common/constants/styles.json';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import styles from './BreathingExerciseStyle';
import FastImage from 'react-native-fast-image';
import CustomModal from '../../../common/StyledComponents/PuzzleModals/PuzzleModal';
import { setIsPlaying } from '../../../redux/actions';
import LottieView from 'lottie-react-native';
import NoData from '../../../../assets/lottie/girl-doing-meditation.json';
import { useQuery } from 'react-query';
import { getBreathingSteps } from '../../../common/apis/api';
import AudioPlayer from '../../../common/StyledComponents/AudioPlayer/AudioPlayerBC';
import SoundPlayer from 'react-native-sound-player';
import * as Progress from 'react-native-progress';
import { formatTime } from '../../../common/functionUtils/functionUtils';
import AudioPlayerBC from '../../../common/StyledComponents/AudioPlayer/AudioPlayerBC';
import Back from '../../../../assets/svg/back';
import Info from '../../../../assets/svg/info';

interface BreathingCompanionProps { }

const BreathingExercise: FC<BreathingCompanionProps> = () => {

    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const [breathingSteps, setBreathingSteps] = useState<any>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number | any>(null);
    const [stepRemainingTime, setStepRemainingTime] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [countDownTimer, setCountDownTimer] = useState<number>(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const currentStep = breathingSteps[currentStepIndex];
    let progress: number = 0;

    const breathingDetails: any = useSelector((state: RootState) => state.app.breathingDetails);
    const isPlaying: any = useSelector((state: RootState) => state.app.isPlaying);

    const navigateToBreathingList = () => {
        navigation.navigate('BreathingCompanion');
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
        queryKey: ["breathing-steps"],
        queryFn: () => getBreathingSteps(breathingDetails.id),
        onSuccess: (response) => {
            const steps = response.data.response;
            if (steps) {
                setBreathingSteps(steps.sort((a: any, b: any) => a.sequence - b.sequence));
                const totalTime = steps.reduce((total: any, step: any) => {
                    const time = breathingDetails.mode === 'simple'
                        ? parseInt(step.time.simple, 10) * 1000
                        : parseInt(step.time.moderate, 10) * 1000;
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
        if (breathingSteps.length > 0) {
            const stepDuration = breathingDetails.mode === 'simple'
                ? parseInt(breathingSteps[currentStepIndex].time.simple, 10) * 1000
                : parseInt(breathingSteps[currentStepIndex].time.moderate, 10) * 1000;

            setCountDownTimer(stepDuration);
            setStepRemainingTime(stepDuration);
        }
    }, [breathingSteps, currentStepIndex, breathingDetails.mode]);

    useEffect(() => {
        if (isPlaying && countDownTimer > 0) {
            if (timerInterval) clearInterval(timerInterval);
            const timer = setInterval(() => {
                setCountDownTimer((prevTime: any) => {
                    if (prevTime <= 1000) {
                        clearInterval(timer);

                        // If this is the last step, stop and show the modal
                        if (currentStepIndex === breathingSteps.length - 1) {
                            setShowModal(true);
                            dispatch(setIsPlaying(false));
                            SoundPlayer.stop();
                        } else {
                            // Move to the next step if not the last
                            setCurrentStepIndex((prevIndex) => {
                                const nextIndex = prevIndex + 1;
                                const newStepDuration = breathingDetails.mode === 'simple'
                                    ? parseInt(breathingSteps[nextIndex].time.simple, 10) * 1000
                                    : parseInt(breathingSteps[nextIndex].time.moderate, 10) * 1000;
                                setStepRemainingTime(newStepDuration);
                                return nextIndex;
                            });
                        }

                        return 0; // Set timer to 0 to avoid negative values
                    } else {
                        return prevTime - 1000;
                    }
                });
            }, 1000);
            setTimerInterval(timer);
        } else if (!isPlaying && timerInterval) {
            clearInterval(timerInterval);
        }

        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [isPlaying, countDownTimer, breathingSteps, currentStepIndex]);



    useEffect(() => {
        if (remainingTime === 0) {
            setShowModal(true);
            dispatch(setIsPlaying(false));
            SoundPlayer.stop();
        }
    }, [remainingTime, dispatch]);

    const handleInfoButton = () => {
        setShowInfo(true);
    }

    // Calculate progress
    progress = (1 - (countDownTimer / stepRemainingTime));

    // Cap progress at 1 if it goes to infinity or becomes invalid
    if (!isFinite(progress) || progress < 0) {
        progress = 1;
    }

    return (
        <View style={styles.container}>
            <Header
                title={breathingDetails.title}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                onLeftIconPress={navigateToBreathingList}
                leftIcon={<Back />}
                showLogoutButton={true}
                onRightIconPress={handleInfoButton}
                rightIcon={<Info />}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.wrapper}>
                <View style={styles.progressBarWrapper}>
                    <Progress.Bar progress={progress} width={Dimensions.get("window").width} color='hotpink' borderWidth={0} />
                    <View style={styles.activeStepView}>
                        {breathingSteps.map((num: any) => (
                            <View
                                key={num.sequence}
                                style={[styles.activeStep, {
                                    backgroundColor: num.sequence === currentStep?.sequence ? 'hotpink' : '#C0C0C0',
                                }]}
                            />
                        ))}
                    </View>

                    {remainingTime !== 0 && <View style={styles.timerView}>
                        <Text style={styles.timerText}>{`${formatTime(countDownTimer / 1000)}`}</Text>
                    </View>}
                    {/* <Text style={styles.text}>{currentStep?.sequence + 1}/{breathingSteps?.length}</Text> */}
                </View>
                {currentStep?.media_type === 'LOTTIE' ?
                    <LottieView
                        source={{ uri: currentStep?.media_url }}
                        autoPlay
                        loop
                        style={{ width: "100%", height: 300, aspectRatio: 1.45 }}
                    />
                    :
                    <FastImage
                        style={[
                            styles.imageView,
                        ]}
                        source={{ uri: currentStep?.media_url }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                }
                <View style={{
                    width: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={styles.currentStep}>{currentStep?.name}</Text>
                </View>

                <View style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 8,
                    left: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <AudioPlayerBC content_url={currentStep?.audio_url} contentType={"AUDIO"} />
                </View>
            </ScrollView>

            <CustomModal visible={showModal}>
                <View style={styles.modalContainer}>
                    <LottieView source={NoData} style={styles.lottieStyles} autoPlay loop />
                    <Text style={styles.congratsText}>Congratulations!!!</Text>
                    <Text style={[styles.congratsText, { color: 'gray', fontSize: 16 }]}>You have completed this session</Text>
                    <TouchableOpacity
                        style={styles.expertAnswer}
                        activeOpacity={0.6}
                        onPress={() => {
                            navigation.navigate("BreathingCompanion")
                        }}
                    >
                        <Text style={styles.text}>{'Continue'}</Text>
                    </TouchableOpacity>
                </View>
            </CustomModal>

            <CustomModal visible={showInfo} onRequestClose={() => setShowInfo(false)}>
                <View style={{
                    padding: 16
                }}>
                    <Text style={styles.descriptionText}>
                        {breathingDetails.description}
                    </Text>
                </View>
            </CustomModal>
        </View>
    );
};

export default BreathingExercise;
