import { StyleSheet, Dimensions } from 'react-native';
import colour from '../../../common/constants/styles.json'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color']
    },
    wrapper: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32
    },
    imageView: {
        // top: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width,
        aspectRatio: 1
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colour['theme-backgroung-color'],
        alignItems: 'center',
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('window').width,
    },
    modalContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        height: Dimensions.get('window').height * 0.55,
        width: Dimensions.get('window').width * 0.75,
    },
    expertAnswer: {
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
    text: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500'
    },
    descriptionText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'normal'
    },
    congratsText: {
        color: 'black',
        fontWeight: '500',
        fontSize: 26,
        top: -20
    },
    currentStep: {
        color: 'black',
        fontWeight: '500',
        fontSize: 20,
        textAlign: 'center'
    },
    timerText: {
        color: 'black',
        fontSize: 24,
        marginTop: 20,
        fontWeight: '500'
    },
    timerView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        // marginTop: 16
    },
    activeStep: {
        width: 12,
        height: 12,
        borderRadius: 100,
    },
    activeStepView: {
        width: '75%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    progressBarWrapper: {
        position: 'absolute',
        top: 0,
        gap: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default styles;