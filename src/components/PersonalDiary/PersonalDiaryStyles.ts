import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
        position: 'relative',
        marginTop: 16
    },
    chapterContainer: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
    },
    chapterList: {
        paddingLeft: 6,
        paddingRight: 6,
        color: 'black',
        backgroundColor: colour['theme-backgroung-color']
    },
    chapterItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        // gap: 26,
        margin: 6,
        padding: 8,
        borderRadius: 32,
        backgroundColor: 'white',
        elevation: 1
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colour['theme-backgroung-color'],
        alignItems: 'center',
    },
    NodataLottie: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colour['theme-backgroung-color'],
        alignItems: 'center',
        gap: 8,
        marginTop: Dimensions.get('window').height * 0.02
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('window').width,
    },
    heading: {
        color: 'black',
        fontSize: 22,
        fontWeight: '500',
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        // height: Dimensions.get('window').height * 0.33,
        // width: Dimensions.get('window').width * 0.75,
    },
    notes: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'normal',
    },
    expertAnswer: {
        width: Dimensions.get('window').width * 0.5,
        margin: 8,
        padding: 12,
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 20,
        backgroundColor: colour['language-buttons'],
        borderRadius: 12,
        elevation: 2
    },
    VideoStyle: {
        // backgroundColor: 'white',
        padding: 12,
        borderRadius: 16,
        // elevation: 1,
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('window').width,
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    },
    buttonstyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popover: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    popOverText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'normal',
    },
    popoverItem: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: 'black',
    }
})

export default styles;