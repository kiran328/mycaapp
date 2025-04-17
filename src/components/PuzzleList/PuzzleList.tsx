import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, GestureResponderEvent, Dimensions, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getPuzzle, getThemePuzzles } from '../../common/apis/api';
import styles from './PuzzleListStyle';
import LottieView from 'lottie-react-native';
import HealthWorkerPNG from '../../../assets/lottie/winter-traveler.json';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import Header from '../../common/StyledComponents/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import colour from '../../common/constants/styles.json'
import { useQuery } from 'react-query';
import { setPuzzleId, setPuzzleName } from '../../redux/actions';
import Svg, { Path } from 'react-native-svg';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import Info from '../../../assets/svg/info';
import Back from '../../../assets/svg/back';
import FastImage from 'react-native-fast-image';

interface PuzzleListsProps { }

interface Puzzle {
    id: number;
    puzzle_name: string;
    puzzle_no: number;
}

const PuzzleList: FC<PuzzleListsProps> = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const themeId: any = useSelector((state: RootState) => state.app.themeId);
    const themeName: any = useSelector((state: RootState) => state.app.themeName);
    const themeDescription: any = useSelector((state: RootState) => state.app.themeDescription);
    const wallpapers: any = useSelector((state: RootState) => state.app.wallpapers);
    
    const [puzzleList, setPuzzleList] = useState<any[]>([]);
    const [themeWallpaper, setThemeWallpaper] = useState<any>("");
    const [showDescription, setShowDescription] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);


    const handleBackPress = () => {
        navigation.navigate('Themes');
    };

    useQuery({
        queryKey: ["puzzleList"],
        queryFn: () => getThemePuzzles(themeId),
        // refetchInterval: 5000,
        onSuccess: (response) => {
            if (response.data) {
                const sortedChapters = response.data.response.sort((a: any, b: any) => a.puzzle_no - b.puzzle_no);
                setPuzzleList(sortedChapters);
            }
        }
    });

    useFocusEffect(
        useCallback(() => {
            wallpapers?.dynamic?.find((item: any) => {
                if (item.location === 'PUZZLES') {
                    setThemeWallpaper(item?.content_url);
                }
            });
        }, [])
    );


    const navigateToPuzzle = (puzzleID: number, puzzleName: string) => {
        dispatch(setPuzzleId(puzzleID));
        dispatch(setPuzzleName(puzzleName));
        navigation.navigate('Puzzle');
    };

    const renderChapterItem = ({ item }: { item: Puzzle }) => (
        <TouchableOpacity
            key={item.id}
            style={styles.chapterItem}
            onPress={() => {
                navigateToPuzzle(item.id, item.puzzle_name);
            }}>
            <Text
                style={{
                    color: 'black',
                    fontSize: 26,
                    fontWeight: '700',
                    backgroundColor: colour['theme-color'],
                    padding: 18,
                    borderTopLeftRadius: 32,
                    borderBottomLeftRadius: 32,
                    width: 70,
                    textAlign: 'center',
                    justifyContent: 'center'
                }}>
                {item.puzzle_no}
            </Text>
            <Text
                style={{ color: 'black', fontSize: 16, fontWeight: '500', flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {item.puzzle_name}
            </Text>
        </TouchableOpacity>
    );

    const handleDescriptionPress = () => {
        setShowDescription(true);
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await getThemePuzzles(themeId);
            if (response.data) {
                const sortedChapters = response.data.response.sort((a: any, b: any) => a.puzzle_no - b.puzzle_no);
                setPuzzleList(sortedChapters);
            }
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Header
                title={themeName}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                leftIcon={<Back />}
                rightIcon={<Info />}
                onRightIconPress={handleDescriptionPress}
                onLeftIconPress={handleBackPress} // Handle back button press
            />
            {puzzleList.length === 0 ? (
                <View style={styles.NodataLottie}>
                    <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                </View>
            ) : (
                <>
                    <FastImage
                        source={{ uri: themeWallpaper }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').height * 0.3,
                            // marginVertical: 8
                        }}
                    />
                    <FlatList
                        data={puzzleList}
                        style={styles.chapterList}
                        renderItem={renderChapterItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </>
            )}

            <CustomModal
                visible={showDescription}
                onRequestClose={() => setShowDescription(false)}
            >
                <View style={{
                    padding: 16
                }}>
                    <Text style={{
                        color: 'black'
                    }}>{themeDescription}</Text>
                </View>
            </CustomModal>
        </View>
    );
};

export default PuzzleList;
