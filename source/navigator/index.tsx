import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/splash/SplashScreen';
import OnBoardingScreen from '../screens/splash/OnBoardingScreen';
import {useAppSelector} from '../app/hook';
import LastRegisterScreen from '../screens/auth/LastRegisterScreen';
import BottomTab from './BottomTab';
import CreatePostScreen from '../screens/post/CreatePostScreen';

export type RootStackParamList = {
  RegisterScreen: undefined;
  Splash: undefined;
  OnBoarding: undefined;
  Login: undefined;
  Register: undefined;
  LastRegister: {
    name: string;
  };
  Home: undefined;
  BottomTab: undefined;
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const isShowSplash = useAppSelector(state => state.auth.isLoadingSplash);
  const existUser = useAppSelector(state => state.auth.existUser);
  return (
    <Stack.Navigator>
      {isShowSplash ? (
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Splash"
          component={SplashScreen}
        />
      ) : !existUser ? (
        <Stack.Group
          screenOptions={{headerShown: false, presentation: 'modal'}}>
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="LastRegister" component={LastRegisterScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="BottomTab"
            component={BottomTab}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name={'CreatePost'} component={CreatePostScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
