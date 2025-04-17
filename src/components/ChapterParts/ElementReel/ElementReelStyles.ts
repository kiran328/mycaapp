import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    HTMLText: {
        // backgroundColor: 'white',
        padding: 12,
        borderRadius: 16,
        // elevation: 1,
        width: '100%',
        color: 'black'
    },
    imageView: {
        // width: deviceWidth - 40,
        // height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover',
        borderRadius: 4,
    },
    imageStyle: {
        flex: 1,
        // margin: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    GifStyle: {
        flex: 1,
        // margin: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    lottieStyle: {
        flex: 1,
        // margin: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    PDFStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 32,
        borderRadius: 16,
        elevation: 1,
        width: '100%'
    },
    GFormStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    AudioStyle: {
        flex: 1,
        margin: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    VideoStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        // elevation: 1,
        width: Dimensions.get('window').width * 0.96,
    },
    videoContainer: {
        height: Dimensions.get('window').height * 0.3, // Video container takes up available space
    },
    webView: {
        flex: 1,
        borderRadius: 16,
    },
    textContainer: {
        padding: 8,
        textAlign: 'justify',
        // No need for flex here; ScrollView will expand as needed
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'normal',
        textAlign: 'justify',
    },
    PPTStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        // backgroundColor: 'white',
        // marginTop: 200,
        borderRadius: 16,
        // elevation: 1,
        width: '100%',
        height: '100%'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    fontSizeButtons: {
        position: 'absolute',
        bottom: 120,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    reelNavigationButtons: {
        display: 'flex',
        flexDirection: 'row',
        gap: 50,
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: 0.6,
        zIndex: 1,
    },
});

export default styles;