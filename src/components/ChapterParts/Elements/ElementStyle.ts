import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    HTMLText: {
        backgroundColor: 'white',
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 6,
        elevation: 1,
        width: '100%',
        color: 'black',
        padding: 4
    },
    Quiz: {
        backgroundColor: 'white',
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginTop: 16,
        elevation: 1,
        width: '100%',
        color: 'black'
    },
    baseFontStyle: {
        color: 'black',
        fontSize: 16,
        padding: 4,
        textAlign: 'justify'
    },
    imageStyle: {
        backgroundColor: 'white',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        elevation: 1,
        width: '100%'
    },
    GifStyle: {
        backgroundColor: 'white',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        elevation: 1,
        width: '100%'
    },
    lottieStyle: {
        backgroundColor: 'white',
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        elevation: 1,
        width: '100%'
    },
    PDFStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 6,
        elevation: 1,
        width: '100%'
    },
    GFormStyle: {
        backgroundColor: 'white',
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        elevation: 1,
        width: '100%'
    },
    AudioStyle: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        paddingTop: 8,
        paddingBottom: -16,
        borderRadius: 6,
        elevation: 1,
        width: '100%'
    },
    VideoStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        elevation: 1,
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
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 6,
        elevation: 1,
        width: '100%'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    },

});

export default styles;