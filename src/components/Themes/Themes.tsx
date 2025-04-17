import React, { FC, useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../common/StyledComponents/Header';
import colour from '../../common/constants/styles.json';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from './ThemeStyles';
import LottieView from 'lottie-react-native';
import PuzzlesLottie from '../../../assets/lottie/team-building.json';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import TextTicker from 'react-native-text-ticker';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getThemes } from '../../common/apis/api';
import { setThemeDescription, setThemeId, setThemeName } from '../../redux/actions';
import ThemeDescription from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import translate from '../../context/Translations';
import Back from '../../../assets/svg/back';
import { RootState } from '../../redux/rootReducer';
import FastImage from 'react-native-fast-image';

interface ThemeProps { }

const Themes: FC<ThemeProps> = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const [themeList, setThemeList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [themeWallpaper, setThemeWallpaper] = useState<any>("");

    const wallpapers: any = useSelector((state: RootState) => state.app.wallpapers);

    useQuery({
        queryKey: ["themeList"],
        queryFn: getThemes,
        onSuccess(response) {
            if (response.data && response.data.response.length > 0) {
                setThemeList(response.data.response);
            }
        }
    });

    useFocusEffect(
        useCallback(() => {
            wallpapers?.dynamic?.find((item: any) => {
                if (item.location === 'PUZZLETHEME') {
                    setThemeWallpaper(item?.content_url);
                }
            });
        }, [])
    );


    const goToChapter = (theme: any) => {
        dispatch(setThemeId(theme.id));
        dispatch(setThemeName(theme.theme_name));
        dispatch(setThemeDescription(theme.theme_desc));
        navigation.navigate('PuzzleList');
    };

    const renderCourseItem = ({ item }: { item: any }) => (
        <TouchableOpacity key={item.id} style={styles.CourseContainer} onPress={() => goToChapter(item)}>
            <View style={styles.courseImageContainer}>
                <Image
                    src={item?.theme_media}
                    style={styles.courseImage}
                    resizeMode='contain'
                />
            </View>
            <View style={styles.courseNameContainer}>
                <Text style={styles.courseName}>{item.theme_name}</Text>
            </View>
        </TouchableOpacity>
    );

    const keyExtractor = (item: any) => item.id.toString();

    const navigateToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    // Filter course list based on search query
    const filteredThemeList = themeList.filter(theme =>
        theme.theme_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await getThemes();
            if (response.data) {
                setThemeList(response.data.response);
            }
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Header
                title={translate("Stories&Puzzles")}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToDashboard}
            />

            <View style={styles.container}>
                <FastImage
                    source={{ uri: themeWallpaper }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                        width: Dimensions.get('screen').width,
                        height: Dimensions.get('screen').height * 0.3,
                        // marginVertical: 8
                    }}
                />
                {filteredThemeList.length === 0 ? (
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
                        data={filteredThemeList}
                        renderItem={renderCourseItem}
                        keyExtractor={keyExtractor}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContainer}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                )}
            </View>
        </View>
    );
};

export default Themes;
