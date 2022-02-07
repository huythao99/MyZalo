import * as React from 'react';
import {View, Text} from 'react-native';
import {useAppDispatch} from '../../app/hook';
import {loadingSplash, requestAutoLogin} from '../../features/auth/authSlice';
import LottieView from 'lottie-react-native';

export default function SplashScreen() {
  const dispatch = useAppDispatch();

  const hideSplashScreen = () => {
    setTimeout(() => {
      dispatch(requestAutoLogin());
    }, 2000);
  };

  React.useEffect(() => {
    hideSplashScreen();
  }, []);

  return (
    <LottieView
      source={require('../../assets/lottie/88958-shopping-green.json')}
      autoPlay
      loop
    />
  );
}
