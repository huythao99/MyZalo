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
import ProfileScreen from '../screens/personal/ProfileScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ShowImagePostScreen from '../screens/post/ShowImagePostScreen';
import CallingScreen from '../screens/chat/call/CallingScreen';
import IncomingCallScreen from '../screens/chat/call/IncomingCallScreen';

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
  Message: undefined;
  BottomTab: undefined;
  CreatePost: undefined;
  Personal: undefined;
  Profile: {
    uid: string;
  };
  Chat: {
    friendID: string;
    friendAvatar: string;
    friendName: string;
    friendEmail: string;
  };
  ShowImage: {
    uriImage: string;
    width: number;
    height: number;
  };
  Calling: {
    user?: {
      name: string;
      displayname: string;
      avatar: string;
    };
    call?: any;
    isIncomingCall?: Boolean;
    sendVideo?: Boolean;
  };
  IncomingCall: {
    call: any;
    sendVideo: Boolean;
  };
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
          <Stack.Screen name={'Profile'} component={ProfileScreen} />
          <Stack.Screen name={'Chat'} component={ChatScreen} />
          <Stack.Screen
            name={'ShowImage'}
            component={ShowImagePostScreen}
            options={{
              presentation: 'transparentModal',
            }}
          />
          <Stack.Screen
            name={'Calling'}
            component={CallingScreen}
            options={{
              presentation: 'transparentModal',
            }}
          />
          <Stack.Screen
            name={'IncomingCall'}
            component={IncomingCallScreen}
            options={{
              presentation: 'transparentModal',
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
