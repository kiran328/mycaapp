import { Dimensions, StyleSheet } from "react-native";
import style from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    profileSelection: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        elevation: 2,
        width: Dimensions.get('screen').width,
        backgroundColor: style['theme-backgroung-color']
    },
    profiles: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        elevation: 2
    },
    profileContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        width: Dimensions.get('screen').width * 0.45,
        height: Dimensions.get('screen').height * 0.3,
    },
    profilesSoon: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        height: Dimensions.get('window').height * 0.15,
        width: Dimensions.get('window').width * 0.28,
        borderRadius: 8,
        elevation: 2,
        // gap: 16
    },
    lottieStyles: {
        width: Dimensions.get('window').width * 0.25,
        height: Dimensions.get('window').height * 0.1,
    },
    headerFontStyle: {
        fontWeight: '700',
        fontSize: 24,
        color: 'black',
        textAlign: 'center'
    },
    profileFontStyle: {
        fontWeight: '700',
        fontSize: 20,
        color: 'black',
        textAlign: 'center'
    },
    profileSoonFontStyle: {
        marginBottom: 8,
        fontWeight: '700',
        color: 'black',
        textAlign: 'center'
    },
    comingSoonLottie: {
        height: Dimensions.get('window').height * 0.32,
        width: Dimensions.get('window').width,
    },
    comingSoonModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
        width: 330
    },
    comingSoomProfiles: {
        width: Dimensions.get('window').width * 0.75,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16
    },
    loginScreenInput: {
        position: 'absolute',
        height: Dimensions.get('screen').height * 0.12,
        width: Dimensions.get('screen').width,
        backgroundColor: 'white',
        top: 0,
        elevation: 1,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    }
})

export default styles;