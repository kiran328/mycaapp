import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, ToastAndroid, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import styles from './SelfAssessmentStyles'
import colour from '../../common/constants/styles.json'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import RadioButton from '../../common/StyledComponents/RadioButton/RadioButton';
import FastImage from 'react-native-fast-image';
import { getAssessmentDetails, saveAssessmentResult, submitAssessment } from '../../common/apis/api';
import { useQueryClient } from 'react-query';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import translate from '../../context/Translations';
import Back from '../../../assets/svg/back';

const MCQComponent = () => {

    const navigation: any = useNavigation();

    const assessmentDetails: any = useSelector((state: RootState) => state.app.assessmentDetails);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [questionList, setQuestionList] = useState<any[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [marks, setMarks] = useState<number | null>(null);
    const [assessmentResult, setAssessmentResult] = useState<any>('');
    const currentQuestion = questionList[currentIndex];
    const isOptionSelected = selectedOptions.some(item => item.question_id === currentQuestion?.id);
    const result = assessmentDetails.result
    const scrollViewRef = useRef<ScrollView>(null);

    const gotToAssessmentList = () => {
        navigation.navigate("SelfAssessmentList")
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchAssessmentDetails = async () => {
                try {
                    const response = await getAssessmentDetails(assessmentDetails.id);
                    if (response.data) {
                        setQuestionList(response.data.response);
                        if (response.data.response.length > 0) {
                            setCurrentIndex(0);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching assessment details:", error);
                }
            };

            fetchAssessmentDetails();
        }, [assessmentDetails.id])
    );

    const handleOptionChange = (questionId: number, optionId: number, marks: number) => {
        const mark = Number(marks)
        setSelectedOptions(prev => {
            // Find if the question already has a selected option
            const existingIndex = prev.findIndex(item => item.question_id === questionId);

            if (existingIndex >= 0) {
                // Update the existing option
                const updatedOptions = [...prev];
                updatedOptions[existingIndex] = { question_id: questionId, option_id: optionId, option_marks: mark };
                return updatedOptions;
            } else {
                // Add a new option
                return [...prev, { question_id: questionId, option_id: optionId, option_marks: mark }];
            }
        });
    };

    const handleQuestionSelect = (index: number) => {
        if (!isOptionSelected) {
            ToastAndroid.show(translate("SelectOption"), ToastAndroid.SHORT);
        } else {
            setCurrentIndex(index);
            const scrollToPosition = index * 70; // Adjust this value based on button width + gap

            // Scroll the ScrollView horizontally
            scrollViewRef.current?.scrollTo({
                x: scrollToPosition,
                animated: true,
            });
        }
    };

    const handleNext = () => {
        if (!isOptionSelected) {
            ToastAndroid.show(translate("SelectOption"), ToastAndroid.SHORT);
        } else if (currentIndex < questionList.length - 1) {
            setCurrentIndex(prevIndex => {
                const newIndex = prevIndex + 1;
                // Scroll to the previous question button
                const scrollToPosition = newIndex * 60; // Adjust based on button width + gap
                scrollViewRef.current?.scrollTo({
                    x: scrollToPosition,
                    animated: true,
                });
                return newIndex;
            });
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                // Scroll to the previous question button
                const scrollToPosition = newIndex * 60; // Adjust based on button width + gap
                scrollViewRef.current?.scrollTo({
                    x: scrollToPosition,
                    animated: true,
                });
                return newIndex;
            });
        }
    };

    const calculateMarks = () => {
        const totalMarks = selectedOptions.reduce((total, option) => total + option.option_marks, 0);
        setMarks(totalMarks);
        const bracket = result.find((bracket: any) =>
            totalMarks >= Number(bracket.lower_marks) && totalMarks <= Number(bracket.upper_marks)
        );
        setAssessmentResult(bracket);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await submitAssessment(assessmentDetails.id, selectedOptions);
            if (response && response.data) {
                setIsLoading(false);
                setShowModal(true);
                calculateMarks();
            }
        } catch (err) {
            console.error("Error submitting assessment", err)
        }
    };

    const handleSendAssessmentResult = async () => {
        try {
            const response = await saveAssessmentResult(assessmentDetails.id, marks, assessmentResult?.text)
            if (response && response.data) {
                navigation.navigate('SelfAssessmentList');
            }
        } catch (err) {
            console.error("Error sumbitting assessment result", err)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colour['theme-backgroung-color'] }}>
            <Header
                title={assessmentDetails?.title}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                showBackButton={true}
                onLeftIconPress={gotToAssessmentList}
                leftIcon={<Back />}
            />
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.wrapper}
                    >
                        {questionList.map((question: any, index) => (
                            <TouchableOpacity
                                key={question.id}
                                onPress={() => handleQuestionSelect(index)}
                                // disabled={!isOptionSelected}
                                style={[
                                    styles.mcqButton,
                                    currentQuestion.id === question.id && styles.selectedMCQ,
                                    {
                                        borderWidth: currentQuestion.id ? 0.5 : 0,
                                        borderColor: 'gray'
                                    }
                                ]}
                            >
                                <Text
                                    style={{
                                        color: currentQuestion.id ? 'black' : 'white',
                                        fontWeight: currentQuestion.id ? '700' : '400',
                                        fontSize: 20
                                    }}
                                >
                                    {`${index + 1}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.questionTabs}>
                        <Text
                            style={styles.questionText}
                        >
                            {currentQuestion?.question}
                        </Text>
                        {currentQuestion?.question_media && (
                            <FastImage
                                source={{ uri: currentQuestion?.question_media }}
                                style={{ width: '100%', height: 200, marginVertical: 16, borderRadius: 8 }}
                            />
                        )}
                        <ScrollView
                            horizontal={currentQuestion?.question_display === 'SCALE'}
                            showsHorizontalScrollIndicator={currentQuestion?.question_display === 'SCALE' ? true : false}
                            showsVerticalScrollIndicator={currentQuestion?.question_display === 'LIST'}
                            contentContainerStyle={{
                                flexDirection: currentQuestion?.question_display === 'SCALE' ? 'row' : 'column',
                                gap: 16,
                                shadowColor: 'gray'
                                // marginHorizontal: 8
                            }}
                        >
                            {currentQuestion?.options.map((option: any) => {
                                // Check if this option is selected
                                const isSelected = selectedOptions.find(item => item.question_id === currentQuestion?.id && item.option_id === option.id);

                                return (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => handleOptionChange(currentQuestion?.id, option.id, option.marks)}
                                        style={{ flexDirection: currentQuestion?.question_display === 'SCALE' ? 'column' : 'row', alignItems: 'center', margin: 8 }}
                                    >
                                        <RadioButton
                                            selected={!!isSelected} // Convert the object to a boolean
                                            onPress={() => handleOptionChange(currentQuestion?.id, option.id, option.marks)}
                                        />
                                        <Text
                                            style={{
                                                width: currentQuestion?.question_display === 'SCALE' ? 160 : '90%',
                                                marginLeft: 8,
                                                fontSize: 20,
                                                textAlign: currentQuestion?.question_display === 'SCALE' ? 'center' : 'justify',
                                                fontWeight: 'normal',
                                                color: isSelected ? 'green' : 'black'
                                            }}
                                        >
                                            {option.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                </ScrollView>

                <View style={{ flexDirection: currentIndex !== 0 ? 'row' : 'row-reverse', justifyContent: 'space-between', margin: 8 }}>
                    {currentIndex > 0 &&
                        <TouchableOpacity onPress={handlePrevious} style={styles.buttonStyle}>
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>
                    }
                    {currentIndex < questionList?.length - 1 ? (
                        <TouchableOpacity onPress={handleNext} style={styles.buttonStyle}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        isLoading ? <ActivityIndicator color={'hotpink'} size={'large'} /> :
                            <TouchableOpacity onPress={handleSubmit} disabled={!isOptionSelected} style={[styles.buttonStyle, { backgroundColor: colour['language-buttons'], borderWidth: 0 }]}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}>Submit</Text>
                            </TouchableOpacity>
                    )}
                </View>
            </View>

            <Modal
                statusBarTranslucent
                visible={showModal}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.contentContainer}>
                        {assessmentResult?.image && (
                            <FastImage
                                source={{ uri: assessmentResult?.image }}
                                resizeMode="contain"
                                style={styles.image}
                            />
                        )}
                        {assessmentResult?.text && (
                            <Text style={styles.text}>{assessmentResult?.text}</Text>
                        )}
                        <TouchableOpacity
                            onPress={handleSendAssessmentResult}
                            style={styles.submitButton}
                        >
                            <Text style={styles.submitButtonText}>{translate('Exit')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default MCQComponent;
