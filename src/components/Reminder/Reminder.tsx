import React, { useState, FC, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Switch, ToastAndroid, StyleSheet, TouchableOpacity, Platform, Dimensions, BackHandler, Modal } from 'react-native';
import PushNotification from 'react-native-push-notification';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MMKV } from 'react-native-mmkv';
import Header from '../../common/StyledComponents/Header';
import Back from '../../../assets/svg/back';
import Info from '../../../assets/svg/info';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import colour from '../../common/constants/styles.json'
import styles from './ReminderStyle';
import translate from '../../context/Translations';
import Delete from '../../../assets/svg/delete';
import DateTime from '../../../assets/svg/settingsicons/date.svg'
import AddNote from '../../../assets/svg/addNote';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import { set } from 'lodash';
import { Divider } from '@rneui/base';

interface ReminderProps { }

interface Reminder {
    id: number;
    message: string;
    date: Date;
    time: Date;
    repeatInterval: RepeatInterval;
    isActive: boolean;
    notificationId: number;  // Add this to track notification ID
}

type RepeatInterval = 'minute' | 'hour' | 'day' | 'week' | null;

const repeatOptions: Array<{ label: string; value: RepeatInterval }> = [
    { label: 'None', value: null },
    // { label: 'Minute', value: 'minute' },
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
];

const reminder: any = [
    { id: 1, remind: 'Take a break!', suggest: "It's been a long day, Take a break." },
    { id: 2, remind: 'Take medecine', suggest: "Don't forget your medicine. Stay healthy!" },
    { id: 3, remind: 'Write diary!', suggest: "Time to write my thoughts." },
    { id: 4, remind: 'Sleep on time', suggest: "You did very well today! Get some rest." },
    { id: 5, remind: 'Drink water', suggest: "Stay hydrated! Your body will thank you." },
    { id: 6, remind: 'Stretch your body', suggest: "A quick stretch can do wonders for your mood and body." },
    { id: 7, remind: 'Connect with a friend', suggest: "Reach out to someone you care about. A simple chat can brighten your day." },
    { id: 8, remind: 'Go for a walk', suggest: "A short walk can clear your mind and uplift your spirit." },
    { id: 9, remind: 'Celebrate small wins', suggest: "Remember to acknowledge your achievements, big or small." },
    { id: 10, remind: 'Write down your goals', suggest: "Jot down what you aim to achieve this week. It helps you stay focused." },
    { id: 11, remind: 'थोडी विश्रांती घ्या', suggest: 'आपण खूप काम करत आहात, थोडा वेळ स्वतःसाठी काढा.' },
    { id: 12, remind: 'पाणी प्या', suggest: 'हायड्रेटेड रहा! तुमचे शरीर तुम्हाला धन्यवाद देईल.' },
    { id: 13, remind: 'व्यायाम करा', suggest: 'तुमच्या शरीराची थोडी हालचाल करा. तुम्हाला ताजेतवाने वाटेल.' },
    { id: 14, remind: 'कुटुंबासोबत वेळ घालवा', suggest: 'प्रिय व्यक्तींना वेळ द्या, त्यांच्यासोबत संवाद साधा.' },
    { id: 15, remind: 'योगाभ्यास करा', suggest: 'आपला मन:शांतीसाठी योगासने करून मन शांत ठेवा.' },
    { id: 16, remind: 'पुस्तक वाचा', suggest: 'तुमच्या आवडत्या पुस्तकाचा एक नवीन पान वाचा.' },
    { id: 17, remind: 'सकाळी लवकर उठा', suggest: 'लवकर उठून नव्या दिवसाची सकारात्मक सुरुवात करा.' },
    { id: 18, remind: 'आरोग्यदायी आहार घ्या', suggest: 'पौष्टिक आहार घेऊन आपल्या शरीराची काळजी घ्या.' },
    { id: 19, remind: 'संगीत ऐका', suggest: 'तुमच्या आवडत्या संगीताने दिवस चांगला जाईल.' },
    { id: 20, remind: 'स्वतःसाठी काहीतरी करा', suggest: 'तुमच्या आवडीचा छंद जोपासा किंवा काही नवीन शिकण्याचा प्रयत्न करा.' },
]

const Reminder: FC<ReminderProps> = () => {
    const storage: MMKV = new MMKV();
    const navigation: any = useNavigation();
    const dispatch = useDispatch();


    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [reminderSuggestion, setReminderSuggestions] = useState<any[]>([]);
    const [message, setMessage] = useState<string>('');
    const [repeatInterval, setRepeatInterval] = useState<RepeatInterval>(null);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [openReminderModal, setOpenReminderModal] = useState<boolean>(false);

    const formatDateDDMMYYY = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        loadReminders(); // Load reminders on component mount
    }, []);

    useEffect(() => {
        const getRandomMessages = (messages: any[], count: number) => {
            const shuffled = [...messages].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        setReminderSuggestions(getRandomMessages(reminder, 4));
    }, []);

    useEffect(() => {
        const handleBackPress = () => {
            navigation.navigate('Dashboard');
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [message]);

    const loadReminders = () => {
        const storedRemindersString = storage.getString('reminders');
        if (storedRemindersString) {
            const storedReminders: Reminder[] = JSON.parse(storedRemindersString);
            setReminders(storedReminders);
        }
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setShowTimePicker(true);
        }
    };

    const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const scheduleNotification = (reminder: Reminder) => {
        const notificationDate = new Date(
            reminder.date.getFullYear(),
            reminder.date.getMonth(),
            reminder.date.getDate(),
            reminder.time.getHours(),
            reminder.time.getMinutes()
        );

        const notificationId = Math.floor(Math.random() * 100000); // Generate a random ID

        PushNotification.localNotificationSchedule({
            id: notificationId.toString(),  // Convert ID to string
            channelId: 'com.mycaapp',
            message: reminder.message,
            date: notificationDate,
            allowWhileIdle: true,
            repeatType: reminder.repeatInterval || undefined,
            smallIcon: 'ic_notification',
        });

        ToastAndroid.show('Reminder Scheduled', ToastAndroid.SHORT);
        return notificationId;  // Return the notification ID
    };


    const addReminder = () => {
        if (!message.trim()) {
            ToastAndroid.show("Message cannot be empty!", ToastAndroid.SHORT);
            return;
        }

        const notificationId = scheduleNotification({
            id: Date.now(),
            message,
            date,
            time,
            repeatInterval,
            isActive: true,
            notificationId: 0,  // Temporary value; this will be replaced
        });

        const newReminder: Reminder = {
            id: Date.now(),
            message,
            date,
            time,
            repeatInterval,
            isActive: true,
            notificationId,  // Save notification ID here
        };

        const updatedReminders = [...reminders, newReminder];
        setReminders(updatedReminders);

        // Store reminders in MMKV as a string
        storage.set('reminders', JSON.stringify(updatedReminders));
        setMessage('');
        setOpenReminderModal(false);
    };


    const deleteReminder = (id: number) => {
        const reminderToDelete = reminders.find((reminder) => reminder.id === id);
        if (reminderToDelete) {
            PushNotification.cancelLocalNotification(reminderToDelete.notificationId.toString());
        }

        const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
        setReminders(updatedReminders);
        storage.set('reminders', JSON.stringify(updatedReminders));

        ToastAndroid.show('Reminder Deleted', ToastAndroid.SHORT);
    };

    const handleBackPress = () => {
        navigation.navigate('Dashboard');
    };

    const handleSuggestionPress = (reminder: any) => {
        if (reminder.id) {
            setMessage(reminder.suggest)
        }
    }

    const renderReminderList = ({ item }: any) => {
        const date = item.date ? new Date(item.date) : null;
        const time = item.time ? new Date(item.time) : null;

        return (
            <>
                <View style={styles.reminderItem}>
                    <View style={styles.reminderWrapper}>
                        <Text style={styles.messageText}>{item.message}</Text>
                        <View style={styles.dateTime}>
                            <Text style={{ fontSize: 14, fontWeight: 'normal', color: 'black' }}><Text style={{ fontWeight: 'bold' }}>Date:</Text> {date ? `${formatDateDDMMYYY(date)}` : 'No Date'}</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'normal', color: 'black' }}><Text style={{ fontWeight: 'bold' }}>Time:</Text> {time ? `${time ? time.toLocaleTimeString() : ''}` : 'No Date'}</Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: 'normal', color: 'black' }}>{`Repeat: ${item.repeatInterval ? item.repeatInterval : 'None'}`}</Text>
                    </View>
                    <View style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                            <Delete height={35} width={35} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider style={{ borderColor: '#000' }} />
            </>
        );
    };

    const renderReminderSuggestion = ({ item }: any) => {
        return (
            <TouchableOpacity style={styles.reminderSuggestion} onPress={() => handleSuggestionPress(item)}>
                <Text style={{ textAlign: 'center', color: 'black', width: 75 }}>{item.remind}</Text>
            </TouchableOpacity>
        )
    }

    const handleAddNotePress = () => {
        setOpenReminderModal(true);
    }


    return (
        <View style={styles.container}>
            <Header
                title={translate('Reminder')}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                leftIcon={<Back />}
                rightIcon={<Info />}
                // onRightIconPress={handleDescriptionPress}
                onLeftIconPress={handleBackPress} // Handle back button press
            />
            <View style={styles.reminderContainer}>
                {reminders.length !== 0 ?
                    <>
                        {/* <Text style={{ textAlign: 'justify', color: 'black', fontSize: 16, fontWeight: 'bold' }}>My Reminders</Text> */}
                        <FlatList
                            data={reminders}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderReminderList}
                            style={{
                                padding: 8,
                                // marginBottom: 8
                            }}
                        />
                    </> : (
                        <View style={styles.NodataLottie}>
                            {/* <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop /> */}
                            <Text style={styles.textStyle}>
                                Click
                            </Text>
                            <AddNote height={25} width={25} />
                            <Text style={styles.textStyle}>
                                to set a reminder!
                            </Text>
                        </View>
                    )}

                <View style={{
                    position: 'absolute',
                    right: 32,
                    bottom: 32
                }}>
                    <TouchableOpacity onPress={handleAddNotePress}>
                        <AddNote height={65} width={65} />
                    </TouchableOpacity>
                </View>
            </View>

            <CustomModal visible={openReminderModal}>
                <View style={styles.modalContainer}>
                    <Text style={styles.textBold}>Select a reminder</Text>
                    <FlatList
                        data={reminderSuggestion}
                        keyExtractor={(item) => item.id}
                        renderItem={renderReminderSuggestion}
                        numColumns={4}
                        contentContainerStyle={{
                            width: Dimensions.get('window').width,
                            marginTop: 24,
                        }}
                        style={{ maxHeight: Dimensions.get('window').height * 0.16 }}
                    />
                    <Text style={styles.text}>Write you own reminder</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message"
                        value={message}
                        multiline
                        onChangeText={setMessage}
                        placeholderTextColor={'#666'}
                    />

                    <View style={styles.dateTimeWrapper}>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.selectDate}>
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>Select Date & Time</Text><DateTime />
                        </TouchableOpacity>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                            width: '100%'
                        }}>
                            <Text style={[styles.selectedDate, { marginVertical: 0, color: '#000', fontSize: 16, fontWeight: 'bold' }]}>
                                Date: <Text style={[styles.selectedDate, { marginVertical: 0, color: '#000', fontSize: 16, fontWeight: 'normal' }]}>
                                    {`${formatDateDDMMYYY(date)}`}
                                </Text>
                            </Text>

                            <Text style={[styles.selectedDate, { marginVertical: 0, color: '#000', fontSize: 16, fontWeight: 'bold' }]}>
                                Time: <Text style={[styles.selectedDate, { marginVertical: 0, color: '#000', fontSize: 16, fontWeight: 'normal' }]}>
                                    {`${time.toLocaleTimeString()}`}
                                </Text>
                            </Text>
                        </View>
                    </View>

                    {showDatePicker && (
                        <RNDateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'android' ? "default" : "spinner"}
                            themeVariant="dark"  // Optional, for dark theme
                            onChange={onDateChange}
                        />
                    )}

                    {showTimePicker && (
                        <RNDateTimePicker
                            value={time}
                            mode="time"
                            display={Platform.OS === 'android' ? "default" : "spinner"}
                            themeVariant="dark"
                            onChange={onTimeChange}
                        />
                    )}

                    <Text style={[styles.selectedDate, { textAlign: 'justify', color: 'black', fontSize: 16, fontWeight: 'bold' }]}>Repeat Interval</Text>
                    <View style={styles.repeatInterval}>
                        {repeatOptions.map((option, index) => (
                            <TouchableOpacity key={index} style={[styles.buttonStyle, { backgroundColor: repeatInterval === option.value ? colour['theme-color'] : colour['theme-backgroung-color'] }]} onPress={() => setRepeatInterval(option.value)}>
                                <Text style={{
                                    color: repeatInterval === option.value ? 'black' : 'black'
                                }}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.btnWrapper}>
                        <TouchableOpacity style={[styles.addReminder, { backgroundColor: colour['error'] }]} onPress={() => setOpenReminderModal(false)}>
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addReminder} onPress={addReminder}>
                            <Text style={styles.btnText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CustomModal>
        </View>
    );
};

export default Reminder;