import { Dimensions, StyleSheet } from 'react-native';
import colours from '../../common/constants/styles.json'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours['theme-backgroung-color'],
    },
    messagesList: {
        height: '100%',
        flex: 1,
        // padding: 16,
        paddingBottom: 32
    },
    conversationStarters: {
        flex: 1,
        // padding: 8
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        marginVertical: 4,
    },
    userMessage: {
        marginRight: 0,
        backgroundColor: colours['theme-color'],
        alignSelf: 'flex-end',
        borderTopLeftRadius: 24,
        borderBottomEndRadius: 24,
        borderBottomLeftRadius: 24,
    },
    botMessage: {
        marginLeft: 0,
        backgroundColor: '#6495ED',
        alignSelf: 'flex-start',
        borderTopEndRadius: 24,
        borderBottomEndRadius: 24,
        borderBottomLeftRadius: 24,
    },
    userText: {
        fontSize: 15,
        color: '#000000',
    },
    botText: {
        fontSize: 15,
        color: '#fff',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
        marginLeft: 0,
    },
    loadingText: {
        color: '#666',
        fontStyle: 'italic',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 8,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    input: {
        width: Dimensions.get('window').width * 0.75,
        maxHeight: Dimensions.get('window').height * 0.1,
        backgroundColor: '#F2F2F7',
        // borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        color: 'black'
    },
    sendButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colours['theme-color'],
        borderRadius: 200,
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#A5A5A5',
    },
    sendButtonText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'normal',
        textAlign: 'center'
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderRadius: 10,
        gap: 16,
        width: '100%',
        alignItems: 'center',
    },
    heading: {
        backgroundColor: colours['theme-backgroung-color'],
        borderRadius: 8,
        color: '#666',
        width: Dimensions.get('window').width * 0.7,
        maxHeight: Dimensions.get('window').width * 0.25,
        fontSize: 18,
        fontWeight: '500',
    },
    buttonStyle: { padding: 8, borderWidth: 1, borderColor: 'hotpink', borderRadius: 8, maxWidth: 100, width: 80, alignItems: 'center' },
    buttonText: {
        color: 'black', fontSize: 16, fontWeight: 'normal'
    },
    botResponse: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    userResponse: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    conversationMessage: {
        backgroundColor: 'white',
        elevation: 2,
        padding: 16,
        // borderWidth: 0.7,
        borderRadius: 10,
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.75,
    },
    boldText: {
        fontWeight: 'bold', // Apply bold styling
    },
    italicText: {
        fontStyle: 'italic', // Italic text style
    },
    strikeThroughText: {
        textDecorationLine: 'line-through', // Strikethrough text style
    },
    feedbackEmoji: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4
    },
    feedbackEmojiContainer: {
        width: '100%',
        marginTop: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    feedbackMessageWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },
    feedbackContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        width: Dimensions.get('window').width * 0.95
    },
    topcontainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: 24
    },
    typingLottie: {
        margin: 0,
        backgroundColor: 'transparent',
        height: Dimensions.get('window').height * 0.07,
        width: Dimensions.get('window').height * 0.1,
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8
    },
    starterContainer: {
        flexGrow: 1,
        marginTop: -Dimensions.get('screen').height * 0.07,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageStarters: {
        marginTop: 18,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});