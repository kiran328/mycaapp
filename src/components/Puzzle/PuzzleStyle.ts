import { StyleSheet, Dimensions } from 'react-native';
import colour from '../../common/constants/styles.json'

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: Dimensions.get('window').width
    },
    baseFontStyle: {
        color: 'black',
        fontSize: 16
    },
    puzzleQuestion: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        padding: 10,
        textAlign: 'center',
    },
    puzzleAnswer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#DFFFDC',
        borderRadius: 16,
        padding: 16,
    },
    expertAnswer: {
        // width: Dimensions.get('window').width * 0.75,
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
        fontSize: 14,
        color: 'white',
        fontWeight: '500'
    }
});

export default styles;