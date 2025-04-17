import { Dimensions, StyleSheet, PixelRatio } from "react-native";
import colour from '../../common/constants/styles.json'


// const textSize = PixelRatio.get() * 6;

const styles = StyleSheet.create({
    upperContainer: {
        // flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: colour['theme-backgroung-color'],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dashboardFeatures: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 16,
        gap: 42,
        zIndex: 4
    },
    comingSoonLottie: {
        height: Dimensions.get('window').height * 0.25,
        width: Dimensions.get('window').width,
    },
    chatBotLottie: {
        height: Dimensions.get('window').height * 0.23,
        width: Dimensions.get('window').width * 0.5,
        // backgroundColor: 'black'
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.25,
        width: Dimensions.get('window').width * 0.5,
        marginBottom: 16
    },
    dashboardElement1: {
        position: 'relative',
        height: Dimensions.get('window').height / 16,
        width: Dimensions.get('window').width / 7,
        color: 'white',
        backgroundColor: 'white',
        elevation: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    ActivityNameArrow: {
        width: '85%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
        margin: 14,
    },
    TodaysActvityName: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'flex-start',
    },
    todaysActivityExpanded: {
        height: Dimensions.get('window').height / 16,
        width: '100%',
        backgroundColor: colour['theme-color'],
        elevation: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        gap: 32,
    },
    todaysActivityCollapsed: {
        height: Dimensions.get('window').height / 15,
        width: '100%',
        backgroundColor: colour['theme-color'],
        elevation: 1,
        borderRadius: 8,
        gap: 32,
    },
    dropdownContentExpanded: {
        top: -Dimensions.get('window').height / 150,
        paddingTop: 8,
        paddingBottom: 8,
        width: Dimensions.get('window').width * 0.93,
        elevation: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: colour['theme-color']
    },
    dropdownContentCollapsed: {
        top: 0,
    },
    todaysActivityImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.2,
    },
    container: {
        width: Dimensions.get('window').width,
        flex: 1,
        // padding: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CourseContainer: {
        position: 'relative',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 8,
        // padding: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 8,
        elevation: 2,
        gap: 10,
        height: Dimensions.get('window').height / 8,
        width: Dimensions.get('window').width / 8,
    },
    flatListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 8,
        width: Dimensions.get('window').width
    },
    courseImage: {
        height: Dimensions.get('window').height / 16,
        width: Dimensions.get('window').width / 8,
        marginLeft: 4,
        marginBottom: 10,
    },
    courseNameEnglish: {
        width: Dimensions.get('window').width * 0.23,
        fontSize: 16,
        fontWeight: '500',
        color: 'black'
    },
    courseNameMarathi: {
        width: Dimensions.get('window').width * 0.2,
        fontSize: 16,
        fontWeight: '500',
        color: 'black'
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
    chatBotModal: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    comingSoonModal: {
        // flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.25,
        width: Dimensions.get('window').width * 0.75,
    },
    updateAppModal: {
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 16,
        // margin: 16,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width * 0.7
    },
    imageView: {
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover',
        borderRadius: 4,
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
        gap: 8,
        backgroundColor: colour['language-buttons'],
        borderRadius: 12,
        elevation: 2
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderRadius: 10,
        gap: 16,
        width: '100%',
        alignItems: 'center',
    },
    videoContainer: {
        height: Dimensions.get('window').height * 0.3, // Video container takes up available space
    },
    categoryContainer: {
        display: 'flex',
        flexDirection: 'row',
        // gap: 4,
        height: Dimensions.get('screen').height * 0.08,
        width: Dimensions.get('screen').width * 0.29,
        marginBottom: 10,
        alignItems: 'center',
        margin: 8,
        borderRadius: 10,
        alignSelf: 'center',
        position: 'relative'
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryImage: {
        height: Dimensions.get('screen').height * 0.1,
        width: Dimensions.get('screen').width * 0.1,
        borderRadius: 80
    },
    coinsView: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'gray',
        backgroundColor: '#fff6db',
        padding: 8,
        borderRadius: 16,
        marginTop: -16
    }
});

export default styles;