import {StyleSheet, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    width: width,
  },
  error: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    marginTop: 5,
  },
  errorIcon: {
    fontSize: 30,
  },
});

export default styles;
