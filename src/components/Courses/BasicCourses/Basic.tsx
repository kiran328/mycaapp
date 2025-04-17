import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, Image, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../../assets/lottie/loading.json'
import { getCourses, getDailyActivity } from '../../../common/apis/api';
import { useDispatch } from 'react-redux';
import { setCourseId, setCourseName } from '../../../redux/actions';
import styles from './styles';
import LottieView from 'lottie-react-native';
import TextTicker from 'react-native-text-ticker';
import { useQuery } from 'react-query';

interface ChaptersProps { }

const Basic: FC<ChaptersProps> = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const [courseList, setCourseList] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useQuery({
        queryKey: ["courseList"],
        queryFn: getCourses,
        // refetchInterval: 5000,
        onSuccess(response) {
            // console.log("[courseList]", response.data.response);
            if (response.data && response.data.response.length > 0) {
                setCourseList(response.data.response)
            }
        }
    })

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
            <Image src={item.course_icon} style={styles.courseImage} />
            {/* <TextTicker
                style={styles.courseName}
                // duration={10000}
                scrollSpeed={50}
                loop
                bounce={false}
                repeatSpacer={50}
                marqueeDelay={80}>
                {item.course_name}
            </TextTicker> */}
            <Text style={styles.courseName}>{item.course_name}</Text>
        </TouchableOpacity>
    );

    // Key extractor for FlatList
    const keyExtractor = (item: any) => item.id.toString();

    return (
        <View style={styles.container}>
            {courseList && courseList.length > 0 ? (
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
            ) : (
                <LottieView
                    autoPlay
                    source={LoadingSpinner}
                    loop
                />
            )}
        </View>
    );
};

export default Basic;
