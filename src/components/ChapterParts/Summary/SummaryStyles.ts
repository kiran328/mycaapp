import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height / 1.5,
        gap: 16
    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFBCD9',
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 6,
        borderColor: 'red',
        borderWidth: 0.5,
        elevation: 1.5,
        minWidth: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.15,
        color: 'black'
    },
    textStyle: {
        color: 'black',
        fontSize: 20
    }
});

export default styles;