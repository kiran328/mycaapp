import { StyleSheet, Dimensions } from 'react-native';
import colour from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour['theme-backgroung-color'],
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'flex-start',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        // marginBottom: 8
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.27,
        width: Dimensions.get('window').width,
    },
    themeContainer: {
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 16
    },
    CourseContainer: {
        flex: 1,
        margin: 6,
        padding: 8,
        borderRadius: 8,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        maxHeight: Dimensions.get('window').height * 0.3,
    },
    courseName: {
        fontSize: 16.5,
        fontWeight: '500',
        color: 'black',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    courseImage: {
        width: Dimensions.get('window').width / 3.5,
        height: Dimensions.get('window').height / 8,
        borderRadius: 8
    },
    courseImageContainer: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').height / 8,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseNameContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    flatListContainer: {
        width: Dimensions.get('screen').width * 0.95,
        flexGrow: 1,
        justifyContent: 'center',
        // margin: 8,
    },
    searchInput: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 12,
        // marginVertical: 10,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: colour['theme-color'],
        width: '90%',
        color: 'black',
        alignSelf: 'center',
    },
});

export default styles;