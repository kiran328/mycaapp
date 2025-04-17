import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
        position: 'relative',
        // marginTop: 8
    },
    chapterContainer: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
    },
    chapterList: {
        paddingLeft: 6,
        paddingRight: 6,
        color: 'black',
        backgroundColor: colour['theme-backgroung-color']
    },
    chapterItem: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        margin: 6,
        gap: 8,
        padding: 8,
        borderRadius: 8,
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
        color: 'black',
        fontSize: 22,
        fontWeight: '500',
    },
    mcqButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: 50,
        width: 50,
        backgroundColor: '#C0C0C0',
        borderRadius: 100,
    },
    selectedMCQ: {
        backgroundColor: colour['theme-color'],
    },
    mcqScreen: {
        flex: 1,
        height: "100%",
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
    },
    puzzleAnswerCorrect: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'white',
        borderRadius: 16,
        padding: 8,
        margin: 16,
    },
    submitButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: colour['language-buttons'],
        padding: 10,
        borderRadius: 24,
        top: 10,
        width: 150,
        height: 50
    },
    scrollViewStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
        alignSelf: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center', // Centers the modal vertically
        alignItems: 'center', // Centers the modal horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    contentContainer: {
        // backgroundColor: 'white', // Background of the content
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '90%', // Width of the modal content
    },
    image: {
        height: Dimensions.get('window').height * 0.4, // Adjust the size as needed
        width: '100%',
        marginBottom: 16,
        borderRadius: 8,
    },
    text: {
        color: 'white',
        fontSize: 32,
        textAlign: 'center', // Center the text
        marginBottom: 16,
    },
    tagLineStyle: {
        color: 'gray',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left',
        left: 8,
        width: Dimensions.get('screen').width * 0.8
    },
    buttonStyle: { margin: 8, padding: 8, borderWidth: 1.5, borderColor: 'hotpink', borderRadius: 8, maxWidth: 100, width: 90, alignItems: 'center' },
    buttonText: {
        color: 'black', fontSize: 16, fontWeight: 'bold'
    },
    legendView: {
        width: '50%', // Ensures two items per row
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, // Adds spacing between rows
    },
    legendWrapper: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap', // Enables wrapping of items
        marginTop: 10,
    },
    X_AxisLabel: {
        // marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray'
    },
    Y_AxisLabel: {
        position: 'absolute',
        transform: [{ rotate: '-90deg' }],
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray'
    },
    resultContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        height: Dimensions.get('window').height * 0.75,
        width: Dimensions.get('window').width * 0.9,
        padding: 20,
        borderColor: 'gray',
    },
    disclaimerDescription: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'normal',
        textAlign: 'center'
    },
    disclaimerTitle: {
        color: 'gray',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8
    },
    disclaimerContainer: {
        padding: 12,
        borderColor: 'black',
        borderRadius: 16,
    },
    resultButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 4
    },
    taglineDesc: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    thumbnail: {
        height: Dimensions.get('window').height * 0.2,
        width: Dimensions.get('window').width * 0.9,
        borderRadius: 5
    },
    title: {
        color: 'black',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'left',
        left: 8
    },
    tileContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
        paddingBottom: 16,
        paddingRight: 16,
        paddingTop: 4,
        paddingLeft: 4
    },
    questionTabs: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 8,
        marginHorizontal: 10
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'auto'
    }
});

export default styles;