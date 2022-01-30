import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, TouchableOpacity} from 'react-native';
import * as React from 'react';
import HomeScreen from '../screens/main/HomeScreen';
import MessageScreen from '../screens/main/MessageScreen';
import PersonalScreen from '../screens/main/PersonalScreen';
import PhoneBookScreen from '../screens/main/PhoneBookScreen';
import {Transition, Transitioning} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {BLUE_GRAY, LIGHT_BLUE, WHITE} from '../constants/COLOR';
import {HEIGHT_WINDOW, normalize, WIDHTH_WINDOW} from '../constants/Dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const ARRAY_ICON = ['facebook-messenger', 'address-book', 'home', 'user'];

type ButtonProps = {
  isFocus: Boolean;
};

const transition = (
  <Transition.Together interpolation="easeOut">
    <Transition.In type={'fade'} durationMs={500} />
    <Transition.Change />
    <Transition.Out type={'fade'} durationMs={500} />
  </Transition.Together>
);

const Container = styled.View`
  background-color: ${WHITE};
  flex-direction: row;
  height: ${(HEIGHT_WINDOW / 100) * 5.5}px;
  padding-vertical: ${HEIGHT_WINDOW / 100 / 2}px;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const Button = styled.TouchableOpacity`
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: ${(WIDHTH_WINDOW / 100) * 5}px;
  background-color: ${(props: ButtonProps) =>
    props.isFocus ? BLUE_GRAY : WHITE};
`;

const LabelContainer = styled.View`
  margin-left: ${(WIDHTH_WINDOW / 100) * 5}px;
`;

const LabelText = styled.Text`
  font-size: ${normalize(13)}px;
  font-weight: 700;
  color: ${LIGHT_BLUE};
`;

function MyTabBar({state, descriptors, navigation}) {
  const ref = React.useRef(null);
  return (
    <Transitioning.View ref={ref} transition={transition}>
      <Container>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const label = options.tabBarLabel;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            ref?.current.animateNextTransition();
            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          return (
            <Button
              isFocus={isFocused}
              key={index.toString()}
              onPress={onPress}>
              <FontAwesome5
                name={ARRAY_ICON[index]}
                solid
                size={(WIDHTH_WINDOW / 100) * 4.5}
                color={isFocused ? LIGHT_BLUE : BLUE_GRAY}
              />
              {isFocused && (
                <LabelContainer>
                  <LabelText>{label}</LabelText>
                </LabelContainer>
              )}
            </Button>
          );
        })}
      </Container>
    </Transitioning.View>
  );
}

export default function BottomTab() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{
          tabBarLabel: 'Tin nhắn',
        }}
      />
      <Tab.Screen
        name="PhoneBook"
        component={PhoneBookScreen}
        options={{
          tabBarLabel: 'Danh bạ',
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name="Personal"
        component={PersonalScreen}
        options={{
          tabBarLabel: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}
