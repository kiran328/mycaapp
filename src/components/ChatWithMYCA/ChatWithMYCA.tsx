import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ToastAndroid,
  Dimensions,
  ImageBackground,
  Modal,
  BackHandler,
  Image,
  ActivityIndicator,
} from 'react-native';
import colours from '../../common/constants/styles.json';
import { useNavigation, useRoute } from '@react-navigation/native';
import Back from '../../../assets/svg/back';
import Header from '../../common/StyledComponents/Header';
import translate from '../../context/Translations';
import Send from '../../../assets/svg/settingsicons/send.svg'
import { createChatStream, submitChatBotFeedback, createChatStream2, getConverstions } from '../../common/apis/api';
import LottieView from 'lottie-react-native';
import Typing from '../../../assets/lottie/typing.json';
import { styles } from './ChatWithMYCAStyle';
// import Good from '../../../assets/svg/Good';
// import Bad from '../../../assets/svg/Bad';
import { FEEDBACK_CATEGORY, FEEDBACK_TYPE } from '../../common/constants/constant';
// import Love from '../../../assets/svg/love';
import MYCA from '../../../assets/svg/settingsicons/myca-chatbot-logo.svg';
import MycaLogo from '../../../assets/svg/settingsicons/myca-chatbot.svg';
import User from '../../../assets/svg/user';
import { useDispatch, useSelector } from 'react-redux';
import { MMKV } from 'react-native-mmkv';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import Info from '../../../assets/svg/info';
import Close from '../../../assets/svg/close';
import { RootState } from '../../redux/rootReducer';
import { Divider } from '@rneui/base';
import LoadingSpinner from '../../../assets/lottie/loading.json'
import Excellent from '../../../assets/svg/feedback/excellent.svg'
import Good from '../../../assets/svg/feedback/good.svg';
import Medium from '../../../assets/svg/feedback/medium.svg';
import Poor from '../../../assets/svg/feedback/poor.svg';
import VeryBad from '../../../assets/svg/feedback/bad.svg';
import CloseReel from '../../../assets/svg/closeReel';

// Define types for messages
interface Message {
  type: 'user' | 'bot';
  text: string;
}

const marathiConverastion = [
  { id: 1, message: "माझ्या दिवसाचा आढावा घेण्यासाठी मला मदत करशील का?" },
  { id: 2, message: "I’m feeling a bit down, can you say something uplifting?" },
  { id: 3, message: "Can you help me relax? I’m feeling overwhelmed." },
  { id: 4, message: "मला आत्ता कसे वाटते हे मला कळत नाही, आपण ते एकत्र शोधू शकतो का?" },
  { id: 5, message: "Can you help me build a positive mindset today?" },
  { id: 6, message: "I want to talk about something that’s been bothering me." },
  { id: 7, message: "What can I do to stay motivated when I’m feeling low?" },
  { id: 8, message: "आज काहीतरी चांगलं घडलं, तुला सांगायला आवडेल." },
  { id: 9, message: "माझ्या भावनांवर काम करायला काही मार्गदर्शन करशील का?" },
  { id: 10, message: "ताणमुक्त झोपेसाठी काही सल्ला देशील का?" },
  { id: 11, message: "Do you have tips for managing overthinking?" },
  { id: 12, message: "माझ्या आत्मविश्वासावर काम करण्यासाठी काही activity सांगशील का?" },
]

const ChatComponent: React.FC = () => {
  const storage = new MMKV();
  const route: any = useRoute();
  const userInfo: any = storage.getString('userInfo');
  const parsedUserInfo = JSON.parse(userInfo);

  const user: any = useSelector((state: RootState) => state.app.userInfo);
  const categoryList: any = useSelector((state: RootState) => state.app.categoryList);
  const genderList: any = useSelector((state: RootState) => state.app.genderList);

  const { prompt, disclaimer } = route.params;

  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationStarters, setConversationStarters] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [feedbackResponse, setFeedbackResponse] = useState<any>({
    category: '',
    type: '',
    botText: ''
  })
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<any[]>([]);
  const navigation: any = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const convoListRef = useRef<FlatList>(null);
  const language = storage.getString('language');

  const handleTextChange = async (text: string) => {
    setInputText(text);
  };

  const fetchPastConversations = async () => {
    setLoading(true);
    try {
      const response = await getConverstions(parsedUserInfo.mobile);
      if (response && response.data) {
        const API_RESPONSE = response.data.messages;
        const formattedMessages = API_RESPONSE.map((item: any) => [
          { type: "user", text: item.user },
          { type: "bot", text: item.response },
        ]).flat()
        setMessageList(formattedMessages);
        setMessages((prev) => [...prev, ...formattedMessages]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching conversiotions", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getRandomMessages = (messages: any[], count: number) => {
      const shuffled = [...messages].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    fetchPastConversations();
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }

    setConversationStarters(getRandomMessages(marathiConverastion, 4));
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      navigateToDashboard();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async (message?: string) => {
    const textToSend = message || inputText.trim();

    if (!textToSend) {
      return ToastAndroid.show("Please enter a message!", ToastAndroid.SHORT);
    }

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', text: textToSend }]);
    setIsLoading(true);
    setInputText("");

    try {
      // Create stream
      const response = await createChatStream2(textToSend, parsedUserInfo.mobile);

      if (response && response.data) {
        const Output = response.data.output;
        // Get SSE URL
        // const sseUrl = response.data.url;
        // if (!sseUrl) throw new Error("No SSE URL received");

        if (Output) {
          setMessages((prev) => [...prev, { type: "bot", text: Output }]);
          setIsLoading(false);
          setShowFeedbackButtons(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };


  const handleConversation = async (convo: any) => {
    const message = convo.message;

    // Call handleSend directly with the message
    await handleSend(message);

    // Optionally, clear conversation starters
    setConversationStarters([]);
  };

  const handleFeedback = (category: string, type: string, messages: any) => {
    const botMessage = messages?.find((message: any) => message.type === "bot");

    // if (type === FEEDBACK_TYPE.LIKE && botMessage) {
    //   setFeedbackResponse({
    //     category: category,
    //     type: type,
    //     botText: botMessage?.text.toString()
    //   })
    //   setShowModal(true);
    // } else if (type === FEEDBACK_TYPE.DISLIKE && botMessage) {
    //   setFeedbackResponse({
    //     category: category,
    //     type: type,
    //     botText: botMessage?.text.toString()
    //   })
    //   setShowModal(true);
    // } else {
    setFeedbackResponse({
      category: category,
      type: type,
      botText: null
    })
    setShowModal(true);
    // }
  }

  const handleUserFeedback = async (category: string, type: string) => {
    const botMessages = messages.filter((message: any) => message.type === "bot");
    const lastBotMessage = botMessages[botMessages.length - 1];

    try {
      const response = await submitChatBotFeedback(category, type, null);
      if (response && response.data) {
        setFeedbackResponse({
          category: '',
          type: '',
          botText: ''
        })
        setFeedbackMessage("");
        setShowModal(false);
        ToastAndroid.show("Thank you for your feedback!", ToastAndroid.SHORT);
        setShowFeedbackButtons(false);
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      console.error("Error submitting feedback", err)
    }
  }

  const renderFormattedText = (text: string) => {
    const regex = /(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_|~~.*?~~|~.*?~)/g; // Match bold, italic, or strikethrough styles
    const parts = text.split(regex); // Split text into parts based on the regex

    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Render bold text
        return (
          <Text key={idx} style={styles.boldText}>
            {part.slice(2, -2)}
          </Text>
        );
      } else if (part.startsWith("*") && part.endsWith("*")) {
        // Render italic text for single '*'
        return (
          <Text key={idx} style={styles.italicText}>
            {part.slice(1, -1)}
          </Text>
        );
      } else if (part.startsWith("__") && part.endsWith("__")) {
        // Render italic text for double '__'
        return (
          <Text key={idx} style={styles.italicText}>
            {part.slice(2, -2)}
          </Text>
        );
      } else if (part.startsWith("_") && part.endsWith("_")) {
        // Render italic text for single '_'
        return (
          <Text key={idx} style={styles.italicText}>
            {part.slice(1, -1)}
          </Text>
        );
      } else if (part.startsWith("~~") && part.endsWith("~~")) {
        // Render strikethrough text
        return (
          <Text key={idx} style={styles.strikeThroughText}>
            {part.slice(2, -2)}
          </Text>
        );
      } else if (part.startsWith("~") && part.endsWith("~")) {
        // Render strikethrough text for single '~'
        return (
          <Text key={idx} style={styles.strikeThroughText}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      // Render normal text
      return part;
    });
  };
  
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
      
    return (
      <View
        style={[
          item.type !== "user" ? styles.botResponse : styles.userResponse,
          { alignItems: "flex-start" },
        ]}
      >
        {item.type !== "user" && <MYCA />}
        <View
          style={[
            styles.messageBubble,
            { marginBottom: index === messages.length - 1 ? 32 : 4, marginHorizontal: 8 },
            item.type === "user" ? styles.userMessage : styles.botMessage,
          ]}
        >
          <Text style={item.type === "user" ? styles.userText : styles.botText}>
            {renderFormattedText(item.text)}
          </Text>
        </View>
        {item.type === "user" && <User height={25} width={25} />}
      </View>
    );
  };
  

  const renderConversations = ({ item }: { item: any }) => (
    <TouchableOpacity key={item.id}
      style={styles.conversationMessage} onPress={() => handleConversation(item)}>
      <Text style={styles.sendButtonText}>{item.message}</Text>
    </TouchableOpacity>
  );

  const navigateToDashboard = () => {
    if ((messages.length === 0) || (messageList.length === messages.length)) {
      navigation.navigate('Dashboard');
    } else {
      handleFeedback(FEEDBACK_CATEGORY.CHAT, FEEDBACK_TYPE.EXCELLENT, null)
    }
  };

  const onSubmitPress = async () => {
    if (feedbackMessage === '') {
      return ToastAndroid.show("Please enter a valid message", ToastAndroid.SHORT);
    } else {
      try {
        const response = await submitChatBotFeedback(feedbackResponse?.category, feedbackResponse?.type, feedbackMessage);
        if (response && response.data) {
          setFeedbackResponse({
            category: '',
            type: '',
            botText: ''
          })
          setFeedbackMessage("");
          setShowModal(false);
          ToastAndroid.show("Thank you for your feedback!", ToastAndroid.SHORT);
          setShowFeedbackButtons(false);
          navigation.navigate('Dashboard');
        }
      } catch (err) {
        console.error("Error submitting feedback", err)
      }
    }

  }

  const onCancelPress = () => {
    setFeedbackResponse({
      category: '',
      type: '',
      botText: ''
    })
    setShowModal(false);
    navigation.navigate('Dashboard');
  }

  const handleInfoButton = () => {
    setShowInfo(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
      <Header
        title={`AI Chatbot`}
        headerBackgroundColor={colours['theme-color']}
        statusBarBackgroundColor={colours['theme-color']}
        showBackButton={true}
        onLeftIconPress={navigateToDashboard}
        leftIcon={<Back />}
        onRightIconPress={handleInfoButton}
        rightIcon={<Info />}
      />
      <View style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
            <LottieView
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
              source={LoadingSpinner}
            />
          </View>
        ) : messages.length === 0 && !loading ? (
          <View style={styles.messageStarters}>
            <MycaLogo />
            <Text style={{
              fontSize: 18,
              textAlign: 'center',
              color: 'black',
            }}>What’s on your mind?
            </Text>
            <FlatList
              key={'conversationStarters'}
              ref={convoListRef}
              data={conversationStarters}
              renderItem={renderConversations}
              style={styles.conversationStarters}
              contentContainerStyle={styles.starterContainer}
              numColumns={1}
            />
          </View>
        ) : (
          <FlatList
            key={'messagesList'} // Unique key for messages list
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, index) => index.toString()}
            style={styles.messagesList}
          />
        )}


        {isLoading && (
          <View style={styles.loadingContainer}>
            {/* <Text style={styles.loadingText}>Typing...</Text> */}
            <MYCA />
            <LottieView
              source={Typing} style={styles.typingLottie} autoPlay loop
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              multiline={true}
              style={[styles.input]}
              value={inputText}
              onChangeText={handleTextChange}
              placeholder={translate('Type...')}
              placeholderTextColor="#666"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.disabledButton]}
              onPress={() => handleSend()}
              disabled={isLoading}
            >
              <Send />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal visible={showModal} statusBarTranslucent animationType="fade" transparent onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          <View style={styles.modalContent}>
            <View style={styles.feedbackContainer}>
              <View style={styles.topcontainer}>
                <View><Text></Text></View>
                <Text style={{ color: '#000', fontSize: 16, marginLeft: 48, marginBottom: 16 }}>{translate("YourExperience")}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)} style={{
                  marginBottom: 16,
                  marginLeft: 32
                }}>
                  <CloseReel />
                </TouchableOpacity>
              </View>
              <View style={styles.feedbackMessageWrapper}>
                <TextInput
                  multiline
                  style={[styles.heading, { width: feedbackMessage ? Dimensions.get('window').width * 0.8 : Dimensions.get('window').width * 0.9 }]}
                  value={feedbackMessage}
                  onChangeText={text => setFeedbackMessage(text)}
                  placeholder={translate("Type...")}
                  placeholderTextColor={'#666'}
                  numberOfLines={4}
                />

                {feedbackMessage && <TouchableOpacity
                  style={[styles.sendButton, isLoading && styles.disabledButton, { paddingHorizontal: 8, paddingVertical: 8 }]}
                  onPress={onSubmitPress}
                >
                  <Send />
                </TouchableOpacity>}

              </View>

              <View style={styles.feedbackEmojiContainer}>
                <TouchableOpacity style={styles.feedbackEmoji}
                  onPress={() => handleUserFeedback(FEEDBACK_CATEGORY.CHAT, FEEDBACK_TYPE.VERY_BAD)}
                >
                  <VeryBad />
                  <Text style={{ color: 'black', textAlign: 'center', marginRight: 8 }}>Very Bad</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackEmoji}
                  onPress={() => handleUserFeedback(FEEDBACK_CATEGORY.CHAT, FEEDBACK_TYPE.POOR)}
                >
                  <Poor />
                  <Text style={{ color: 'black', textAlign: 'center', marginRight: 8 }}>Poor</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackEmoji}
                  onPress={() => handleUserFeedback(FEEDBACK_CATEGORY.CHAT, FEEDBACK_TYPE.MEDIUM)}
                >
                  <Medium />
                  <Text style={{ color: 'black', textAlign: 'center', marginRight: 8 }}>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackEmoji}
                  onPress={() => handleUserFeedback(FEEDBACK_CATEGORY.CHAT, FEEDBACK_TYPE.GOOD)}
                >
                  <Good />
                  <Text style={{ color: 'black', textAlign: 'center', marginRight: 12 }}>Good</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackEmoji}
                  onPress={() => handleUserFeedback(FEEDBACK_CATEGORY.CHAT, FEEDBACK_TYPE.EXCELLENT)}
                >
                  <Excellent />
                  <Text style={{ color: 'black', textAlign: 'center', marginRight: 8 }}>Excellent</Text>
                </TouchableOpacity >



                {/* <TouchableOpacity style={[styles.buttonStyle]} onPress={onCancelPress}>
                  <Text style={styles.buttonText}>Exit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.buttonStyle]} onPress={onSubmitPress}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* <CustomModal visible={showInfo} onRequestClose={() => setShowInfo(false)}>
        <View style={{
          padding: 16
        }}>
          <Text style={{
            color: 'black',
            fontSize: 17,
            fontWeight: 'normal',
            textAlign: 'justify'
          }}>

          </Text>
        </View>
      </CustomModal> */}
      <CustomModal visible={showInfo} onRequestClose={() => setShowInfo(false)}>
        <View style={{
          padding: 12,
          borderColor: 'black',
          borderRadius: 16,
        }}>
          <Text style={{
            color: 'gray',
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 8
          }}>Disclaimer</Text>
          <Divider style={{ marginBottom: 8 }} />
          <Text style={{
            color: 'black',
            fontSize: 17,
            fontWeight: 'normal',
            textAlign: 'center'
          }}>
            {language === 'en' ? disclaimer?.eng_text : disclaimer?.mar_text}
          </Text>
        </View>
      </CustomModal>
    </View>
  );
};

export default ChatComponent;
