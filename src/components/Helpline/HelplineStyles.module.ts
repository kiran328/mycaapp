import { Dimensions, StyleSheet } from "react-native";
import colour from '../../common/constants/styles.json'


const styles = StyleSheet.create({
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colour['theme-backgroung-color'],
        alignItems: 'center',
    },
    modalContent: {
        // backgroundColor: 'white',
        borderRadius: 10,
        gap: 16,
        // padding: 20,
        width: '100%', // Control width of the modal content
        alignItems: 'center', // Center the content inside the modal
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width,
    },
    container: {
        width: Dimensions.get('window').width,
        padding: 16,
        margin: 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    contactStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        padding: 6,
        borderRadius: 16,
        margin: 2,
        fontSize: 16,
        elevation: 4
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // height: Dimensions.get('window').height * 0.33,
        // width: Dimensions.get('window').width * 0.75,
    },
    itemText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    },
    itemNumber: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'normal',
        textAlign: 'center'
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        // marginVertical: 10,
        borderRadius: 10,
        width: Dimensions.get('window').width * 0.6,
        alignItems: 'center',
    },
    descriptionText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
        textAlign: 'center'
    },
})

export default styles;