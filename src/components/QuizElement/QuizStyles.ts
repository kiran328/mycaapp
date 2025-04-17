import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    baseFontStyle: {
        color: 'black',
        fontSize: 32,
        fontWeight: "700"
    },
    OptionbaseFontStyle: {
        color: 'black',
        fontSize: 16
    },
    ExplainationbaseFontStyle: {
        color: 'black',
        fontSize: 16
    },
    mcqButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        // padding: 10,
        height: 50,
        width: 50,
        backgroundColor: 'gray',
        borderRadius: 100,
    },
    selectedMCQ: {
        backgroundColor: colour['theme-color'],
        borderColor: 'gray',
        borderWidth: 0.5
    },
    OptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%',
        padding: 8,
        marginBottom: 8,
        borderWidth: 0.5,
        borderColor: '#A9A9A9',
        borderRadius: 8,
    },
    selectedOption: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%',
        borderColor: '#AA6C39',
        padding: 8,
        marginBottom: 8,
        backgroundColor: 'gold',
        borderWidth: 1,
        borderRadius: 8,
        color: 'white'
    },
    correctOption: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%',
        borderColor: 'green',
        padding: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'lightgreen',
        color: 'white'
    },
    incorrectOption: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%',
        borderColor: 'red',
        padding: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#FF474C',
        color: 'white'
    },
    selectedAnswer: {
        color: 'white'
    },
    puzzleAnswerCorrect: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 8,
        margin: 16,
        height: Dimensions.get('window').height * 0.5
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
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
        alignSelf: 'center'
    },
    mcqScreen: {
        flex: 1,
        height: "100%",
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
    }
})

export default styles;