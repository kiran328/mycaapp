import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../common/StyledComponents/Header';
import colour from '../../common/constants/styles.json';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { addMCQPoints, getMCQs, getSolvedMCQs } from '../../common/apis/api';
import styles from './QuizStyles';
import HTML from 'react-native-render-html';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import translate from '../../context/Translations';
import Back from '../../../assets/svg/back';
import { tagStyles } from '../../common/functionUtils/functionUtils';

const Quiz = () => {
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const { quizID } = route.params;

    const chapterId: any = useSelector((state: RootState) => state.app.chapterId);
    const chapterTitle: any = useSelector((state: RootState) => state.app.chapterTitle);

    const [quizList, setQuizList] = useState<any[]>([]);
    const [selectedMCQ, setSelectedMCQ] = useState<any | null>(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<any>(null);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
    const [solvedMCQs, setSolvedMCQs] = useState<any>([]);
    const [optionSelected, setOptionSelected] = useState<boolean>(false);
    const [wrongAnswerText, setWrongAnswerText] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const navigateToElementList = () => {
        navigation.navigate('Chapter Parts', { chapterId: chapterId, chapterTitle: chapterTitle });
    };

    const { data } = useQuery({
        queryKey: ["quizList"],
        queryFn: () => getMCQs(quizID),
        onSuccess: (response) => {
            if (response.data) {
                setQuizList(response.data.response);
                if (response.data.response.length > 0) {
                    setSelectedMCQ(response.data.response[0]);
                }
            }
        }
    });

    useQuery({
        queryKey: ["solvedMCQs"],
        queryFn: () => getSolvedMCQs(quizID),
        // refetchInterval: 5000,
        onSuccess: (response) => {
            if (response.data) {
                setSolvedMCQs(response.data.response);
            }
        }
    });

    useEffect(() => {
        if (data && data.data && data.data.response.length > 0) {
            setSelectedMCQ(data.data.response[0]);
        }
    }, [data]);

    const handleMCQClick = (mcq: any, index: number) => {
        setSelectedMCQ(mcq);
        setSelectedOptionIndex(null);
        setIsAnswerCorrect(false);
        setOptionSelected(false);
        setShowAnswer(false);
        setWrongAnswerText(false);
    };

    const handleSubmit = () => {
        if (selectedOptionIndex !== null) {
            setIsAnswerCorrect(selectedOptionIndex + 1 === selectedMCQ.answer);
            setShowAnswer(true);
            if (selectedOptionIndex + 1 !== selectedMCQ.answer) {
                setWrongAnswerText(true);
            } else {
                setWrongAnswerText(false);
            }
        } else {
            setOptionSelected(true);
        }
    };

    const moveToNextQuestion = () => {
        const currentIndex = quizList.findIndex(mcq => mcq.id === selectedMCQ.id);
        const nextIndex = currentIndex + 1;
        if (nextIndex < quizList.length) {
            setSelectedMCQ(quizList[nextIndex]);
            setSelectedOptionIndex(null);
            setIsAnswerCorrect(false);
            setOptionSelected(false);
            setShowAnswer(false);
            setWrongAnswerText(false);
            const scrollToPosition = nextIndex * 70; // Adjust based on button width + gap
            scrollViewRef.current?.scrollTo({
                x: scrollToPosition,
                animated: true,
            });
        } else {
            setShowAnswer(false);
            navigateToElementList();
        }
    };

    const getOptionStyle = (optIdx: number) => {
        if (showAnswer) {
            if (optIdx + 1 === selectedMCQ.answer) {
                return styles.correctOption;
            } else if (selectedOptionIndex === optIdx) {
                return styles.incorrectOption;
            } else {
                return styles.optionContainer;
            }
        } else {
            return selectedOptionIndex === optIdx ? styles.selectedOption : styles.optionContainer;
        }
    };

    const addMCQMarks = async () => {
        let status: string = "";

        const isMCQSolved = solvedMCQs.some((mcq: any) => mcq.mcq_id === selectedMCQ.id);

        // If the MCQ is already solved, move to the next question without calling the API
        if (isMCQSolved) {
            moveToNextQuestion();
            return;
        }
        if (selectedOptionIndex + 1 === selectedMCQ.answer) {
            status = 'right'
        } else if (selectedOptionIndex + 1 !== selectedMCQ.answer) {
            status = 'wrong'
        }
        try {
            const response = await addMCQPoints(Number(chapterId), Number(quizID), Number(selectedMCQ.id), Number(selectedOptionIndex + 1), status);
            if (response.data) {
                moveToNextQuestion();
            }
        } catch (err) {
            console.error("Error adding  mcq points", err)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                title={"QUIZ"}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToElementList}
            />
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 16,
                        padding: 16
                    }}>
                    {quizList.map((mcq: any, idx: number) => (
                        <View key={mcq.id}>
                            <TouchableOpacity
                                style={[styles.mcqButton, selectedMCQ?.id === mcq.id && styles.selectedMCQ]}
                                onPress={() => handleMCQClick(mcq, idx)}
                            >
                                <Text style={{
                                    color: selectedMCQ?.id === mcq.id ? 'black' : 'white',
                                    fontWeight: selectedMCQ?.id === mcq.id ? '700' : '400',
                                    fontSize: 20
                                }}>{idx + 1}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                {selectedMCQ && (
                    <View style={styles.mcqScreen}>
                        <ScrollView
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start'
                            }}>
                            <HTML
                                baseStyle={styles.baseFontStyle}
                                source={{
                                    html: selectedMCQ.question || '<span></span>',
                                }}
                                contentWidth={Dimensions.get('window').width}
                            />
                            {selectedMCQ.question_media !== null ?
                                <FastImage
                                    style={{ width: "100%", height: 200, borderRadius: 8 }}
                                    source={{ uri: selectedMCQ.question_media }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                :
                                <View></View>
                            }
                            <View style={styles.OptionsContainer}>
                                {selectedMCQ?.options?.some((option: any) => option.text !== '<p><br></p>' || option.media) && (
                                    <View style={styles.OptionsContainer}>
                                        {selectedMCQ?.options?.map((option: any, optIdx: number) => (
                                            (option.text && option.text !== '<p><br></p>') || option.media ? (
                                                <TouchableOpacity
                                                    key={optIdx}
                                                    style={getOptionStyle(optIdx)}
                                                    onPress={() => {
                                                        setOptionSelected(false);
                                                        setSelectedOptionIndex(optIdx);
                                                        // if (!isMCQSolved(selectedMCQ.id)) {
                                                        // }
                                                    }}
                                                // disabled={isMCQSolved(selectedMCQ.id)}
                                                >
                                                    {option.text ? <HTML
                                                        baseStyle={styles.OptionbaseFontStyle}
                                                        source={{
                                                            html: option.text || '<span></span>',
                                                        }}
                                                        contentWidth={Dimensions.get('window').width}
                                                    /> : null}

                                                    {option.media ? (
                                                        <FastImage
                                                            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.12, borderRadius: 8 }}
                                                            source={{ uri: option.media }}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        />
                                                    ) : null}
                                                </TouchableOpacity>
                                            ) : null
                                        ))}
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            {optionSelected ? <Text style={{ color: 'red', fontWeight: '500', fontSize: 16 }}>{translate('SelectOption')}</Text> : <Text></Text>}
                            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>{translate('SubmitButton')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <CustomModal
                    visible={showAnswer}
                >
                    <View style={styles.puzzleAnswerCorrect}>
                        {!wrongAnswerText ?
                            <Text style={{ color: 'green', fontWeight: '500', fontSize: 16 }}>{translate('MCQCorrectMessage')}</Text>
                            :
                            <Text style={{ color: 'red', fontWeight: '500', fontSize: 16 }}>{translate('MCQIncorrectMessage')}</Text>
                        }
                        <ScrollView contentContainerStyle={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                            <HTML
                                baseStyle={styles.ExplainationbaseFontStyle}
                                source={{
                                    html: selectedMCQ?.explanation_for_right_answer || '<span></span>',
                                }}
                                contentWidth={Dimensions.get('window').width}
                                tagsStyles={tagStyles}
                            />
                        </ScrollView>
                        <TouchableOpacity onPress={addMCQMarks} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>{quizList.at(-1) ? translate('Exit') : translate('NextButton')}</Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>
            </ScrollView>
        </View>
    );
};

export default Quiz;
