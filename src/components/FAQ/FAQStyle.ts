import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    questionText: {
        fontSize: 17,
        color: 'black',
        fontWeight: 'bold'
    },
    answerStyle: {
        padding: 12,
        backgroundColor: colour['theme-color'],
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        top: -4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    answerText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'normal',
        textAlign: 'justify'
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('window').width,
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
    faqImage: {
        height: Dimensions.get('window').height * 0.25,
        width: Dimensions.get('window').width * 0.75,
        borderRadius: 16,
        marginTop: 16,
    },
    faqStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colour['theme-color'],
        padding: 12,
        borderRadius: 8,
    }
})

export default styles