import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground, Pressable} from 'react-native';
// import bg from '../../../assets/images/ios_bg.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {Voximplant} from 'react-native-voximplant';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigator';
import {
  BLACK,
  GREEN_500,
  RED_A400,
  TRANSPARENT,
  WHITE,
} from '../../../constants/COLOR';
import styled from 'styled-components/native';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../../constants/Dimensions';

interface IncomingCallProps {
  route: {
    params: {
      call: any;
      sendVideo: Boolean;
    };
  };
}

type IncomingCallScreenProps = StackNavigationProp<
  RootStackParamList,
  'Calling'
>;

type ButtonProps = {
  color: string;
};

const Container = styled.View`
  background-color: ${BLACK};
  flex: 1;
  align-items: center;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 5}px;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 5}px;
`;

const NameText = styled.Text`
  font-size: ${normalize(30)}px;
  font-weight: 700;
  color: ${WHITE};
  margin-top: ${(HEIGHT_WINDOW / 100) * 12}px;
  margin-bottom: ${(HEIGHT_WINDOW / 100) * 3}px;
`;

const PhoneText = styled.Text`
  font-size: ${normalize(20)}px;
  color: ${WHITE};
`;

const RowContainer = styled.View`
  width: ${WIDHTH_WINDOW}px;
  flex-direction: row;
  justify-content: space-around;
`;

const IconContainer = styled.View`
  align-items: center;
  margin-vertical: ${(HEIGHT_WINDOW / 100) * 2.5}px;
`;

const IconText = styled.View`
  color: ${WHITE};
  margin-top: ${HEIGHT_WINDOW / 100}px;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: ${WIDHTH_WINDOW}px;
  flex-direction: row;
  justify-content: space-around;
`;

const IconButtonContainer = styled.View`
background-color: ${(props: ButtonProps) => props.color},
width: ${(WIDHTH_WINDOW / 100) * 15}px;
height: ${(WIDHTH_WINDOW / 100) * 15}px;
border-radius: ${(WIDHTH_WINDOW / 100) * 10}px;
margin: ${(WIDHTH_WINDOW / 100) * 2.5}px;
`;

const IncomingCallScreen = (props: IncomingCallProps) => {
  const [caller, setCaller] = useState('');
  const navigation = useNavigation<IncomingCallScreenProps>();
  const {call} = props.route.params;

  useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName);

    call.on(Voximplant.CallEvents.Disconnected, () => {
      navigation.goBack();
    });

    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
  }, []);

  const onDecline = () => {
    call.decline();
  };

  const onAccept = () => {
    navigation.navigate('Calling', {
      call,
      isIncomingCall: true,
      sendVideo: props.route.params.sendVideo,
    });
  };

  return (
    <Container>
      <NameText>{caller}</NameText>
      <PhoneText>WhatsApp video...</PhoneText>

      <RowContainer>
        <IconContainer>
          <Ionicons
            name="alarm"
            color={WHITE}
            size={(WIDHTH_WINDOW / 100) * 7}
          />
          <IconText>Remind me</IconText>
        </IconContainer>
        <IconContainer>
          <Entypo
            name="message"
            color={WHITE}
            size={(WIDHTH_WINDOW / 100) * 7}
          />
          <IconText>Message</IconText>
        </IconContainer>
      </RowContainer>

      <RowContainer>
        {/* Decline Button */}
        <ButtonContainer onPress={onDecline}>
          <IconButtonContainer color={RED_A400}>
            <Feather name="x" color={WHITE} size={(WIDHTH_WINDOW / 100) * 10} />
          </IconButtonContainer>
          <IconText>Decline</IconText>
        </ButtonContainer>

        {/* Accept Button */}
        <ButtonContainer onPress={onAccept}>
          <IconButtonContainer color={GREEN_500}>
            <Feather
              name="check"
              color={WHITE}
              size={(WIDHTH_WINDOW / 100) * 10}
            />
          </IconButtonContainer>
          <IconText>Accept</IconText>
        </ButtonContainer>
      </RowContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 100,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  bg: {
    backgroundColor: TRANSPARENT,
    flex: 1,
    alignItems: 'center',
    padding: 10,
    paddingBottom: 50,
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: 'white',
    marginTop: 10,
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    margin: 10,
  },
});

export default IncomingCallScreen;
