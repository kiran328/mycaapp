import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color']
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
        justifyContent: 'flex-start',
        flexDirection: 'row',
        // gap: 26,
        margin: 10,
        borderRadius: 42,
        backgroundColor: 'white',
        elevation: 1
    },
    listStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        fontSize: 18,
        padding: 20,
        height: Dimensions.get('window').height * 0.09,
        fontWeight: '500'
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
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colour['theme-backgroung-color'],
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.02
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('window').width,
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    expertAnswer: {
        margin: 10,
        padding: 12,
        height: 48,
        width: 110,
        maxWidth: 120,
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
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    },
    thumbnail: {
        height: Dimensions.get('window').height / 8,
        width: Dimensions.get('window').width / 4.5,
        padding: 4,
        marginLeft: 16,
        borderRadius: 22
    },
});

export default styles;