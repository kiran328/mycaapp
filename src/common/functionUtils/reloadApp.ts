import { NativeModules } from 'react-native';

const { DevSettings } = NativeModules;

const reloadApp = () => {
  DevSettings.reload();
};

export default reloadApp;