import { Dimensions, StyleSheet } from "react-native";
import colour from '../../../common/constants/styles.json'

const styles = StyleSheet.create({
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    lottieStyles: {
        height: 180,
        width: 180
    },
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color']
    },
    mediaContainer: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    VideoStyle: {
        padding: 1,
        borderRadius: 16,
        height: Dimensions.get('window').height * 0.35,
        width: Dimensions.get('window').width * 0.95,
    },
    imageStyle: {
        flex: 1,
        // margin: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    imageView: {
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover',
        borderRadius: 4,
    },
    description: {
        width: Dimensions.get('window').width * 0.9,
        color: 'black',
        height: Dimensions.get('window').height * 0.2, // Fixed height for description view
        overflow: 'hidden',
    },
    descriptionText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 18
    },
    title: {
        // backgroundColor: 'white',
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 6,
        // elevation: 1,
        width: '100%',
        color: 'black',
        padding: 4
    },
    titleText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700'
    }

});

export default styles