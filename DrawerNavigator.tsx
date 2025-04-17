import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { Button, Dimensions, Linking, Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { MMKV } from "react-native-mmkv";
import { useDispatch, useSelector } from "react-redux";
import LogOutDialog from "./src/common/StyledComponents/LogOutDialog/LogOutDialog";
import { setEditName, setIsAuthenticated, setLanguage, setUserInfo } from "./src/redux/actions";
import translate from "./src/context/Translations";
import Language from './assets/svg/settingsicons/language.svg'
import RateUs from './assets/svg/settingsicons/rate.svg'
import Feedback from './assets/svg/settingsicons/feedback.svg'
import Logout from './assets/svg/settingsicons/logout.svg'
import TnC from './assets/svg/settingsicons/gdpr-policy 1.svg'
import MYCA from './assets/svg/settingsicons/myca-drawer-logo.svg'
import Edit from './assets/svg/settingsicons/edit.svg'
import { RootState } from "./src/redux/rootReducer";
import EditName from "./src/common/StyledComponents/EditNameModal/EditNameModal";
import { getFeedback, getTermsConditions, updateUserInfo } from "./src/common/apis/api";
import { useQuery, useQueryClient } from "react-query";
import appDetails from './app.json'
import InAppBrowser from "react-native-inappbrowser-reborn";
import colours from './src/common/constants/styles.json'
import Pdf from "react-native-pdf";
import CloseReel from "./assets/svg/closeReel";
import DeviceInfo from "react-native-device-info";

const DrawerNavigator = (props: any) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const storage = new MMKV;
    const language = storage.getString('language');
    const userInfo: any = storage.getString('userInfo');
    const parsedUserInfo = JSON.parse(userInfo);
    const navigation: any = useNavigation();
    const versionCode = DeviceInfo.getVersion();

    const [showLogoutDialog, setShowLogOutDialog] = useState<boolean>(false);
    const [feedBack, setFeedBack] = useState<any>({});
    const [showPDF, setShowPDF] = useState<boolean>(false);
    const [terms, setTerms] = useState<string>('')
    const editName: any = useSelector((state: RootState) => state.app.editName);
    const user: any = useSelector((state: RootState) => state.app.userInfo);

    useQuery({
        queryKey: ["feedback"],
        queryFn: getFeedback,
        onSuccess(response) {
            if (response.data) {
                setFeedBack(response.data.response);
            }
        }
    });

    const handleLanguageSelection = (selectedLanguage: string) => {
        storage.set('language', selectedLanguage);
        dispatch(setLanguage(selectedLanguage));
        navigation.dispatch(DrawerActions.closeDrawer());
    };

    const handleRateUs = async () => {
        // try {
        //     if (await InAppBrowser.isAvailable()) {
        //         await InAppBrowser.open('market://details?id=com.mycaapp', {
        //             toolbarColor: colours['theme-color'],
        //             enableDefaultShare: false,
        //         });
        //     }
        // } catch (err) {
        //     ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
        // }
        try {
            Linking.openURL('market://details?id=com.mycaapp');
        } catch (err) {
            console.log("Error opening link", err);
        }
    };

    const handleTnC = async () => {
        try {
            const response = await getTermsConditions();
            if (response && response.data) {
                setShowPDF(true);
                setTerms(response.data.response);
            }
        } catch (err) {
            console.log("Error opening Agreement PDF", err)
        }
    };

    const handleFeedBack = async () => {
        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(feedBack.feedback_link, {
                    toolbarColor: colours['theme-color'],
                    enableDefaultShare: false,
                });
            }
        } catch (err) {
            ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
        }
    };

    const handleLogout = () => {
        setShowLogOutDialog(true);
        navigation.dispatch(DrawerActions.closeDrawer());
    };

    const cancelLogout = () => {
        setShowLogOutDialog(false);
    };

    const confirmLogout = () => {
        storage.clearAll();
        dispatch(setIsAuthenticated(false));
        navigation.navigate('ProfileSelection');
    };

    const renderChangeLanguage = () => (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 32
        }}>
            <Language />
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
                {translate('ChangeLanguage')}{' '}
                <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 16 }}>
                    {language === 'en' ? translate('मराठी') : 'English'}
                </Text>
            </Text>
        </View>
    );

    const rateUs = () => (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 32
        }}>
            <RateUs />
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
                {translate('RateUs')}
            </Text>
        </View>
    )

    const feedback = () => (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 32
        }}>
            <Feedback />
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
                {translate('Feedback')}
            </Text>
        </View>
    )

    const TnCs = () => (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 32
        }}>
            <TnC />
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
                {translate('TnC')}
            </Text>
        </View>
    )

    const logout = () => (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 32
        }}>
            <Logout />
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
                {translate('Logout')}
            </Text>
        </View>
    )

    const handleSaveName = async () => {
        try {
            const response = await updateUserInfo(user.name, user.email, user.gender, user.sub_category);
            if (response && response.data) {
                queryClient.invalidateQueries("userInfo");
                dispatch(setUserInfo({ ...user, isEditing: false }));
                dispatch(setEditName({ ...editName, isEditing: false }));
            }
        } catch (err) {
            console.log("Error in saving user name", err);
        }
    }

    const handleCancelEditName = () => {
        dispatch(setEditName({ ...editName, isEditing: false }))
        dispatch(setUserInfo(user));
    }

    const ProfileInfo: any = () => {
        const handleEdit = () => {
            dispatch(setUserInfo({ ...user, isEditing: true }))
            dispatch(setEditName({ ...editName, isEditing: true }))
            navigation.dispatch(DrawerActions.closeDrawer());
        };

        return (
            <View style={styles.container}>
                <MYCA />
                <TouchableOpacity onPress={handleEdit} style={styles.textContainer}>
                    <Text style={styles.name}>{user.name === '' ? 'Enter name' : user.name}</Text>
                    <Edit />
                </TouchableOpacity>
                <Text style={styles.mobile}>{parsedUserInfo.mobile}</Text>
            </View>
        );
    };


    return (
        <View style={{ flex: 1, marginTop: 16 }}>
            <ProfileInfo />
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: 'gray', marginBottom: 8 }}>v{versionCode}</Text>
            </View>
            <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
                <DrawerItemList {...props} />
                <DrawerItem label={renderChangeLanguage} onPress={() => {
                    if (language == 'mr') {
                        handleLanguageSelection('en');
                    } else if (language === 'en') {
                        handleLanguageSelection('mr');
                    }
                }} />
                <DrawerItem labelStyle={{ color: 'black', fontSize: 16, fontWeight: 'bold' }} label={feedback} onPress={handleFeedBack} />
                <DrawerItem labelStyle={{ color: 'black', fontSize: 16, fontWeight: 'bold' }} label={rateUs} onPress={handleRateUs} />
                <DrawerItem labelStyle={{ color: 'black', fontSize: 16, fontWeight: 'bold' }} label={TnCs} onPress={handleTnC} />
                <DrawerItem labelStyle={{ color: 'black', fontSize: 16, fontWeight: 'bold' }} label={logout} onPress={handleLogout} />
            </DrawerContentScrollView>

            <LogOutDialog
                visible={showLogoutDialog}
                onCancel={cancelLogout}
                onConfirm={confirmLogout}
            />

            <EditName
                visible={editName.isEditing}
                onCancel={handleCancelEditName}
                onConfirm={handleSaveName}
            />

            <Modal visible={showPDF} style={{ position: 'relative' }}>
                <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, zIndex: 5 }} onPress={() => setShowPDF(false)}>
                    <CloseReel />
                </TouchableOpacity>
                <Pdf
                    trustAllCerts={false}
                    source={{ uri: terms, cache: true }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log('PDF Error:', error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={{ flex: 1, height: Dimensions.get('window').height }}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
    },
    name: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 24,
    },
    mobile: {
        fontWeight: 'normal',
        color: 'black',
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: 24,
        width: '100%',
        marginBottom: 20,
        padding: 5,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});


export default DrawerNavigator;