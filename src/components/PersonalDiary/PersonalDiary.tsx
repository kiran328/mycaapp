import React, { FC, useEffect, useState } from 'react';
import { View, TextInput, Button, ScrollView, TouchableOpacity, Text, ToastAndroid, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import colours from '../../common/constants/styles.json';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import styles from './PersonalDiaryStyles';
import { setNoteDetails } from '../../redux/actions';
import { addPersonalNote, updatePersonalNote } from '../../common/apis/api';
import { useQueryClient } from 'react-query';

interface PersonalDiaryProps { }

const PersonalDiary: FC<PersonalDiaryProps> = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const noteDetails: any = useSelector((state: RootState) => state.app.noteDetails);

    const saveChanges = async () => {
        try {

            const response = await addPersonalNote(noteDetails?.title, noteDetails?.content);

            if (response && response.data) {
                console.log("Saved");
                navigation.navigate("DiaryList");
            } else {
                ToastAndroid.show("Something went wrong! Try again.", ToastAndroid.SHORT);
            }

        } catch (err) {
            console.log("Error in saving the note!", err);
        }
    };

    const updateNote = async () => {
        try {
            const response = await updatePersonalNote(noteDetails?.id, noteDetails?.title, noteDetails?.content);
            if (response && response.data) {
                console.log("Saved");
                navigation.navigate("DiaryList");
            } else {
                ToastAndroid.show("Something went wrong! Try again.", ToastAndroid.SHORT);
            }

        } catch (err) {
            console.log("Error in saving the note!", err);
        }
    };

    useEffect(() => {
        const handleBackPress = () => {
            navigation.navigate("DiaryList");
            queryClient.invalidateQueries("personalDiary");
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [dispatch]);

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <View style={{
                flex: 1,
                padding: 10
            }}>
                <TextInput
                    style={styles.heading}
                    value={noteDetails?.title}
                    onChangeText={text => dispatch(setNoteDetails({ ...noteDetails, title: text }))}
                    placeholder="Enter title"
                    placeholderTextColor={'gray'}
                />
                <ScrollView>
                    <TextInput
                        style={styles.notes}
                        value={noteDetails?.content}
                        onChangeText={text => dispatch(setNoteDetails({ ...noteDetails, content: text }))}
                        placeholder="Enter notes"
                        placeholderTextColor={'gray'}
                        multiline={true}
                    />
                </ScrollView>
                <View style={styles.buttonstyle}>
                    <TouchableOpacity
                        style={[
                            styles.expertAnswer,
                            noteDetails?.content === '' && noteDetails?.title === '' && { backgroundColor: 'gray' }
                        ]}
                        activeOpacity={0.6}
                        onPress={noteDetails?.id === null ? saveChanges : updateNote}
                        disabled={!!(noteDetails?.content === '' && noteDetails?.title === '')}
                    >
                        <Text style={styles.text}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default PersonalDiary;
