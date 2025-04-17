import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    calenderStyles: {
        // height: Dimensions.get('window').height / 1.9,
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        elevation: 2,
        marginTop: 0
    },
    scrollViewContent: {
        width: Dimensions.get('window').width,
        flexGrow: 1,
        marginTop: 16,
        bottom: 16,
        padding: 24,
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    lottieContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    moodStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
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
        color: 'white',
        fontWeight: '500'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: '100%'
    },
    month: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue',
    },
    arrows: {
        flexDirection: 'row',
    },
    arrow: {
        marginHorizontal: 10,
        color: 'orange',
    },
    moodMarkerStyles: {
        position: 'absolute', 
        width: 22, 
        height: 22, 
        top: -13, 
        right: -8, 
        zIndex: 4
    }

})

export default styles;