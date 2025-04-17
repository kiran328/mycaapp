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
    baseFontStyle: {
        color: 'black'
    },
    chapterList: {
        // padding: 10,
        color: 'black',
        backgroundColor: colour['theme-backgroung-color']
    },
    chapterItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: 26,
        margin: 10,
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
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colour['theme-backgroung-color'],
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.02
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.25,
        width: Dimensions.get('window').width
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default styles;