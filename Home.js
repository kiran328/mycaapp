import React from 'react';
import { View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import { downloadFile, dirs } from 'react-native-blob-util';

export default function Home() {
  const fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  const fileName = 'dummy.pdf';

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true; // No permission needed on iOS
//   };
const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          // Android 13+ (Scoped Storage)
          const readGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
          return readGranted === PermissionsAndroid.RESULTS.GRANTED;
        } else if (Platform.Version >= 30) {
          // Android 11+ (Scoped Storage requires MANAGE_EXTERNAL_STORAGE)
          const manageGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE
          );
          return manageGranted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android 10 and below
          const writeGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          return writeGranted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS does not require permission
  };


  const downloadAndOpenFile = async () => {
    console.log('Download started...');

    if (!(await requestStoragePermission())) {
      Alert.alert('Permission Denied', 'Storage permission is required to download files.');
      return;
    }

    const filePath = `${dirs.DocumentDir}/${fileName}`;
    console.log('Saving to:', filePath);

    try {
      const result = await downloadFile({ fromUrl: fileUrl, toFile: filePath }).promise;

      if (result.statusCode === 200) {
        console.log('File downloaded:', filePath);
        Alert.alert('Download Complete', 'Opening file...');
        await FileViewer.open(filePath);
        console.log('File opened successfully');
      } else {
        console.warn('Download failed:', result);
      }
    } catch (error) {
      console.warn('Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ marginTop: 100, marginLeft: 10 }}>
      <Text style={{ fontSize: 18, color: 'blue' }} onPress={downloadAndOpenFile}>
        Tap to Download & Open PDF
      </Text>
    </View>
  );
}
