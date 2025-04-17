import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, ActivityIndicator, Dimensions, AppState } from 'react-native';
import RenderHTML from 'react-native-render-html';
import styles from './ElementReelStyles';
import { getOnlineTts } from '../../../common/apis/api';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';

export default function PlayText(props) {
  const { playing, content, handleSpeech, handleOpenLink } = { ...props };
  const state = useRef(AppState.currentState);
  const [audioUrl, setAudioUrl] = useState(null);
  const [markWords, setMarkWords] = useState([]);
  const [appState, setAppState] = useState(state.current);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      handleSpeech(false);
      SoundPlayer.stop();
      Tts.stop();
      subscription.remove();
    };
  }, [appState]);

  function changeAudioUrl(value) {
    setAudioUrl(value);
  }

  function changeMarkWords(value) {
    setMarkWords(value);
  }

  useEffect(() => {
    return () => {
      try {
        SoundPlayer.stop();
      } catch (e) {
        console.error('Error stopping sound:', e);
      }
    };
  }, []);

  useEffect(() => {
    if (!playing) {
      try {
        SoundPlayer.stop();
        handleSpeech(false);
      } catch (e) {
        console.error('Error stopping sound:', e);
      }
    }
  }, [playing]);

  return !playing ? (
    <GetHtml passage={content} handleOpenLink={handleOpenLink} />
  ) : (
    <PlayMovingText
      {...props}
      audioUrl={audioUrl}
      changeAudioUrl={changeAudioUrl}
      markWords={markWords}
      changeMarkWords={changeMarkWords}
      handleOpenLink={handleOpenLink}
    />
  );
}

function PlayMovingText(props) {
  const {
    content,
    contentIndex,
    playingIndex,
    playing,
    handleSpeech,
    chapter_id,
    part_id,
    audioUrl,
    changeAudioUrl,
    markWords,
    changeMarkWords,
    handleOpenLink,
    componentID
  } = { ...props };

  const [newContent, setNewContent] = useState(content);
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  function splitBySpaceMarkup(myText) {
    const adjustedText = myText
      .replace(/<br\s*\/?>/g, '<br/> ')
      .replace(/<\s*\/td>/g, '</td> ')
      .replace(/<\s*\/p>/g, '</p> ')
      .replace(/&nbsp;/g, ' ');

    const myWord = adjustedText
      .split(/(?![^<]*>)(\s+)/g) // Split by space but ignore spaces inside HTML tags
      .filter(d => d.trim() !== ''); // Filter out empty elements

    return myWord;
  }

  const hasFetchedTts = useRef(false);

  const wordSplit = useMemo(() => splitBySpaceMarkup(content), [content]);

  useEffect(() => {
    if (playing && playingIndex === contentIndex) {
      if (!audioUrl || markWords.length < 1) {
        handleGetVoice();
      } else {
        setNewContent(content);
        playNow();
      }
    } else {
      resetAudio();
      setNewContent(content);
      cancelTimeout();
    }
  }, [playing, playingIndex, contentIndex, audioUrl, markWords]);

  useEffect(() => {
    const onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', () => {
      setNewContent(content);
      handleSpeech(false);
      cancelTimeout();
    });

    return () => {
      onFinishedPlayingSubscription.remove();
    };
  }, [playing]);

  function playNow() {
    if (audioUrl) {
      try {
        handleLoadingClose();
        SoundPlayer.playUrl(audioUrl);
        startHighlight();
      } catch (e) {
        console.error('Error playing sound:', e);
      }
    }
  }

  function resetAudio() {
    try {
      SoundPlayer.stop();
    } catch (e) {
      console.error('Error stopping sound:', e);
    }
  }

  function startHighlight() {
    timeoutId && cancelTimeout();
    startTimeout(0);
  }

  function startTimeout(index) {
    if (index >= markWords.length || !playing) return; // Stop if we've reached the end or playback stopped
  
    const currentMark = markWords[index]?.markName;
    const currentTime = markWords[index]?.timeSeconds;
  
    if (!currentMark || !currentTime) {
      console.warn("No valid mark or time found.");
      return;
    }
  
    SoundPlayer.getInfo()
      .then(info => {
        const audioCurrentTime = info.currentTime;
        const delay = (currentTime - audioCurrentTime) * 1000;
  
        if (delay < 0) {
          startTimeout(index + 1); // Skip to the next word
          return;
        }
  
        const id = setTimeout(() => {
          if (playing) {
            highlightCurrentWord(currentMark);
            startTimeout(index + 1); // Schedule the next word
          }
        }, delay);
  
        setTimeoutId(id);
      })
      .catch(e => {
        console.error('Error getting sound info:', e);
      });
  }
  

  function highlightCurrentWord(finalPosition) {
    if (finalPosition < 1 || finalPosition > wordSplit.length) {
      // If the position is out of bounds, stop highlighting
      console.warn("Highlighting position is out of bounds.");
      return;
    }
  
    const during = wordSplit[finalPosition - 1];
    const before = wordSplit?.slice(0, finalPosition - 1).join(' ');
    const after = wordSplit?.slice(finalPosition, wordSplit.length).join(' ');
  
    const bigWord = '<p>' + before + splitByMarkNonMark(during) + after + '</p>';
  
    setNewContent(String(bigWord));
  }
  

  function cancelTimeout() {
    clearTimeout(timeoutId);
  }

  function splitByMarkNonMark(myText) {
    const myWord =
      myText?.includes('<') || myText?.includes('>')
        ? myText.replace(
          /[^\s<>]+(?![^<]*>)/gi,
          "<span style='background-color:yellow'>$&</span>",
        )
        : "<span style='background-color:yellow'>" + myText + '</span>';
    return ' ' + myWord + ' ';
  }

  useEffect(() => {
    return () => {
      resetAudio();
      cancelTimeout();
    };
  }, []);

  const handleLoadingStart = () => {
    setLoading(true);
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  async function handleGetVoice() {
    if (hasFetchedTts.current) return;
    hasFetchedTts.current = true;

    handleLoadingStart();
    const params = {
      chapter_id,
      part_id,
      component_id: componentID,
      myvoice: wordSplit,
    };

    try {
      const data = await getOnlineTts(params);

      if (data?.response?.audiourl) {
        changeAudioUrl(data?.response?.audiourl);
      }

      if (data?.response?.timepoints) {
        changeMarkWords(data?.response?.timepoints);
      }

      playNow();
    } catch (e) {
      console.error('Error getting TTS:', e);
    } finally {
      handleLoadingClose();
    }
  }

  return (
    <>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color={'black'} size="large" />
        </View>
      )}
      <GetHtml passage={newContent} handleOpenLink={handleOpenLink} />
    </>
  );
}

const GetHtml = React.memo((props) => {
  const fontSize = 18;
  return (
    <RenderHTML
      baseStyle={{ color: 'black', textAlign: 'justify' }}
      source={{
        html: props.passage || '<span></span>',
      }}
      tagsStyles={{
        h1: {
          fontWeight: 'normal',
          textDecorationColor: 'white',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        h2: {
          fontWeight: 'normal',
          textDecorationColor: 'white',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        h3: {
          fontWeight: 'normal',
          textDecorationColor: 'white',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        h4: {
          fontWeight: 'normal',
          textDecorationColor: 'white',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        h5: {
          fontWeight: 'normal',
          textDecorationColor: 'white',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        h6: {
          fontWeight: 'normal',
          textDecorationColor: 'white',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        span: {
          textDecorationColor: 'white',
          fontWeight: 'normal',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        div: {
          textDecorationColor: 'white',
          fontWeight: 'normal',
          fontSize: fontSize,
          margin: 0,
          padding: 0,
        },
        p: {
          margin: 0,
          padding: 0,
          textDecorationColor: 'white',
          fontWeight: 'normal',
          fontSize: fontSize
        },
        li: {
          margin: 0,
          padding: 0,
          textDecorationColor: 'white',
          fontWeight: 'normal',
          fontSize: fontSize
        }
      }}
      contentWidth={Dimensions.get('window').width}
    />
  );
});
