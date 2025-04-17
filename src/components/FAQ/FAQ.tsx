import React, { FC, useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import Back from '../../../assets/svg/back';
import translate from '../../context/Translations';
import colours from '../../common/constants/styles.json';
import FastImage from 'react-native-fast-image';
import WebView from 'react-native-webview';
import { getYoutubeVideo } from '../../common/functionUtils/functionUtils';
import { useQuery, useQueryClient } from 'react-query';
import { getFAQs } from '../../common/apis/api';
import Upward from '../../../assets/svg/upward';
import Downward from '../../../assets/svg/downward';
import LottieView from 'lottie-react-native';
import styles from './FAQStyle';
import LoadingSpinner from '../../../assets/lottie/loading.json';

interface FAQProps { }

const FAQ: FC<FAQProps> = () => {
    const navigation: any = useNavigation();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
    const [questions, setQuestions] = useState<any>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const pickerRef = useRef<any>();
    const queryClient = useQueryClient();

    useQuery({
        queryKey: ["FAQs"],
        queryFn: getFAQs,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data && response?.status === 200) {
                setQuestions(response?.data?.response)
            } else {
                setQuestions([]);
            }
        }
    })

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    const goToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    const toggleQuestion = (index: number) => {
        setExpandedQuestions((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("FAQs");
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            queryClient.invalidateQueries("FAQs");
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate('FAQ')}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={goToDashboard}
            />
            
            <ScrollView contentContainerStyle={{ marginHorizontal: 16, marginVertical: 16 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {questions === "No FAQ found" ? (
                    <View style={styles.NodataLottie}>
                        <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                    </View>
                ) : (
                    questions?.map((item: any, index: number) => {
                        const video = getYoutubeVideo(item?.question_video);
                        return (
                            <View key={index} style={{ marginBottom: 12 }}>
                                <TouchableOpacity
                                    onPress={() => toggleQuestion(index)}
                                    style={styles.faqStyle}
                                >
                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.question}</Text>
                                    {!expandedQuestions?.includes(index) ? <Upward height={14} width={14} /> : <Downward height={14} width={14} />}
                                </TouchableOpacity>

                                {/* Expandable Answer */}
                                {expandedQuestions?.includes(index) && (
                                    <View style={{ padding: 12, backgroundColor: colours['theme-color'], borderBottomLeftRadius: 8, borderBottomRightRadius: 8, top: -4, justifyContent: 'center' }}>
                                        <Text style={{ color: 'black', fontWeight: 'normal', textAlign: 'justify' }}>{item.answer}</Text>

                                        {item?.question_video ? (
                                            <WebView
                                                style={{ flex: 1, height: 200, borderRadius: 16, marginTop: 16 }}
                                                javaScriptEnabled={true}
                                                allowsFullscreenVideo={true}
                                                source={{ uri: video }}
                                            />
                                        ) : item?.question_image ? (
                                            <FastImage
                                                style={styles.faqImage}
                                                source={{ uri: item?.question_image }}  // Ensure 'item?.media' is an object with 'uri' key
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        ) : null}

                                    </View>
                                )}
                            </View>
                        )
                    })
                )}
            </ScrollView>
        </View>
    );
};

export default FAQ;
