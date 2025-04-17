import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Image, FlatList, Animated, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import { TouchableOpacity } from 'react-native';
import styles from './WellBeingStyle';
import colours from '../../common/constants/styles.json';
import LottieView from 'lottie-react-native';
import { MMKV } from 'react-native-mmkv';
import { useDispatch, useSelector } from 'react-redux';
import translate from '../../context/Translations';
import PeaceOfMind from '../../../assets/lottie/girl-doing-meditation.json'
import Back from '../../../assets/svg/back';
import FastImage from 'react-native-fast-image';
import { RootState } from '../../redux/rootReducer';

interface DashboardProps { }

const featureList = [
    {
        id: '1',
        feature_name: 'SelfAssessment',
        feature_icon: require('../../../assets/images/personal-assesment.png'),
    },
    {
        id: '2',
        feature_name: 'MoodCalender',
        feature_icon: require('../../../assets/images/calender.png'),
    },
    {
        id: '3',
        feature_name: 'PersonalDiary',
        feature_icon: require('../../../assets/images/personal-diary.png'),
    },
    {
        id: '4',
        feature_name: 'BreathingCompanion',
        feature_icon: require('../../../assets/images/breath.png'),
    },
    {
        id: '5',
        feature_name: 'GuidedExercise',
        feature_icon: require('../../../assets/images/exercise.png'),
    },
    {
        id: '6',
        feature_name: 'GuidedMeditation',
        feature_icon: require('../../../assets/images/meditation.png'),
    }
];

const WellBeing: FC<DashboardProps> = () => {
    const navigation: any = useNavigation();
    const [translatedFeatureList, setTranslatedFeatureList] = useState<any[]>([]);
    const [wellbeingWallpaper, setWellbeingWallpaper] = useState<any>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);

    const wallpapers: any = useSelector((state: RootState) => state.app.wallpapers);

    const storage = new MMKV;
    const userInfoString: any = storage.getString('userInfo');
    const userInfo = JSON.parse(userInfoString);
    const language = storage.getString('language');
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            wallpapers?.dynamic?.find((item: any) => {
                if (item.location === 'WELLBEING') {
                    setWellbeingWallpaper(item?.content_url);
                }
            });
        }, [])
    );

    useEffect(() => {
        // Update translated feature list whenever language changes
        setTranslatedFeatureList(
            featureList.map(item => ({
                ...item,
                feature_name: translate(item.feature_name)
            }))
        );
    }, [language]);

    // Render each course item in the grid
    const renderCourseItem = ({ item }: { item: any }) => (
        <TouchableOpacity key={item.id} style={styles.CourseContainer} activeOpacity={0.9}
            onPress={() => {
                if (item.id === '6') {
                    goToMeditation();
                } else if (item.id === '2') {
                    goToMoodCalender();
                } else if (item.id === '4') {
                    goToBreathingCompanion();
                } else if (item.id === '5') {
                    goToGuidedExercise();
                } else if (item.id === '3') {
                    goToPersonalDiary();
                } else if (item.id === '1') {
                    goToSelfAssessment();
                } else {
                    showModal();
                }
            }}
        >
            <Image source={item.feature_icon} style={styles.courseImage} />
            <Text style={language === 'mr' ? styles.courseNameMarathi : styles.courseNameEnglish}>{item.feature_name}</Text>
        </TouchableOpacity>
    );

    // Key extractor for FlatList
    const keyExtractor = (item: any) => item.id.toString();

    const goToMeditation = () => {
        navigation.navigate("GuidedMeditation");
    }

    const goToMoodCalender = () => {
        navigation.navigate("MoodCalender");
    }

    const goToBreathingCompanion = () => {
        navigation.navigate("BreathingCompanion");
    }

    const goToGuidedExercise = () => {
        navigation.navigate("GuidedExercise");
    }

    const goToPersonalDiary = () => {
        navigation.navigate("DiaryList");
    }

    const goToSelfAssessment = () => {
        navigation.navigate("SelfAssessmentList");
    }

    const showModal = () => {
        setShowComingSoonModal(true);
    }

    const navigateToDashboard = () => {
        navigation.navigate("Dashboard");
    };

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate("MentalWellBeing")}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToDashboard}
            />
            <View style={styles.profileContainer}>
                {/* <LottieView
                    source={PeaceOfMind}
                    style={styles.lottieStyles}
                    autoPlay
                    loop
                /> */}
                <FastImage
                    source={{ uri: wellbeingWallpaper }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                        width: Dimensions.get('screen').width,
                        height: Dimensions.get('screen').height * 0.3,
                        // marginVertical: 16
                    }}
                />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={translatedFeatureList}
                    renderItem={renderCourseItem}
                    keyExtractor={keyExtractor}
                    numColumns={2}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
        </View>
    )
}

export default WellBeing;
