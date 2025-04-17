import React, { FC, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import styles from './InitialScreenStyles';
import colours from '../../common/constants/styles.json'
import LoginImage from '../../../assets/images/WelcomeScreen.png'
import MYCA from '../../../assets/svg/settingsicons/myca-welcome.svg'
import { MMKV } from 'react-native-mmkv';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/actions';
import { Divider } from '@rneui/themed';


interface LoginProps { }

const WelcomeScreen: FC<LoginProps> = () => {
    const navigation: any = useNavigation();
    const storage = new MMKV;
    const dispatch = useDispatch();

    const selectLanguage = async (language: string) => {
        storage.set('language', language);
        dispatch(setLanguage(language));
        navigation.navigate('ProfileSelection');
    };

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <ScrollView contentContainerStyle={styles.container} horizontal={false}>
                <Text style={{
                    marginTop: 72,
                    fontSize: 24,
                    color: 'gray',
                    fontWeight: '300'
                }}>Parivartan and VOPA presents</Text>

                <View style={styles.loginImage}>
                    <MYCA />
                </View>
                <View style={styles.divider} />
                <Text style={{ fontSize: 18, color: 'black', marginBottom: 20, fontWeight: '500', lineHeight: 50 }}>
                    My Mental Health Companion
                </Text>



                <View style={styles.loginScreenInput}>
                    <Text style={{
                        fontSize: 24,
                        color: 'black',
                        fontWeight: '500',
                        textAlign: 'center'
                    }}>
                        Select a Language
                    </Text>
                    <View style={styles.languageButtons}>
                        <TouchableOpacity style={styles.verifyOTPButton} onPress={() => selectLanguage("en")}>
                            <Text style={{
                                fontSize: 20,
                                color: 'white',
                                fontWeight: '500'
                            }}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.verifyOTPButton} onPress={() => selectLanguage("mr")}>
                            <Text style={{
                                fontSize: 20,
                                color: 'white',
                                fontWeight: '500'
                            }}>मराठी</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default WelcomeScreen;
