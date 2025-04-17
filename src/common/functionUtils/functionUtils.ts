import { useNavigation } from "@react-navigation/native";
import { Linking, PermissionsAndroid, Platform, StyleSheet, ToastAndroid, View } from "react-native";
import RNFetchBlob from "react-native-blob-util";
import IGNORED_TAGS from 'react-native-render-html';
import FileViewer from 'react-native-file-viewer';
import { MMKV } from "react-native-mmkv";
import translate from "../../context/Translations";
import _ from 'lodash';
import EventSource from "react-native-sse";
import { STREAM_MESSAGE_TYPES } from "../constants/constant";

const navigation: any = useNavigation()

const getYTVideoID = (value: string) => {
  if (!value) return null;

  let url = value.toString().trim();

  const regExp =
    /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com(?:\/(?:shorts\/)?|\/watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);

  return match ? match[1] : null;
};

const getYTVideoTimeParams = (url: string) => {
  if (!url) {
    // console.error('Invalid URL: URL is null or undefined');
    return { startTime: null, endTime: null };
  }

  let paramsString = '';
  const queryStartIndex = url.indexOf('?');

  if (queryStartIndex !== -1) {
    paramsString = url.substring(queryStartIndex + 1);
  } else {
    // console.error('No query parameters found in the URL');
    return { startTime: null, endTime: null };
  }

  const params = paramsString.split('&');
  const paramObj: any = {};

  params.forEach(param => {
    const [key, value] = param.split('=');
    paramObj[key] = value;
  });

  const startTime = paramObj['startTime'] || null;
  const endTime = paramObj['endTime'] || null;

  return { startTime, endTime };
};

export const getYoutubeVideo = (element: string) => {
  const videoId = getYTVideoID(element);
  const { startTime, endTime } = getYTVideoTimeParams(element);

  let videoSrc = `https://www.youtube.com/embed/${videoId}`;

  if (startTime || endTime) {
    videoSrc += '?';
    if (startTime) videoSrc += `start=${startTime}&`;
    if (endTime) videoSrc += `end=${endTime}`;
  }

  return videoSrc;
};


export const handlePDFViewer = (pdfUrl: string) => {
  navigation.navigate('PDF Screen', { pdfUrl: pdfUrl });
}

export const handlePPTViewer = async (pptUrl: string) => {
  if (!pptUrl) {
    ToastAndroid.show('Invalid PPT URL', ToastAndroid.SHORT);
    return;
  }

  // Check and request storage permission on Android
  const checkStoragePermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 30) {
        // Check if MANAGE_EXTERNAL_STORAGE is already granted
        const hasPermission = await RNFetchBlob.fs.exists('/storage/emulated/0/');
        if (hasPermission) {
          ToastAndroid.show('Storage permission already granted', ToastAndroid.SHORT);
          return true;
        }

        // If not, request the user to grant it via system settings
        ToastAndroid.show('Requesting storage permission', ToastAndroid.SHORT);
        try {
          await Linking.openSettings();
          return true;
        } catch (err) {
          console.warn('Error opening settings:', err);
          ToastAndroid.show('Error opening settings', ToastAndroid.SHORT);
          return false;
        }
      } else {
        // For Android < 30, use WRITE_EXTERNAL_STORAGE
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message: 'This app needs access to your storage to save files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ToastAndroid.show('Permission granted', ToastAndroid.SHORT);
            return true;
          } else {
            ToastAndroid.show('Permission denied', ToastAndroid.SHORT);
            return false;
          }
        } catch (err) {
          console.warn(err);
          ToastAndroid.show('Error requesting permission', ToastAndroid.SHORT);
          return false;
        }
      }
    }
    return true;
  };

  // Check if storage permission is granted
  const permissionGranted = await checkStoragePermission();
  if (!permissionGranted) return;

  // Ensure the URL has the correct protocol
  if (!pptUrl.startsWith('https://') && !pptUrl.startsWith('http://')) {
    pptUrl = `https://${pptUrl}`;
  }

  // Remove leading '/' from the URL if present
  pptUrl = pptUrl.replace(/^\//, '');

  // Get the file name from the URL
  const fileName = pptUrl.substring(pptUrl.lastIndexOf('/') + 1);

  try {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const path = `${dirToSave}/${fileName}`;

    // Download the file
    const res = await RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path,
      },
    }).fetch('GET', pptUrl);

    // Check if the file was downloaded successfully
    if (res && res.path()) {
      // Open the downloaded file
      await FileViewer.open(res.path(), { showOpenWithDialog: true });
    } else {
      console.log('Error opening PPT: File not downloaded');
      ToastAndroid.show('Error opening PPT: File not downloaded', ToastAndroid.SHORT);
    }
  } catch (error) {
    console.log('Error opening PPT', error);
    ToastAndroid.show('Error opening PPT', ToastAndroid.SHORT);
  }
};

export const isTokenAvailable = () => {
  const storage = new MMKV
  const token = storage.getString('token'); // Retrieve the token from storage
  return !!token; // Return true if token is available, false otherwise
};

export const formatTime = (totalSeconds: number) => {
  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInWeek = 7 * secondsInDay;
  const secondsInMonth = 30 * secondsInDay; // Approximation
  const secondsInYear = 365 * secondsInDay; // Approximation

  const years = Math.floor(totalSeconds / secondsInYear);
  totalSeconds %= secondsInYear;

  const months = Math.floor(totalSeconds / secondsInMonth);
  totalSeconds %= secondsInMonth;

  const weeks = Math.floor(totalSeconds / secondsInWeek);
  totalSeconds %= secondsInWeek;

  const days = Math.floor(totalSeconds / secondsInDay);
  totalSeconds %= secondsInDay;

  const hours = Math.floor(totalSeconds / secondsInHour);
  totalSeconds %= secondsInHour;

  const minutes = Math.floor(totalSeconds / secondsInMinute);
  const seconds = totalSeconds % secondsInMinute;

  const secondsStr = `${seconds < 10 ? '0' : ' '}${seconds} ${translate("seconds")} `;
  const minutesStr = minutes > 0 ? ` ${minutes} ${translate("minutes")} ` : ' ';
  const hoursStr = hours > 0 ? ` ${hours} ${translate("hours")} ` : ' ';
  const daysStr = days > 0 ? ` ${days} ${translate("days")}${days > 1 ? 's ' : ' '}` : ' ';
  const weeksStr = weeks > 0 ? ` ${weeks} ${translate("week")}${weeks > 1 ? 's ' : ' '}` : ' ';
  const monthsStr = months > 0 ? ` ${months} ${translate("month")}${months > 1 ? 's ' : ''}` : ' ';
  const yearsStr = years > 0 ? ` ${years} ${translate("year")}${years > 1 ? 's ' : ' '}` : ' ';

  return [yearsStr, monthsStr, weeksStr, daysStr, hoursStr, minutesStr, secondsStr]
    .filter(part => part !== ' ')
    .join(':');
};

export const formatDateToDDMMYYY = (dateString: string) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [year, month, day] = dateString.split('-');
  const monthName = monthNames[parseInt(month, 10) - 1];

  return `${day}-${monthName}-${year}`;
};


export const replaceAll = (str: string, find: string | RegExp, replace: string) => {
  return str.replace(find, replace);
};

export const setFontFamilies = (content: any) => {
  let contentHTML = `${replaceAll(
    content,
    /font-family: courier-new;/g,
    'font-family: courier-new;',
  )}`;
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Noto Sans';/g,
    `font-family: NotoSansRegular;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Vesper Libre';/g,
    `font-family: VesperLibreRegular;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Open Sans';/g,
    `font-family: OpenSansRegular;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Noto Serif';/g,
    `font-family: NotoSerifRegular;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Crimson Text';/g,
    `font-family: CrimsonText;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Markazi Text';/g,
    `font-family: MarkaziText;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Indie Flower';/g,
    `font-family: IndieFlower;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Mukta Vaani';/g,
    `font-family: MuktaVaani;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Hind Madurai';/g,
    `font-family: HindMadurai;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Hind Guntur';/g,
    `font-family: HindGuntur;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Jameel Noori Nastaleeq';/g,
    `font-family: Jameel_Noori_Nastaleeq;`,
  );
  contentHTML = replaceAll(
    contentHTML,
    /font-family: 'Fajer Noori Nastalique';/g,
    `font-family: Fajer_Noori_Nastalique;`,
  );
  return contentHTML;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getTimeDifference = (created_at: string) => {
  const currentTime: any = new Date();
  const createdTime: any = new Date(created_at);

  const timeDiff = Math.abs(currentTime - createdTime);
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 2) {
    return '1 day ago';
  } else {
    // Format for dates beyond 1 day
    const day = createdTime.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[createdTime.getMonth()];
    const year = createdTime.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export function splitBySpaceMarkup(myText: string) {
  return myText
    ?.replace(/<br\s*\/?>/g, '<br/> ')
    .replace(/<\s*\/td>/g, '</td> ')
    .replace(/<\s*\/p>/g, '</p> ')
    .replace(/&nbsp;/g, ' ')
    .split(/(?![^<]*>)(\s+)/g)
    .filter((d) => d?.trim() !== '');
}

export const tagStyles: any = {
  h1: {
    fontWeight: 'normal',
    textDecorationColor: 'white',
    margin: 0,
    padding: 0,
  },
  h2: {
    fontWeight: 'normal',
    textDecorationColor: 'white',
    margin: 0,
    padding: 0,
  },
  h3: {
    fontWeight: 'normal',
    textDecorationColor: 'white',
    margin: 0,
    padding: 0,
  },
  h4: {
    fontWeight: 'normal',
    textDecorationColor: 'white',
    margin: 0,
    padding: 0,
  },
  h5: {
    fontWeight: 'normal',
    textDecorationColor: 'white',
    margin: 0,
    padding: 0,
  },
  h6: {
    fontWeight: 'normal',
    textDecorationColor: 'white',
    margin: 0,
    padding: 0,
  },
  span: {
    textDecorationColor: 'white',
    fontWeight: 'normal',
    margin: 0,
    padding: 0,
  },
  div: {
    textDecorationColor: 'white',
    fontWeight: 'normal',
    margin: 0,
    padding: 0,
  },
  p: {
    margin: 0,
    padding: 0,
    textDecorationColor: 'white',
    fontWeight: 'normal',
  }
}

export const getDataFromStream = (sseUrl: string, setterFn: any) => {
  const evtSource: any = new EventSource(sseUrl);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.GooeyEventSource = evtSource;
  evtSource.onmessage = (event: any) => {
    // parse the message as JSON
    const data = JSON.parse(event.data);
    // check if the message is the final response
    if (data.type === STREAM_MESSAGE_TYPES.FINAL_RESPONSE) {
      // close the stream
      setterFn(data);
      evtSource.close();
    } else {
      // update the state with the streamed message
      setterFn(data);
    }
  };
};
