import { StyleSheet } from "react-native";
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
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CourseContainer: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        padding: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 22,
        elevation: 2,
        gap: 10,
        height: 100
    },
    courseImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
        borderRadius: 22,
        marginLeft: 16
    },
    courseName: {
        width: 95,
        fontSize: 16,
        fontWeight: '500',
        color: 'black'
    },
    flatListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    CoursesTab: {
        backgroundColor: 'hotpink',
        margin: 16,
        borderRadius: 16
    }
})

export default styles;