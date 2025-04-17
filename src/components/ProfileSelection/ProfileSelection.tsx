import React, { FC, useState } from 'react'
import { Text, View, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native'
import HealthWorkerPNG from '../../../assets/lottie/freelancer-online-communication.json'
import CaregiverPNG from '../../../assets/lottie/medical-doctor-team.json'
import ExplorerPNG from '../../../assets/lottie/winter-traveler.json'
import PatientPNG from '../../../assets/lottie/discussion-on-mental-health.json'
import LottieView from 'lottie-react-native'
import styles from './ProfileStyles'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/rootReducer'
import { setSelectedProfile } from '../../redux/actions'
import translate from '../../context/Translations'
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal'
import ComingSoon from '../../../assets/lottie/coming-soon.json'
import Close from '../../../assets/svg/close'


interface ProfileSelectionProps { }

const ProfileSelection: FC<ProfileSelectionProps> = () => {
    const dispatch = useDispatch();
    const navigation: any = useNavigation();
    const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);
    const language: any = useSelector((state: RootState) => state.app.language);


    const goToLogin = (userType: number) => {
        dispatch(setSelectedProfile(userType))
        navigation.navigate('Login');
    };

    const showModal = () => {
        // setShowComingSoonModal(true);
        ToastAndroid.show(translate("ComingSoon"), ToastAndroid.SHORT)
        // console.log('ComingSoonProfileClicked')
    }

    return (
        <View style={styles.profileSelection}>
            <View>
                <Text style={styles.headerFontStyle}>{translate('choose-profile')}</Text>
            </View>
            <View style={styles.profiles}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 16
                }}>
                    <TouchableOpacity onPress={() => goToLogin(4)} style={styles.profileContainer}>
                        <LottieView source={ExplorerPNG} style={{ width: Dimensions.get('window').width * 0.45, height: Dimensions.get('window').height * 0.25 }} autoPlay loop />
                        <Text style={styles.profileFontStyle}>{translate('explorer')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => goToLogin(6)} style={styles.profileContainer}>
                        <LottieView source={HealthWorkerPNG} style={{ width: Dimensions.get('window').width * 0.45, height: Dimensions.get('window').height * 0.25 }} autoPlay loop />
                        <Text style={styles.profileFontStyle}>{translate('chw')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.comingSoomProfiles}>

                    <TouchableOpacity onPress={showModal} style={[styles.profilesSoon]}>
                        <LottieView source={PatientPNG} style={styles.lottieStyles} autoPlay loop />
                        <Text style={[styles.profileSoonFontStyle, { fontSize: language === 'en' ? 13 : 16, }]}>{translate('patient')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showModal} style={[styles.profilesSoon]}>
                        <LottieView source={CaregiverPNG} style={styles.lottieStyles} autoPlay loop />
                        <Text style={[styles.profileSoonFontStyle, { fontSize: language === 'en' ? 13 : 16, }]}>{translate('caregiver')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={[styles.profileFontStyle, { fontSize: 18 }]}>{translate('ComingSoon')}</Text>

            <View style={styles.loginScreenInput}>
                <Text style={{
                    marginTop: 32,
                    fontSize: 16,
                    color: '#498E58',
                    fontWeight: '500',
                    textAlign: 'center'
                }}>“It’s okay to have bad days and </Text>
                <Text style={{
                    marginBottom: 32,
                    fontSize: 16,
                    color: '#498E58',
                    fontWeight: '500',
                    textAlign: 'center'
                }}>ask for support when you need it.”</Text>
            </View>

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
        </View>
    )
}

export default ProfileSelection
