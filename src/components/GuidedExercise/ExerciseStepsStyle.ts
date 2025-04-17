import { StyleSheet, Dimensions } from 'react-native';
import colour from '../../common/constants/styles.json'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // left: width / 4,
        // top: height * 0.01
    },
    imageView: {
        // top: 16,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover',
        borderRadius: 4,
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
});

export default styles;