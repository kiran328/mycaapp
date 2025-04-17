import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { RenderHTML } from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import { LongPressGestureHandler, TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';
import { handlePPTViewer, setFontFamilies, getYoutubeVideo } from '../../../common/functionUtils/functionUtils'; // Import helper functions for PDF and PPT viewers
import WebView from 'react-native-webview';

import PPTDOwnload from '../../../../assets/lottie/ppt-file-document.json'
import PDFOpen from '../../../../assets/lottie/pdf-file-format-extension.json'
import { useNavigation } from '@react-navigation/native';
import styles from './ElementStyle';
import AudioPlayer from '../../../common/StyledComponents/AudioPlayer/AudioPlayerBC';
import QuizImage from '../../../../assets/images/online-question-answer.jpeg'
import Quiz from '../../../../assets/images/quiz.png'
import AudioPlayerReel from '../../../common/StyledComponents/AudioPlayer/AudioPlayerReel';

interface ElementProps {
    part: any;
}

const Elements: React.FC<ElementProps> = ({ part }) => {
    const { content_type, content_url, content } = part;

    switch (content_type) {
        case 'TEXT':
            return (
                <ScrollView>
                    <View style={styles.HTMLText}>
                        <RenderHTML
                            baseStyle={styles.baseFontStyle}
                            source={{
                                html: content
                            }}
                            contentWidth={Dimensions.get('window').width}
                            tagsStyles={{
                                p: {
                                    margin: 0,
                                    padding: 0,
                                },
                            }}
                        />
                    </View>
                </ScrollView>
            );
        case 'IMAGE':
            return (
                <View style={styles.imageStyle}>
                    <FastImage
                        style={{ width: "100%", height: 200 }}
                        source={{ uri: content_url }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    {content &&
                        <ScrollView style={styles.textContainer}>
                            <Text style={styles.text}>{content}</Text>
                        </ScrollView>
                    }
                </View>
            );
        case 'AUDIO':
            return (
                <View style={styles.AudioStyle}>
                    <AudioPlayerReel content_url={content_url} contentType='Preview' />
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>{content}</Text>
                </View>
            );
        case 'PDF':
            return (
                <View style={styles.PDFStyle}>
                    <LottieView
                        source={PDFOpen}
                        autoPlay
                        loop
                        style={{ width: "100%", height: 200, aspectRatio: 1.45 }}
                    />
                    <Text style={{ color: 'black', fontWeight: '500', fontSize: 16, top: -20 }}>Open PDF</Text>
                </View>
            );
        case 'PPT':
            return (
                // <LongPressGestureHandler onHandlerStateChange={handleLongPressPPT}>
                <View style={styles.PPTStyle}>
                    <LottieView
                        source={PPTDOwnload}
                        autoPlay
                        loop
                        style={{ width: "100%", height: 200, aspectRatio: 1.45 }}
                    />
                    <Text style={{ color: 'black', fontWeight: '500', fontSize: 16, top: -20 }}>Tap to View PPT</Text>
                </View>
                // </LongPressGestureHandler>
            );

        case 'QUIZ':
            return (
                <View style={styles.Quiz}>
                    <FastImage
                        style={{ width: "100%", height: 80, borderRadius: 6 }}
                        source={Quiz}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
            )

        case 'VIDEO':
            const youtubeVideo = getYoutubeVideo(content_url);
            if (youtubeVideo) {

                return (
                    <View style={styles.VideoStyle}>
                        <View style={styles.videoContainer}>
                            <WebView
                                style={styles.webView}
                                javaScriptEnabled={true}
                                allowsFullscreenVideo={true}
                                source={{ uri: youtubeVideo }}
                            />
                        </View>
                        {content &&
                            <ScrollView style={styles.textContainer}>
                                <Text style={styles.text}>{content}</Text>
                            </ScrollView>
                        }
                    </View>
                );
            }
            return null;
        case 'GFORM':
            return (
                <View style={styles.GFormStyle}>
                    <WebView
                        style={{ width: Dimensions.get('window').width * 0.8, height: 500 }}
                        javaScriptEnabled={true}
                        source={{ uri: content_url }}
                        scrollEnabled={true}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <ActivityIndicator size="large" color="blue" />
                        )}
                    />
                </View>
            );

        case 'GIF':
            return (
                <View style={styles.GifStyle}>
                    <FastImage
                        style={{ width: "100%", height: 200, borderRadius: 18 }}
                        source={{ uri: content_url }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    {content &&
                        <ScrollView style={styles.textContainer}>
                            <Text style={styles.text}>{content}</Text>
                        </ScrollView>
                    }
                </View>
            );
        case 'LOTTIE':
            return (
                <View style={styles.lottieStyle}>
                    <LottieView
                        source={{ uri: content_url }}
                        autoPlay
                        loop
                        style={{ width: "100%", height: 200, aspectRatio: 1.45 }}
                    />
                    {content &&
                        <ScrollView style={styles.textContainer}>
                            <Text style={styles.text}>{content}</Text>
                        </ScrollView>
                    }
                </View>
            );
        default:
            return null;
    }
};

export default Elements;
