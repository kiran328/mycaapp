import {View, Text} from 'react-native';
import {Button} from '@rneui/base';

import Logo from './download.svg';

const App = () => (
  <View>
    <Button title="Hello World!" />
    <Logo  width={120} height={40} />
  </View>
);

export default App;
