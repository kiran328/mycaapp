import React, { FC, useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HealthWorkerPNG from '../../../assets/lottie/freelancer-online-communication.json';
import LottieView from 'lottie-react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Basic from './BasicCourses/Basic';
import Advance from './AdvanceCourses/Advance';
import Header from '../../common/StyledComponents/Header';
import colours from '../../common/constants/styles.json'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../common/apis/api';
import LoadingSpinner from '../../../assets/lottie/loading.json'
import { setCourseId, setCourseName } from '../../redux/actions';
import translate from '../../context/Translations';
import Back from '../../../assets/svg/back';
import FastImage from 'react-native-fast-image';
import { RootState } from '../../redux/rootReducer';

interface CourseProps { }

const Courses: FC<CourseProps> = () => {
    const navigation: any = useNavigation();
    const [index, setIndex] = useState(0);
    const dispatch = useDispatch();
    const [courseList, setCourseList] = useState<any[]>([]);
    const [courseWallpaper, setCourseWallpaper] = useState<any>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const wallpapers: any = useSelector((state: RootState) => state.app.wallpapers);

    useQuery({
        queryKey: ["courseList"],
        queryFn: getCourses,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data && response.data.response.length > 0) {
                setCourseList(response.data.response)
            }
        }
    })

    useFocusEffect(
        useCallback(() => {
            wallpapers?.dynamic?.find((item: any) => {
                if (item.location === 'COURSES') {
                    setCourseWallpaper(item?.content_url);
                }
            });
        }, [])
    );


    const goToChapter = (course: any) => {
        dispatch(setCourseId(course.id));
        dispatch(setCourseName(course.course_name))
        navigation.navigate('Chapters');
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await getCourses();
            if (response.data) {
                setCourseList(response.data.response);
            }
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    // Render each course item in the grid
    const renderCourseItem = ({ item }: { item: any }) => (
        <TouchableOpacity key={item.id} style={styles.CourseContainer} onPress={() => goToChapter(item)}>
            <View style={styles.courseImageContainer}>
                <Image
                    src={item?.course_icon}
                    style={styles.courseImage}
                    resizeMode='contain'
                />
            </View>
            <View style={styles.courseNameContainer}>
                <Text style={styles.courseName}>{item.course_name}</Text>
            </View>
        </TouchableOpacity>
    );

    // Key extractor for FlatList
    const keyExtractor = (item: any) => item.id.toString();

    const [routes] = useState([
        { key: 'basic', title: 'Basic' },
        // { key: 'advance', title: 'Advance' },
    ]);

    const navigateToDashboard = () => {
        navigation.navigate("Dashboard");
    };

    const renderScene = SceneMap({
        basic: Basic,
        advance: Advance,
    });

    const handleIndexChange = (newIndex: number) => {
        setIndex(newIndex);
    };

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ height: 0 }}
            style={{
                margin: 16,
                borderRadius: 32,
                backgroundColor: colours['theme-color']
            }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            activeColor="black"
            inactiveColor="gray"
            pressColor="transparent"
            onTabPress={({ route }) => {
                const { key } = route;
                const index = routes.findIndex((route) => route.key === key);
                handleIndexChange(index);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Header
                title={translate("MentalEducation")}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToDashboard}
            />
            <View style={styles.profileContainer}>
                <FastImage
                    source={{ uri: courseWallpaper }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                        width: Dimensions.get('screen').width,
                        height: Dimensions.get('screen').height * 0.3,
                    }}
                />
            </View>
            {courseList && courseList.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
                    <View>
                        <LottieView
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                            source={LoadingSpinner}
                        />
                        {/* <Text style={{ color: 'black', fontWeight: '500' }}>No Content Available</Text> */}
                    </View>
                </View>
            ) : (
                <FlatList
                    data={courseList}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderCourseItem}
                    keyExtractor={keyExtractor}
                    numColumns={2}
                    contentContainerStyle={styles.flatListContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

        </View>
    );
};

interface Styles {
    container: ViewStyle;
    profileContainer: ViewStyle;
    lottieStyles: ViewStyle;
    CourseContainer: ViewStyle;
    courseImageContainer: ViewStyle;
    courseImage: any;
    courseName: any;
    courseNameContainer: ViewStyle;
    flatListContainer: ViewStyle;
}

const styles: Styles = {
    container: {
        flex: 1,
        backgroundColor: colours['theme-backgroung-color'],
        // marginBottom: 16
    },
    profileContainer: {
        alignItems: 'center',
        // marginBottom: 20,
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.27,
        width: Dimensions.get('window').width,
    },
    CourseContainer: {
        flex: 1,
        margin: 6,
        padding: 8,
        borderRadius: 8,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        maxHeight: Dimensions.get('window').height * 0.3,
    },
    courseImage: {
        width: Dimensions.get('window').width / 3.5,
        height: Dimensions.get('window').height / 8,
        borderRadius: 8
    },
    courseImageContainer: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').height / 8,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseNameContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    courseName: {
        fontSize: 16.5,
        fontWeight: '500',
        color: 'black',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
};

export default Courses;
