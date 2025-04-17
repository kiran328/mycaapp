import { Dimensions, StyleSheet } from "react-native";
import colours from '../../common/constants/styles.json'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        margin: 10,
    },
    upperContainer: {
        backgroundColor: colours['theme-backgroung-color'],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterList: {
        width: '100%',
        color: 'black',
    },
    chapterItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: 1,
        margin: 0,
        width: '100%'
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colours['theme-backgroung-color'],
        alignItems: 'center',
    },
    thumbnail: {
        height: Dimensions.get('window').height / 12,
        width: Dimensions.get('window').width / 6,
        padding: 4,
        margin: 4
    },
    thumbnail2: {
        height: Dimensions.get('window').height / 10.5,
        width: Dimensions.get('window').width / 4.9,
        padding: 0,
        margin: 0
    },
    NodataLottie: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: colours['theme-backgroung-color'],
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.25
    },
    lottieStyles: {
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('window').width,
    },
    itemContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 0,
        paddingTop: 0,
        marginBottom: 8,
    },
    itemContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16
    },
    ellipsisButton: {
        right: 0,
        marginRight: 16,
    },
    itemText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '500',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalStyle: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 17,
        borderTopRightRadius: 17,
        height: Dimensions.get('window').height,
    },
    activeChapterItem: {
        backgroundColor: colours['theme-color'],
    },
});

export default styles;