import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color']
    },
    reminderContainer: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
        position: 'relative',
        // marginTop: 16
    },
    input: {
        width: Dimensions.get('window').width * 0.75,
        maxHeight: Dimensions.get('window').height * 0.1,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        paddingHorizontal: 10,
        borderRadius: 16,
        color: 'black'
    },
    selectedDate: {
        marginVertical: 10,
    },
    reminderItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // padding: 10,
        borderColor: 'gray',
    },
    buttonStyle: {
        padding: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        backgroundColor: colour['theme-color'],
        alignItems: 'center'
    },
    addReminder: {
        margin: 8,
        padding: 12,
        height: 48,
        width: '40%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour['language-buttons'],
        borderRadius: 12,
        elevation: 2,

    },
    selectDate: {
        width: '75%',
        margin: 8,
        padding: 10,
        height: Dimensions.get('screen').height * 0.06,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 20,
        backgroundColor: colour['theme-color'],
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: colour['theme-color'],
        elevation: 1,
    },
    reminderSuggestion: {
        backgroundColor: 'white',
        elevation: 4,
        padding: 10,
        borderRadius: 10,
        margin: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.18,
        height: Dimensions.get('window').height * 0.08
    },
    dropdown: {
        width: '40%',
        height: 50,
        color: 'black',
        backgroundColor: 'transparent',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#666',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'black'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
    NodataLottie: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colour['theme-backgroung-color'],
        alignItems: 'center',
        gap: 8,
        marginTop: Dimensions.get('window').height * 0.02
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: 'black',
    },
    btnText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center'
    },
    btnWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '75%',
        justifyContent: 'space-between',
        marginTop: 16
    },
    repeatInterval: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 8
    },
    dateTimeWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 14
    },
    text: {
        textAlign: 'center',
        color: 'black',
        fontSize: 14,
        fontWeight: 'normal',
        marginTop: -8
    },
    textBold: {
        textAlign: 'justify',
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        height: Dimensions.get('window').height * 0.7,
        width: Dimensions.get('window').width * 0.9,
        padding: 16,
        borderColor: 'gray',
    },
    reminderWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 8
    },
    messageText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        width: Dimensions.get('window').width * 0.8
    },
    dateTime: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    }
});

export default styles;