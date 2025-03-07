/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Marquee} from '@animatereactnative/marquee';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Home from './Home';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
     <Home />
    </GestureHandlerRootView>
  );
}

export default App;
