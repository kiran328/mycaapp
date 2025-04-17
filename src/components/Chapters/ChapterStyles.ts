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
        marginTop: 8,
        width: Dimensions.get('screen').width,
        paddingHorizontal: 6,
        color: 'black',
        backgroundColor: colour['theme-backgroung-color']
    },
    chapterItem: {
        flex: 1,
        width: Dimensions.get('screen').width * 0.95,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 26,
        margin: 6,
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
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('window').width,
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default styles;