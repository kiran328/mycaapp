import React, { FC, useCallback, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, Text, View } from 'react-native';
import styles from './SummaryStyles';
import translate from '../../../context/Translations';
import { formatTime } from '../../../common/functionUtils/functionUtils';
import LottieView from 'lottie-react-native';
import TimeSpent from '../../../../assets/lottie/boy-reading-e-book.json';
import { useQuery } from 'react-query';
import { getChapterParts, getChapters, getMCQSummary, getSummary } from '../../../common/apis/api';
import { FAB } from '@rneui/themed';
import Svg, { Path } from 'react-native-svg';
import colours from '../../../common/constants/styles.json';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';


const Summary: FC = () => {
    const [hasPoints, setHasPoints] = useState<{ rightAnswer: any, wrongAnswer: any }>({
        rightAnswer: '',
        wrongAnswer: ''
    });
    const [timeSpent, setTimeSpent] = useState<number>(0);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const chapterID: any = useSelector((state: RootState) => state.app.chapterId);
    useQuery({
        queryKey: ["chapterSummary"],
        queryFn: () => getSummary(chapterID),
        // refetchInterval: 5000,
        onSuccess: (response) => {
            if (response.data) {
                setTimeSpent(response?.data.response.total_time);
            }
        }
    });

    useQuery({
        queryKey: ["chapterMCQSummary"],
        queryFn: () => getMCQSummary(chapterID),
        // refetchInterval: 5000,
        onSuccess: (response) => {
            if (response.data) {
                setHasPoints({
                    rightAnswer: response?.data.response?.answers?.right_answers,
                    wrongAnswer: response?.data.response?.answers?.wrong_answers,
                });
            }
        }
    });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await getSummary(chapterID);
            const mcqResponse = await getMCQSummary(chapterID);
            if (response.data) {
                setTimeSpent(response.data.response.total_time);
            }
            if (mcqResponse.data) {
                setHasPoints({
                    rightAnswer: response.data.response.answers.right_answers,
                    wrongAnswer: response.data.response.answers.wrong_answers,
                });
            }
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, [chapterID]);

    const isValidNumber = (value: any) => !isNaN(value) && value !== undefined && value !== null;

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isValidNumber(timeSpent) && (
                    <>
                        <LottieView
                            source={TimeSpent}
                            autoPlay
                            loop
                            style={{
                                height: Dimensions.get('window').height * 0.25,
                                width: Dimensions.get('window').width * 0.5,
                                aspectRatio: 1.45
                            }}
                        />
                        <View style={styles.timeContainer}>
                            <Text style={[styles.textStyle, {fontWeight: '600'}]}>{translate("YouHaveSpent")}</Text>
                            <Text style={styles.textStyle}>{formatTime(timeSpent)}</Text>
                            <Text style={styles.textStyle}>{translate("OnThisChapter")}</Text>
                        </View>
                    </>
                )}
                {isValidNumber(hasPoints.rightAnswer) && isValidNumber(hasPoints.wrongAnswer) && (
                    (hasPoints.rightAnswer !== 0 || hasPoints.wrongAnswer !== 0) && (
                        <View style={styles.timeContainer}>
                            <Text style={[styles.textStyle, {fontWeight: '600'}]}>{translate("InThisChapter")}</Text>
                            <Text style={styles.textStyle}>{translate("CorrectAnswers")}: {hasPoints.rightAnswer}/{hasPoints.rightAnswer + hasPoints.wrongAnswer}</Text>
                            <Text style={styles.textStyle}>{translate("WrongAnswers")}: {hasPoints.wrongAnswer}/{hasPoints.rightAnswer + hasPoints.wrongAnswer}</Text>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
    )
}

export default Summary;
