import React, { FC, useCallback, useState } from 'react'
import { View, Text, Button, FlatList, RefreshControl, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import translate from '../../context/Translations';
import styles from './SelfAssessmentStyles'
import colour from '../../common/constants/styles.json'
import LoadingSpinner from '../../../assets/lottie/loading.json';
import LottieView from 'lottie-react-native';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import RightArrow from '../../../assets/svg/rightarrow';
import { setAssessmentDetails, setIsPaused } from '../../redux/actions';
import { useQuery, useQueryClient } from 'react-query';
import { getAssessmentData, getAssessmentList } from '../../common/apis/api';
import Back from '../../../assets/svg/back';
import TextTicker from 'react-native-text-ticker';
import Info from '../../../assets/svg/info'
import { Divider, Icon } from '@rneui/base';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import PieChart from '../../../assets/svg/piechart';
import Graph from '../../../assets/svg/settingsicons/graph.svg';
import { LineChart } from "react-native-chart-kit";
import Close from '../../../assets/svg/close';
import { formatDate, formatDateToDDMMYYY } from '../../common/functionUtils/functionUtils';
import CloseReel from '../../../assets/svg/closeReel';
import { MMKV } from 'react-native-mmkv';

interface SelfAssessmentListProps { }

interface Assessment {
    id: number
    title: string;
    thumbnail: any;
    tagline: string
}

const generateRandomColor = () => {
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    return randomColor;
};

const SelfAssessmentList: FC<SelfAssessmentListProps> = () => {

    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const storage = new MMKV;
    const language = storage.getString('language');

    const [listDetails, setListDetails] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [assessmentResult, setAssessmentResult] = useState<any[]>([]);
    const [assessmentName, setAssessmentName] = useState<string>('');
    const [resultData, setResultData] = useState<any>([]);

    const yAxisMin: any = Math.min(...resultData?.map((result: any) => parseInt(result.lower_marks, 10)));
    const yAxisMax: any = Math.max(...resultData?.map((result: any) => parseInt(result.upper_marks, 10)));

    const goToWellBeing = () => {
        navigation.navigate('WellBeing');
    };

    useQuery({
        queryKey: ["assessmentList"],
        queryFn: getAssessmentList,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data) {
                const list = response.data.response
                setListDetails(list);
            }
        }
    });

    const navigateToAssessment = (assessment: any) => {
        navigation.navigate('Assessment');
        dispatch(setAssessmentDetails(assessment));
    }


    const handleResultPress = async (assessment: any) => {
        try {
            const response = await getAssessmentData(assessment.id);
            if (response && response?.data) {
                const result = response?.data?.response.resultList;
                const data = response?.data?.response?.assessment_result.result;
                if (result.length === 0) {
                    ToastAndroid.show(language === 'mr' ? "या स्व-परीक्षेसाठी माहिती उपलब्ध नाही " : "No data available for this assessment.", ToastAndroid.SHORT);
                } else {
                    setAssessmentResult(result);
                    setResultData(data);
                    setShowResult(true); // Show modal only if there's data
                    setAssessmentName(assessment.title);
                }
            }
        } catch (err) {
            console.error("Error getting result", err);
            ToastAndroid.show("Error fetching assessment data.", ToastAndroid.SHORT);
        }
    };

    const renderChapterItem = ({ item }: { item: Assessment }) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.chapterItem, { marginBottom: 16 }]}
                onPress={() => {
                    navigateToAssessment(item);
                }}>
                <View style={styles.tileContainer}>
                    {item.title.length > 35 ? <TextTicker
                        style={[styles.title, { width: Dimensions.get('window').width * 0.7 }]}
                        scrollSpeed={50}
                        loop
                        bounce={false}
                        repeatSpacer={100}
                        marqueeDelay={100}
                    >
                        {item.title}
                    </TextTicker> :
                        <Text style={styles.title}>
                            {item.title}
                        </Text>}
                    <TouchableOpacity
                        style={styles.resultButton} onPress={() => handleResultPress(item)}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>Result</Text>
                        {/* <PieChart height={20} width={20} /> */}
                        <Graph />
                    </TouchableOpacity>
                </View>
                <FastImage
                    style={styles.thumbnail}
                    source={{ uri: item?.thumbnail }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.taglineDesc}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        {item.tagline.length > 50 ?
                            <TextTicker
                                style={styles.tagLineStyle}
                                scrollSpeed={50}
                                loop
                                bounce={false}
                                repeatSpacer={100}
                                marqueeDelay={100}
                            >
                                {item.tagline}
                            </TextTicker>
                            :
                            <Text style={styles.tagLineStyle}>
                                {item.tagline}
                            </Text>
                        }
                    </View>
                    <RightArrow />
                </View>

            </TouchableOpacity>
        )
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("assessmentList");
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const handleInfoButton = () => {
        setShowInfo(true);
    }

    return (
        <View style={{ flex: 1, backgroundColor: colour['theme-backgroung-color'] }}>
            <Header
                title={translate('SelfAssessmentList')}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                onRightIconPress={handleInfoButton}
                leftIcon={<Back />}
                rightIcon={<Info />}
                onLeftIconPress={goToWellBeing}
            />
            <View style={styles.container}>
                {listDetails.length === 0 ? (
                    <View style={styles.NodataLottie}>
                        <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                    </View>
                ) : (
                    <FlatList
                        data={listDetails}
                        showsVerticalScrollIndicator={false}
                        style={styles.chapterList}
                        renderItem={renderChapterItem}
                        keyExtractor={(item) => item.id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}
            </View>

            <CustomModal visible={showInfo} onRequestClose={() => setShowInfo(false)}>
                <View style={styles.disclaimerContainer}>
                    <Text style={styles.disclaimerTitle}>Disclaimer</Text>
                    <Divider style={{ marginBottom: 8 }} />
                    <Text style={styles.disclaimerDescription}>
                        {language === 'mr' ?
                            "ही स्व-परीक्षा चाचणी केवळ संदर्भासाठी आहे. चांगल्या प्रकारे अर्थ लावण्यासाठी आणि पुढील तपासणी व आवश्यक असल्यास कृतीसाठी तुम्हाला मानसिक आरोग्य तज्ञाशी संपर्क साधण्याचा सल्ला दिला जातो."
                            : "These self assessment test are indicative only, you are advised to strictly get in touch with a mental health expert person for a better interpretation and further investigation and action if required"
                        }
                    </Text>
                </View>
            </CustomModal>

            <CustomModal visible={showResult}>
                <View style={styles.resultContainer}>
                    <TouchableOpacity onPress={() => setShowResult(false)} style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                    }}>
                        <CloseReel />
                    </TouchableOpacity>

                    {assessmentResult?.length > 0 && <Text style={{ fontWeight: 'bold', color: 'gray', marginBottom: 12 }}>{assessmentName}</Text>}

                    {assessmentResult?.length > 0 ? (
                        <>
                            <Text style={[styles.Y_AxisLabel, { left: language === 'mr' ? 0 : -8, }]}>{translate('Score')}</Text>

                            <LineChart
                                data={{
                                    labels: assessmentResult.map(item => formatDate(item.created_at)),
                                    datasets: [
                                        { data: assessmentResult.map(item => item.marks) },
                                        {
                                            data: [yAxisMin] // min
                                        },
                                        {
                                            data: [yAxisMax] // max
                                        },
                                    ],
                                }}
                                width={Dimensions.get("window").width * 0.8}
                                height={Dimensions.get("window").height * 0.6}
                                yAxisInterval={1}
                                yAxisSuffix=""
                                fromZero={true}
                                chartConfig={{
                                    backgroundColor: "#fff",
                                    backgroundGradientFrom: "#fff",
                                    backgroundGradientTo: "#fff",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: { borderRadius: 16, padding: 0 },
                                    propsForDots: { r: "4", strokeWidth: "1", stroke: 'hotpink' }
                                }}
                                bezier
                                style={{
                                    // marginVertical: 8,
                                    borderRadius: 16,
                                    // paddingTop: 16,
                                }}
                                formatXLabel={(label) => {
                                    if (label.length > 3) {
                                        return `${label.substring(0, 6)}.`; // Shorten long labels
                                    }
                                    return label;
                                }}
                            />

                            <Text style={styles.X_AxisLabel}>{translate('Date')}</Text>

                            {/* Legend */}
                            <View style={styles.legendWrapper}>
                                {resultData
                                    ?.sort((a: { lower_marks: string }, b: { lower_marks: string }) =>
                                        parseInt(a.lower_marks, 10) - parseInt(b.lower_marks, 10)
                                    )
                                    .map((result: any, index: number) => (
                                        <View
                                            key={index}
                                            style={styles.legendView}
                                        >
                                            <Text style={{ fontSize: 12, color: 'black' }}>
                                                {`${result.text.trim()} (${result.lower_marks}-${result.upper_marks})`}
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        </>
                    ) : (
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>
                            No results available to display.
                        </Text>
                    )}
                </View>
            </CustomModal>
        </View>
    )
}

export default SelfAssessmentList
