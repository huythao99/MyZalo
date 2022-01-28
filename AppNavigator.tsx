import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './source/navigator';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
