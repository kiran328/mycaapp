import React, { FC, useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './AppNavigator';
import { QueryClientProvider, QueryClient } from 'react-query';
import * as RNLocalize from 'react-native-localize';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from './commonUtils';
import { pushNotificationService } from './PushNotificationService';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import NoInternet from './assets/lottie/no-wi-fi.json'
import translate from './src/context/Translations';

// import SplashScreen from 'react-native-splash-screen';

interface AppProps { }

const App: FC<AppProps> = () => {
  const unsubscribe = useRef<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // SplashScreen.hide();
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    unsubscribe.current = messaging().onMessage(async (remoteMessage: any) => {
      if (remoteMessage && remoteMessage.notification) {
        pushNotificationService.showNotification(
          remoteMessage.notification?.title,
          remoteMessage.notification?.body,
          remoteMessage.notification?.android?.imageUrl,
          remoteMessage.notification?.android?.smallIcon
        );
      }
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
      console.log('Message handled in the background!', remoteMessage);
      if (remoteMessage && remoteMessage.notification) {
        pushNotificationService.showNotification(
          remoteMessage.notification?.title,
          remoteMessage.notification?.body,
          remoteMessage.notification?.android?.imageUrl,
          remoteMessage.notification?.android?.smallIcon
        )
      };
    });

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, []);


  useEffect(() => {
    requestUserPermission();
    pushNotificationService.configure();
  }, []);

  useEffect(() => {
    const detectPreferredLocale = () => {
      const locales = RNLocalize.getLocales();
      const preferredLocale = locales[0]?.languageTag || 'en';
    };

    detectPreferredLocale();
  }, []);

  if (!isConnected) {
    // Render a blank screen when there's no internet
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          <LottieView
            source={NoInternet}
            style={styles.lottieStyles}
            autoPlay
            loop
          />
          <Text style={{ fontSize: 20, color: 'black' }}>OOPS!</Text>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{translate("NoInternet")}</Text>
          <Text style={{ fontSize: 16, color: 'black', fontWeight: '400' }}>{translate("CheckConnection")}</Text>
        </View>
      </View>
    )
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Provider store={store}>
          <SafeAreaProvider>
            {/* <SafeAreaView> */}
              <AppNavigator />
            {/* </SafeAreaView> */}
          </SafeAreaProvider>
      </Provider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieStyles: {
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width,
  },
})

export default App;
