import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'


const styles = StyleSheet.create({
    profileContainer: {
        alignItems: 'center',
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width,
    },
    comingSoonLottie: {
        height: Dimensions.get('window').height * 0.32,
        width: Dimensions.get('window').width,
    },
    container: {
        width: Dimensions.get('window').width,
        flex: 1,
        marginTop: -48,
        // padding: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CourseContainer: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 8,
        // padding: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 8,
        elevation: 2,
        gap: 8,
        height: Dimensions.get('window').height / 8,
        width: Dimensions.get('window').width / 8,
    },
    flatListContainer: {
        width: Dimensions.get('window').width,
        flexGrow: 1,
        justifyContent: 'center',
        padding: 8
    },
    courseImage: {
        height: Dimensions.get('window').height * 0.055,
        width: Dimensions.get('window').width * 0.12,
        marginBottom: 10,
        marginLeft: 8
    },
    courseNameEnglish: {
        width: Dimensions.get('window').width * 0.26,
        fontSize: 17,
        fontWeight: '500',
        color: 'black',
        textAlign: 'auto'
    },
    courseNameMarathi: {
        width: Dimensions.get('window').width * 0.2,
        fontSize: 17,
        fontWeight: '500',
        color: 'black',
        textAlign: 'auto'
    },
    ActivityName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    textStyle: {
        // top: -15,
        fontWeight: '700',
        color: 'black'
    },
    comingSoonModal: {
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 16,
        // margin: 16,
        height: Dimensions.get('window').height * 0.33,
        width: Dimensions.get('window').width * 0.75,
    }
});

export default styles;