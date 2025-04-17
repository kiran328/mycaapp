import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Image, FlatList, ViewStyle, RefreshControl, Animated, Easing, Dimensions, Alert, Linking, Modal, PixelRatio, PanResponder, ToastAndroid, AppState } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import { TouchableOpacity } from 'react-native';
import styles from './DashboardStyles';
import colours from '../../common/constants/styles.json';
import LottieView from 'lottie-react-native';
import Maintenance from '../../../assets/lottie/maintainence.json';
import ComingSoon from '../../../assets/lottie/coming-soon.json';
import ChatBot from '../../../assets/lottie/greetings-from-chat-bot.json';
import Store from '../../../assets/lottie/store.json';
import Mind from '../../../assets/lottie/calendar.json';
import Coin from '../../../assets/lottie/coins.json';
import Target from '../../../assets/lottie/target.json';
import Notification from '../../../assets/lottie/notification-bell.json';
import appDetails from '../../../app.json'
import messaging from '@react-native-firebase/messaging';
import { MMKV } from 'react-native-mmkv';
import LogOutDialog from '../../common/StyledComponents/LogOutDialog/LogOutDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setEditName, setIsAuthenticated, setUserInfo, setWallpapers } from '../../redux/actions';
import TextTicker from 'react-native-text-ticker';
import translate from '../../context/Translations';
import { useQuery, useQueryClient } from 'react-query';
import { getAllWallpapers, getAppVersion, getChatBot, getDailyActivity, getDailyActivityWallpaper, getDashboardWallpaper, getUserInfo, registerMobileDevice, skipCategoryInfo, skipGenderInfo, updateUserCategoryInfo, updateUserGenderInfo } from '../../common/apis/api';
import FastImage from 'react-native-fast-image';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import Downward from '../../../assets/svg/downward';
import Upward from '../../../assets/svg/upward';
import Close from '../../../assets/svg/close';
import NewLabel from '../../../assets/lottie/new-label (2).json';
import Confetti from '../../../assets/lottie/savings.json';
import Menu from '../../../assets/svg/menu';
import Coins from '../../../assets/svg/settingsicons/coins.svg'
import { RootState } from '../../redux/rootReducer';
import Complete from '../../../assets/svg/complete';
import DeviceInfo from 'react-native-device-info'
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Link from '../../../assets/svg/settingsicons/link.svg'
import InAppReview from 'react-native-in-app-review';
import WebView from 'react-native-webview';
import { getYoutubeVideo } from '../../common/functionUtils/functionUtils';
import YouTubeIcon from '../../../assets/svg/youtube';

interface DashboardProps { }

const featureList = [
    {
        id: '1',
        feature_name: 'MentalWellBeing',
        feature_icon: require('../../../assets/images/mental-health.png'),
        tag: false
    },
    {
        id: '2',
        feature_name: 'MentalEducation',
        feature_icon: require('../../../assets/images/brain-education.png'),
        tag: false
    },
    {
        id: '3',
        feature_name: 'Chat',
        feature_icon: require('../../../assets/images/therapy.png'),
        tag: true
    },
    {
        id: '4',
        feature_name: 'Stories&Puzzles',
        feature_icon: require('../../../assets/images/autism.png'),
        tag: false
    },
    {
        id: '5',
        feature_name: 'Helpline',
        feature_icon: require('../../../assets/images/helpline.png'),
        tag: false
    }
];

const dashboardElements = [
    {
        id: 0,
        source: Store,
        // text: "New",
        textStyle: {
            top: -5,
            fontWeight: '700',
            color: 'black'
        },
        style: {
            height: Dimensions.get('window').height / 8,
            width: Dimensions.get('window').width / 8
        }
    },
    {
        id: 1,
        source: Coin,
        style: {
            height: Dimensions.get('window').height / 10,
            width: Dimensions.get('window').width / 10
        },
        // text: "New",
        textStyle: {
            top: -26,
            fontWeight: "700",
            color: 'black'
        }
    },
    {
        id: 2,
        source: Mind,
        style: {
            height: Dimensions.get('window').height / 7,
            width: Dimensions.get('window').width / 7
        },
        text: "New",
        textStyle: {
            top: -10,
            fontWeight: '700',
            color: 'black'
        }
    },
    {
        id: 3,
        source: Notification,
        // text: "New",
        style: {
            height: Dimensions.get('window').height / 8,
            width: Dimensions.get('window').width / 8
        }
    }
];

const Dashboard: FC<DashboardProps> = () => {
    const navigation: any = useNavigation();
    const queryClient = useQueryClient();

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState<boolean>(false);
    const [translatedFeatureList, setTranslatedFeatureList] = useState<any[]>([]);
    const [dailyActivity, setDailyActivity] = useState<any>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [dailyActivityWallpaper, setDailyActivityWallpaper] = useState<any>("");
    // const [wallpapers, setWallpapers] = useState<any>("");
    const [dashboardWallpaper, setDashboardWallpaper] = useState<any>("");
    const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);
    const [showUpdateApp, setShowUpdateApp] = useState<boolean>(false);
    const [appVersionDetails, setAppVersionDetails] = useState<any>([]);
    const [chatBot, setChatBot] = useState<any>({});
    const [showChatBotModal, setShowChatBotModal] = useState<boolean>(false);
    const [genderModal, setGenderModal] = useState<boolean>(false);
    const [categoryModal, setCategoryModal] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [showCoins, setShowCoins] = useState<boolean>(false);

    // Ref to store the previous app state
    let youtubeVideo = '';

    const animation = useRef(new Animated.Value(0)).current;
    const storage = new MMKV;
    const userInfoString: any = storage.getString('userInfo');
    const userInfo = JSON.parse(userInfoString);
    const language = storage.getString('language');
    const dispatch = useDispatch();
    const versionCode = DeviceInfo.getVersion();

    const selectedLanguage: any = useSelector((state: RootState) => state.app.language);
    const editName: any = useSelector((state: RootState) => state.app.editName);
    const user: any = useSelector((state: RootState) => state.app.userInfo);
    const categoryList: any = useSelector((state: RootState) => state.app.categoryList);
    const genderList: any = useSelector((state: RootState) => state.app.genderList);
    const wallpapers: any = useSelector((state: RootState) => state.app.wallpapers);

    useQuery({
        queryKey: ["dailyActivity"],
        queryFn: getDailyActivity,
        onSuccess(response) {
            if (response.data) {
                setDailyActivity(response.data.response)
            }
        }
    });

    useQuery({
        queryKey: ["appVersion"],
        queryFn: getAppVersion,
        onSuccess(response) {
            if (response.data) {
                setAppVersionDetails(response.data.response)
            }
        }
    });

    useQuery({
        queryKey: ["wallpapers"],
        queryFn: () => getAllWallpapers(userInfo.type_id),
        onSuccess(response) {
            if (response.data) {
                dispatch(setWallpapers(response.data.response))
            }
        }
    });

    const { isLoading } = useQuery({
        queryKey: ["userInfo"],
        queryFn: getUserInfo,
        onSuccess(response) {
            if (response.data) {
                dispatch(setUserInfo(response.data.response));
            }
        }
    });

    useQuery({
        queryKey: ["chatBot"],
        queryFn: getChatBot,
        onSuccess(response) {
            if (response.data) {
                setChatBot(response.data.response);
            }
        }
    });


    const handleGenderPress = async (gender: string) => {
        try {
            const response = await updateUserGenderInfo(gender);
            if (response && response.data) {
                queryClient.invalidateQueries("userInfo");
                setGenderModal(false);
                if (!user.sub_category || user.sub_category === "" && user.category_skip <= 5)
                    setCategoryModal(true);
            }
        } catch (err) {
            console.log("Error in saving user name", err);
            ToastAndroid.show("Error saving information!", ToastAndroid.SHORT)
        }
    }

    const handleCategoryPress = async (category: any) => {
        setSelectedCategories((prev) => {
            const updated = new Set(prev);
            if (updated.has(category.id)) {
                updated.delete(category.id); // Deselect if already selected
            } else {
                updated.add(category.id); // Add to selected if not already
            }
            return updated;
        });
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        Animated.timing(animation, {
            toValue: isDropdownOpen ? 0 : 1,
            duration: 400,
            useNativeDriver: false,
        }).start();
    };

    const dropdownHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200]
    });

    const registerDeviceToken = async () => {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        if (token) {
            await registerMobileDevice(token);
        }
    }

    const requestReview = () => {
        if (InAppReview.isAvailable()) {
            InAppReview.RequestInAppReview()
                .then((hasFlowFinishedSuccessfully) => {
                    // Handle successful or failed review flow
                    console.log('In-App Review completed:', hasFlowFinishedSuccessfully);
                })
                .catch((error) => {
                    // Handle errors
                    console.error('In-App Review Error:', error);
                });
        } else {
            console.log('In-App Review is not available on this device/platform');
        }
    };

    useEffect(() => {
        registerDeviceToken();
    }, [])

    useEffect(() => {
        // Run the modal logic only when the data has been fetched
        if (!isLoading) {
            if ((user?.gender_skip === undefined || user?.gender_skip < 5) && (user?.gender === "" || user?.gender === null)) {
                setGenderModal(true);
                setCategoryModal(false); // Ensure only the gender modal shows
            } else if ((user?.sub_category === "" || user?.sub_category === null) && (user?.category_skip === undefined || user?.category_skip < 5)) {
                setCategoryModal(true);
                setGenderModal(false); // Ensure only the category modal shows
            } else {
                setGenderModal(false);
                setCategoryModal(false);
            }
        }
    }, [isLoading, user.gender, user.gender_skip, user.sub_category, user.category_skip]);

    useEffect(() => {
        setTranslatedFeatureList(
            featureList.map(item => ({
                ...item,
                feature_name: translate(item.feature_name)
            }))
        );
    }, [language, selectedLanguage]);

    useEffect(() => {
        if (versionCode < appVersionDetails?.version_number) {
            setShowUpdateApp(true);
        }
    }, [appVersionDetails]);

    const showSideMenu = () => {
        navigation.toggleDrawer();
        dispatch(setEditName({ ...editName, isEditing: false }));
    };

    // Render each course item in the grid
    const renderDashboardItems = ({ item }: { item: any }) => (
        <TouchableOpacity key={item.id} style={styles.CourseContainer} activeOpacity={0.9}
            onPress={() => {
                if (item.id === '1') {
                    navigation.navigate('WellBeing');
                } else if (item.id === '2') {
                    navigation.navigate('Courses');
                } else if (item.id === '4') {
                    navigation.navigate('Themes');
                } else if (item.id === '5') {
                    navigation.navigate('Helpline');
                } else if (item.id === '3' && chatBot?.is_active) {
                    navigation.navigate('ChatComponent', { prompt: chatBot?.prompt, disclaimer: chatBot?.disclaimer })
                } else {
                    setShowChatBotModal(true);
                }
            }}
        >
            <Image source={item.feature_icon} style={styles.courseImage} />
            <Text style={language === 'mr' ? styles.courseNameMarathi : styles.courseNameEnglish}>{item.feature_name}</Text>
            {item.tag && <View style={{
                position: 'absolute',
                top: -45,
                right: -30
            }}>
                <LottieView source={NewLabel} style={{ height: 100, width: 100 }} autoPlay loop />
            </View>}
        </TouchableOpacity>
    );

    // Key extractor for FlatList
    const keyExtractor = (item: any) => item.id.toString();

    const handleLogOut = () => {
        setIsLogoutDialogVisible(true);
    };

    const confirmLogout = () => {
        storage.clearAll();
        dispatch(setIsAuthenticated(false));
        navigation.navigate('ProfileSelection');
    };

    const cancelLogout = () => {
        setIsLogoutDialogVisible(false);
    };

    const goToDailyActivity = () => {
        navigation.navigate("Daily Activity", { activityID: dailyActivity.activity_id, activityName: dailyActivity.activity_name });
    }

    useFocusEffect(
        useCallback(() => {
            queryClient.invalidateQueries("dailyActivity");
            queryClient.invalidateQueries("appVersion");
            // queryClient.invalidateQueries("dailyActivityWallpaper");
            queryClient.invalidateQueries("wallpapers");
            // queryClient.invalidateQueries("userInfo");
            queryClient.invalidateQueries("chatBot");
            queryClient.invalidateQueries("userCategory");
            requestReview();
        }, [])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("dailyActivity");
            queryClient.invalidateQueries("appVersion");
            // queryClient.invalidateQueries("dailyActivityWallpaper");
            queryClient.invalidateQueries("wallpapers");
            queryClient.invalidateQueries("userInfo");
            queryClient.invalidateQueries("userCategory");
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const renderGenderList = ({ item }: any) => {
        return (
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    key={item.id}
                    onPress={() => handleGenderPress(item.id)}
                    style={{
                        backgroundColor: 'white',
                        height: Dimensions.get('screen').height * 0.13,
                        width: Dimensions.get('screen').width * 0.27,
                        marginBottom: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 16,
                        borderRadius: 160,
                        alignSelf: 'center'
                    }}
                >
                    <FastImage
                        source={{ uri: item.gender_image }}
                        style={{
                            height: Dimensions.get('screen').height * 0.09,
                            width: Dimensions.get('screen').width * 0.15,
                        }}
                        resizeMode='cover'
                    />
                    <Text style={{ color: 'black', fontSize: 13, fontWeight: '500' }}>{item.gender_name}</Text>
                </TouchableOpacity>
            </View>
        );
    };


    const renderUserInfo = ({ item }: any) => {
        const isSelected = selectedCategories.has(item.id);

        return (
            <View style={styles.flexColumn}>
                <TouchableOpacity
                    key={item.id}
                    onPress={() => handleCategoryPress(item)}
                    style={[styles.categoryContainer, {
                        backgroundColor: isSelected ? colours['theme-color'] : 'white',
                        justifyContent: !item.category_image ? 'center' : 'flex-start',
                        borderColor: isSelected ? colours['theme-color'] : 'white',
                        borderWidth: isSelected ? 2 : 0,
                    }]}
                >
                    {item.category_image ? <FastImage
                        source={{ uri: item.category_image }}
                        style={styles.categoryImage}
                        resizeMode='center'
                    /> : <></>}
                    <Text style={{ color: 'black', fontSize: 12.5, fontWeight: isSelected ? 'bold' : 'normal', textAlign: 'center', width: 70 }}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleSkipGenderPress = async () => {
        try {
            const response = await skipGenderInfo()
            if (response && response.data) {
                setGenderModal(false)
                if ((user?.sub_category === "" || user?.sub_category === null) && (user?.category_skip === undefined || user?.category_skip < 5)) {
                    setCategoryModal(true);
                } else {
                    return;
                }
            }
        } catch (err) {
            console.error("Error in skip gender", err)
        }
    }

    const handleSkipCategoryPress = async () => {
        try {
            const response = await skipCategoryInfo()
            if (response && response.data) {
                setCategoryModal(false)
            }
        } catch (err) {
            console.error("Error in skip category", err)
        }
    }

    const handleConfirmPress = async () => {
        const array = [...selectedCategories];

        try {
            const response = await updateUserCategoryInfo(array.toString());
            if (response && response.data) {
                queryClient.invalidateQueries("userInfo");
                setGenderModal(false)
                setCategoryModal(false);
            } else if (response.status === 500) {
                ToastAndroid.show("Error saving information!", ToastAndroid.SHORT)
            }
        } catch (err) {
            console.log("Error in saving user name", err);
        }
    }

    const handleYoutubeVideo = async () => {
        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(user.demo_link, {
                    toolbarColor: colours['theme-color'],
                    enableDefaultShare: false,
                });
            }
        } catch (err) {
            ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
        }
    }

    youtubeVideo = getYoutubeVideo(wallpapers?.dashboard?.content_url);

    return (
        <View
            // {...panResponder.panHandlers}
            style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={`${translate('Hi')}, ${user.name}`}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                onLeftIconPress={showSideMenu}
                leftIcon={<Menu />}
                rightIcon={<YouTubeIcon height={30} width={30} />}
                onRightIconPress={handleYoutubeVideo}
            />
            <ScrollView contentContainerStyle={styles.upperContainer} horizontal={false} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <ScrollView contentContainerStyle={styles.dashboardFeatures} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {dashboardElements.map((element, index) => (
                        <TouchableOpacity key={index} style={styles.dashboardElement1} activeOpacity={0.9} onPress={() => {
                            if (element.id === 3) {
                                navigation.navigate('Notifications');
                            } else if (element.id === 2) {
                                navigation.navigate('Reminder');
                            } else if (element.id === 1) {
                                // if (user.coins === 0) {
                                //     ToastAndroid.show(language === 'en' ? `Complete a chapter to earn points` : 'पॉईंट्स मिळवण्यासाठी एखादा धडा पूर्ण करा', ToastAndroid.SHORT);
                                // } else {
                                //     setShowCoins(true);
                                // }
                                ToastAndroid.show(translate("ComingSoon"), ToastAndroid.SHORT)
                            } else {
                                ToastAndroid.show(translate("ComingSoon"), ToastAndroid.SHORT)
                            }
                        }}
                            onLongPress={() => {
                                if (element.id === 3) {
                                    ToastAndroid.show('Notifications', ToastAndroid.SHORT);
                                } else if (element.id === 2) {
                                    ToastAndroid.show('Reminder', ToastAndroid.SHORT);
                                } else if (element.id === 1) {
                                    ToastAndroid.show(language === 'en' ? `You have earned ${user.coins} points!` : `तुम्ही ${user.coins} पॉईंट्स मिळवले आहे!`, ToastAndroid.SHORT);
                                } else if (element.id === 0) {
                                    ToastAndroid.show('Store', ToastAndroid.SHORT);
                                } else {
                                    ToastAndroid.show(translate("ComingSoon"), ToastAndroid.SHORT)
                                }
                            }}
                        >
                            {element.text && <View style={{
                                position: 'absolute',
                                top: -40,
                                right: -30
                            }}>
                                <LottieView source={NewLabel} style={{ height: 80, width: 80 }} autoPlay loop />
                            </View>}

                            <View style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <LottieView source={element.source} style={[element.style, { marginBottom: 0 }]} autoPlay loop />
                                {/* {element.id === 1 && <Text style={{
                                    top: -24,
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    color: 'gray'
                                }}>{user && (user?.coins === 0 || user?.coins === undefined) ? '' : `${user.coins}`}</Text>} */}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {wallpapers?.dashboard?.content_type === 'IMAGE' ? (
                    <FastImage
                        source={{ uri: wallpapers?.dashboard?.content_url }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').height * 0.25,
                            marginBottom: 8
                        }}
                    />
                ) : (
                    <View style={{
                        height: Dimensions.get('screen').height * 0.25,
                        width: Dimensions.get('screen').width * 0.95,
                        marginBottom: 8,
                    }}>
                        <WebView
                            style={{ flex: 1, borderRadius: 16 }}
                            javaScriptEnabled={true}
                            allowsFullscreenVideo={true}
                            source={{ uri: `${youtubeVideo}?autoplay=1` }}
                        />
                    </View>
                )}


                <Animated.View style={{
                    position: 'relative',
                    padding: 5,
                    width: Dimensions.get('window').width * 0.95
                }}>
                    <TouchableOpacity style={isDropdownOpen ? styles.todaysActivityExpanded : styles.todaysActivityCollapsed} activeOpacity={0.9} onPress={goToDailyActivity}>
                        <View style={styles.ActivityNameArrow}>
                            <View style={styles.TodaysActvityName}>
                                {/* <Text style={styles.ActivityName}>{translate('TodaysActivity')}: </Text> */}
                                <TextTicker
                                    style={[styles.ActivityName, { width: Dimensions.get('window').width * 0.7 }]}
                                    // duration={10000}
                                    scrollSpeed={50}
                                    loop
                                    bounce={false}
                                    repeatSpacer={50}
                                    marqueeDelay={100}>
                                    {dailyActivity.activity_name}
                                </TextTicker>
                            </View>

                            {isDropdownOpen ?
                                <TouchableOpacity onPress={toggleDropdown}>
                                    <Downward height={24} width={24} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={toggleDropdown}>
                                    <Upward height={24} width={24} />
                                </TouchableOpacity>
                            }
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={isDropdownOpen ? { ...styles.dropdownContentExpanded, height: dropdownHeight } : { ...styles.dropdownContentCollapsed, height: dropdownHeight }}>
                    <TouchableOpacity onPress={goToDailyActivity} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        {isDropdownOpen && (
                            <FastImage
                                style={[styles.todaysActivityImage, { height: Dimensions.get('screen').height * 0.21, borderRadius: 32 }]}
                                source={{ uri: wallpapers?.daily_activity?.content_url }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.container}>
                    <FlatList
                        data={translatedFeatureList}
                        renderItem={renderDashboardItems}
                        keyExtractor={keyExtractor}
                        numColumns={2}
                        contentContainerStyle={styles.flatListContainer}
                    />
                </View>
            </ScrollView>

            <LogOutDialog
                visible={isLogoutDialogVisible}
                onCancel={cancelLogout}
                onConfirm={confirmLogout}
            />

            <Modal visible={genderModal} statusBarTranslucent animationType="fade" transparent onRequestClose={() => setGenderModal(false)}>
                <TouchableOpacity style={styles.modal} activeOpacity={1}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Select one option</Text>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={genderList}
                            keyExtractor={(item) => item.value}
                            renderItem={renderGenderList}
                            numColumns={genderList.length > 3 ? 2 : 1}
                        />
                    </View>

                    <TouchableOpacity onPress={handleSkipGenderPress} style={styles.expertAnswer}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, width: 100, textAlign: 'center' }}>Skip</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal visible={categoryModal} statusBarTranslucent animationType="fade" transparent onRequestClose={() => setCategoryModal(false)}>
                <TouchableOpacity style={styles.modal} activeOpacity={1}>
                    <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Who are you?</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'normal', marginTop: -10 }}>Select Multiple</Text>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={categoryList}
                            keyExtractor={(item) => item.value}
                            renderItem={renderUserInfo}
                            key={'category'}
                            contentContainerStyle={{
                                width: Dimensions.get('window').width,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            numColumns={3}
                        />
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 6
                        }}>
                            <TouchableOpacity onPress={handleSkipCategoryPress} style={[styles.expertAnswer, { backgroundColor: colours['warning'] }]}>
                                <Text style={{ color: 'black', fontWeight: 'normal', fontSize: 18, width: 100, textAlign: 'center' }}>Skip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleConfirmPress} style={styles.expertAnswer}>
                                <Text style={{ color: 'white', fontWeight: 'normal', fontSize: 18, width: 100, textAlign: 'center' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </TouchableOpacity>
            </Modal>

            <Modal visible={showCoins} statusBarTranslucent animationType="fade" transparent onRequestClose={() => setShowCoins(false)}>
                <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={() => setShowCoins(false)}>
                    <View style={styles.flexColumn}>
                        <LottieView source={Confetti} style={{
                            height: Dimensions.get('window').height * 0.4,
                            width: Dimensions.get('window').width
                        }} autoPlay loop />
                        {/* <Coins /> */}
                        <Text style={styles.coinsView}>{language === 'mr' ? `तुम्ही ${user.coins} पॉईंट्स मिळवले आहे!` : `You have earned ${user.coins} points!`}</Text>
                    </View>
                </TouchableOpacity>
            </Modal>


            <CustomModal visible={showUpdateApp}>
                <TouchableOpacity onPress={() => Linking.openURL('market://details?id=com.mycaapp')}>
                    <View style={styles.updateAppModal}>
                        <FastImage
                            style={[
                                styles.imageView,
                                {
                                    height: Dimensions.get('window').height * 0.3,
                                    width: Dimensions.get('window').width,
                                },
                            ]}
                            source={{ uri: appVersionDetails.media_url }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={{ color: 'black', fontSize: 14, textAlign: 'center' }}>{appVersionDetails.text}</Text>
                        <Text style={{ color: 'black', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>Click Here to update the App</Text>
                    </View>
                </TouchableOpacity>
            </CustomModal >

            <CustomModal visible={showComingSoonModal} onRequestClose={() => setShowComingSoonModal(false)}>
                <View style={styles.comingSoonModal}>
                    <View style={{
                        top: 25,
                        right: 15,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        zIndex: 2
                    }}>
                        <TouchableOpacity onPress={() => setShowComingSoonModal(false)} style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'red',
                            height: 30,
                            width: 30,
                            borderRadius: 100,
                            padding: 4
                        }}>
                            <Close />
                        </TouchableOpacity>
                    </View>
                    <LottieView
                        source={ComingSoon} style={styles.comingSoonLottie} autoPlay loop
                    />
                </View>
            </CustomModal>

            <CustomModal visible={showChatBotModal} onRequestClose={() => setShowChatBotModal(false)}>
                <View style={styles.chatBotModal}>
                    <LottieView
                        source={Maintenance} style={styles.chatBotLottie} autoPlay loop
                    />
                </View>
                <Text style={{
                    color: 'black',
                    fontSize: 15,
                    textAlign: 'center',
                    padding: 8
                }}>
                    {translate('Maintenance')}
                </Text>
                {/* <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10
                }}>

                    <TouchableOpacity
                        style={styles.expertAnswer}
                        activeOpacity={0.6}
                        onPress={async () => {
                            try {
                                if (await InAppBrowser.isAvailable()) {
                                    await InAppBrowser.open('https://myca-v1.vercel.app/login', {
                                        toolbarColor: colours['theme-color'],
                                        enableDefaultShare: false,
                                    });
                                }
                            } catch (err) {
                                ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
                            }
                        }}
                    >

                        <Text style={[styles.text, { color: 'black' }]}>
                            Browser
                        </Text>
                        <Link />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.expertAnswer}
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('ChatComponent', { prompt: chatBot?.prompt, disclaimer: chatBot?.disclaimer })}
                    >
                        <Text style={[styles.text, { color: 'black' }]}>
                            Chatbot
                        </Text>
                    </TouchableOpacity>
                </View> */}
            </CustomModal>
        </View >
    )
}

export default Dashboard;