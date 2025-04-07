import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://001268fbffd5f8421c89f95dc86bc372@o4508913177264128.ingest.us.sentry.io/4508913179230208',
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
});

export default function App() {
  function generateError() {
    throw new Error('My first Sentry error!');
  }

  return (
    <View style={{ marginTop: 100 }}>
      <Text onPress={generateError}>Hello World</Text>
    </View>
  );
}
