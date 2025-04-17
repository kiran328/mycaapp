import React, { FC, useState, useEffect } from 'react'
import { Calendar } from 'react-native-calendars';
import { View, Text, Button, Dimensions, ScrollView, TouchableOpacity, Image, ToastAndroid, ActivityIndicator } from 'react-native'
import colours from '../../common/constants/styles.json'
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import translate from '../../context/Translations';
import styles from './MoodCalenderStyles.module';
import LottieView from 'lottie-react-native';
import { formatDateToDDMMYYY } from '../../common/functionUtils/functionUtils';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal.tsx';
import Loading from '../../../assets/lottie/loading.json';
import Backward from '../../../assets/svg/moodcalender/backward.js';
import Forward from '../../../assets/svg/moodcalender/forward.js';
import moment from 'moment'
import { useQuery, useQueryClient } from 'react-query';
import { getMoodList, getUserMoodData, submitUserMood } from '../../common/apis/api.ts';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { MMKV } from 'react-native-mmkv';
import Back from '../../../assets/svg/back.js';

interface MoodCalenderProps { }

const MoodCalender: FC<MoodCalenderProps> = () => {
    const navigation: any = useNavigation();
    const queryClient = useQueryClient();

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedMood, setSelectedMood] = useState<any>({
        id: '',
        mood: null,
        name: '',
        marathi_name: '',
        image: ''
    });
    const [moodList, setMoodList] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
    const [markedMoods, setMarkedMoods] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const storage = new MMKV;
    const language = storage.getString('language');
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const newMarkedDates: any = {};
    const newMarkedMoods: any = {};

    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    const yesterdayFormatted = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const todaysDate = `${year}-${month}-${day}`;

    useEffect(() => {
        setSelectedDate(todaysDate)
    }, []);

    useQuery({
        queryKey: ["moodList"],
        queryFn: getMoodList,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data) {
                setMoodList(response.data.response)
            }
        }
    });

    useQuery({
        queryKey: ["userMoods"],
        queryFn: () => getUserMoodData(month, String(year)),
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data) {
                response.data.response?.forEach((item: any) => {
                    newMarkedDates[item.mood_date] = {
                        selected: true,
                        marking: true,
                    };
                    newMarkedMoods[item.mood_date] = item?.mood_img;
                });

                // Update state with marked dates
                setMarkedDates(newMarkedDates);
                setMarkedMoods(newMarkedMoods);
            }
        }
    });

    const navigateToWellBeing = () => {
        navigation.navigate('WellBeing');
    };

    const handleMoodClick = (id: number, name: string, mood: any, marathi_name: string, image: string) => {
        if (!selectedDate) {
            ToastAndroid.show("Select a date!", ToastAndroid.SHORT)
        } else {
            setIsModalOpen(true);
            setSelectedMood({ id, mood, name, marathi_name, image });
        }
    }

    const handleSumbitMood = async () => {
        try {
            setIsLoading(true);
            const response = await submitUserMood(selectedMood.id, selectedDate, selectedMood.image)
            if (response.data) {
                setSelectedDate(selectedDate);
                setIsLoading(false);
                setSelectedMood({});
                setIsModalOpen(false);
                queryClient.invalidateQueries("userMoods");
            }
        } catch (error) {
            console.error("Error in submitting user mood", error)
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        }
    }

    const handleDatePress = (date: any) => {
        if (date.dateString === todaysDate || date.dateString === yesterdayFormatted) {
            setSelectedDate(date.dateString);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate('MoodCalender')}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={navigateToWellBeing}
            />
            <View style={styles.container}>
                <>
                    <Calendar
                        style={styles.calenderStyles}
                        current={selectedDate}
                        horizontal={true}
                        pagingEnabled={true}
                        enableSwipeMonths={true}
                        markedDates={markedDates}
                        theme={{
                            monthTextColor: '#BF3BC1',
                            textDayFontFamily: 'Arial',
                            textMonthFontFamily: 'Arial',
                            textDayHeaderFontFamily: 'Arial',
                            textDayFontWeight: '300',
                            textMonthFontWeight: '500',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 24,
                            textDayHeaderFontSize: 16
                        }}
                        onDayPress={(day: any) => {
                            setSelectedDate(day.dateString);
                        }}
                        renderArrow={(direction: any) => {
                            return (
                                direction === 'left' ? <Backward /> : <Forward />
                            )
                        }}
                        dayComponent={({ date, state }: any) => {
                            // Determine if the date is in the current month
                            const isSelected = selectedDate === date.dateString; // Check if current date is selected

                            const containerStyle: any = {
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isSelected ? '#BF3BC1' : '#ffffff', // Background color based on selection and current month
                                margin: 3,
                                borderRadius: isSelected ? 50 : 0,
                            };

                            const dayTextStyle: any = {
                                color: isSelected ? '#ffffff' : (state === 'disabled' ? '#b6c1cd' : '#BF3BC1'),
                                fontSize: 17,
                                padding: 5,
                            };

                            return (
                                <View style={containerStyle}>
                                    <TouchableOpacity onPress={() => handleDatePress(date)} disabled={date.dateString !== `${year}-${month}-${day}` && date.dateString !== yesterdayFormatted}>
                                        {markedDates[date.dateString] && state !== 'disabled' ? (
                                            <View style={{
                                                position: 'relative'
                                            }}>
                                                <Image
                                                    source={{ uri: markedMoods[date.dateString] }}
                                                    style={styles.moodMarkerStyles}
                                                    resizeMode="contain"
                                                />
                                                <Text style={dayTextStyle}>{date.day}</Text>
                                            </View>
                                        ) : (
                                            <Text style={dayTextStyle}>{date.day}</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                    <Text style={[styles.text, { color: '#BF3BC1', marginTop: 16, textAlign: 'center' }]}>{translate("Howareyoutoday")}</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent} scrollEnabled={true} showsVerticalScrollIndicator={false}>
                        {Array.from({ length: 3 }, (_, rowIndex) => (
                            <View key={`row_${rowIndex}`} style={styles.lottieContainer}>
                                {moodList.slice(rowIndex * 4, rowIndex * 4 + 4).map(({ id, lottie_url, name, marathi_name, img_url }: any) => (
                                    <TouchableOpacity key={`mood_${id}`} onPress={() => handleMoodClick(id, name, lottie_url, marathi_name, img_url)} style={styles.moodStyle}>
                                        <FastImage
                                            source={{ uri: lottie_url }}
                                            style={{
                                                height: Dimensions.get('window').height * 0.08,
                                                width: Dimensions.get('window').width * 0.08,
                                                aspectRatio: 1.4
                                            }}
                                            resizeMode='contain'
                                        />
                                        {/* <Text style={[styles.text, { color: 'black', marginLeft: 30 }]}>{name}</Text> */}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </>

            </View>

            <CustomModal visible={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 16,
                    gap: 8,
                    height: Dimensions.get('window').height * 0.3,
                    width: Dimensions.get('window').width * 0.7,
                }}>
                    <Text style={[styles.text, { color: 'black', fontSize: 20 }]}>{translate("YourMood")}</Text>
                    <Text style={[styles.text, { color: '#BF3BC1', fontSize: 20 }]}>{language === 'mr' ? selectedMood.marathi_name : selectedMood.name} {language === 'mr' ? translate("aahe") : "mood"}</Text>
                    <Text style={[styles.text, { color: 'black' }]}>{formatDateToDDMMYYY(selectedDate)}</Text>
                    <FastImage
                        source={{ uri: selectedMood.mood }}
                        style={{
                            height: Dimensions.get('window').height * 0.15,
                            width: Dimensions.get('window').width * 0.1,
                            aspectRatio: 1.45
                        }}
                        resizeMode='contain'
                    />
                </View>

                <TouchableOpacity
                    style={styles.expertAnswer}
                    activeOpacity={0.6}
                    onPress={handleSumbitMood}
                >
                    <Text style={styles.text}>{isLoading ? <ActivityIndicator color={'white'} /> : 'Submit'}</Text>
                </TouchableOpacity>
            </CustomModal>
        </View>
    );
};

export default MoodCalender;

