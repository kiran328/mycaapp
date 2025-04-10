import React from 'react';
import { Alert, View } from 'react-native';
import {Button} from 'react-native';
import PushNotification from "react-native-push-notification";




export default function App() {


		function pushNotif(){
  PushNotification.createChannel(
    {
      channelId: "specialid", // (required)
      channelName: "Special messasge", // (required)
      channelDescription: "Notification for special message", // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  PushNotification.localNotification({
    channelId:'specialid', //his must be same with channelid in createchannel
    title:'hello',
    message:'test message'
  })
 }

  return <View style={{ marginTop: 100, backgroundColor: "red" }}><Button  onPress={pushNotif} title="click" /></View>
}
