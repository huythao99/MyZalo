import * as React from 'react';
import {View, Text} from 'react-native';
import {useAppDispatch} from '../../app/hook';
import {
  loadingSplash,
  requestAutoLogin,
} from '../../features/counter/authSlice';

export default function SplashScreen() {
  const dispatch = useAppDispatch();

  const hideSplashScreen = () => {
    dispatch(requestAutoLogin());
  };

  React.useEffect(() => {
    hideSplashScreen();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Splash Screen</Text>
    </View>
  );
}
