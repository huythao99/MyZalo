import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styled from 'styled-components/native';
import {
  BLACK,
  BLUE_GRAY_200,
  GREY_600,
  RED_A400,
  WHITE,
} from '../constants/COLOR';
import {HEIGHT_WINDOW, WIDHTH_WINDOW} from '../constants/Dimensions';

type IconButtonProps = {
  isHangupButton?: Boolean;
};

const Container = styled.View`
  background-color: ${BLACK};
  padding: ${(WIDHTH_WINDOW / 100) * 5}px;
  padding-bottom: ${(HEIGHT_WINDOW / 100) * 5}px;
  border-top-radius: ${(WIDHTH_WINDOW / 100) * 4}px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${(HEIGHT_WINDOW / 100) * 3}px;
`;

const IconButton = styled.TouchableOpacity`
  background-color: ${(props: IconButtonProps) =>
    props.isHangupButton ? RED_A400 : GREY_600};
  padding: ${(WIDHTH_WINDOW / 100) * 4}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 10}px;
  width: ${(WIDHTH_WINDOW / 100) * 15}px;
  height: ${(WIDHTH_WINDOW / 100) * 15}px;
  justify-content: center;
  align-items: center;
`;

const CallActionBox = ({onHangupPress, onChangeCamera}) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const onReverseCamera = () => {
    onChangeCamera();
  };

  const onToggleCamera = () => {
    setIsCameraOn(currentValue => !currentValue);
  };

  const onToggleMicrophone = () => {
    setIsMicOn(currentValue => !currentValue);
  };

  return (
    <Container>
      <IconButton onPress={onReverseCamera}>
        <FontAwesome5
          name="camera"
          size={(WIDHTH_WINDOW / 100) * 7}
          color={WHITE}
        />
      </IconButton>

      <IconButton onPress={onToggleCamera}>
        <FontAwesome5
          name={isCameraOn ? 'volume-down' : 'volume-up'}
          size={(WIDHTH_WINDOW / 100) * 7}
          color={WHITE}
        />
      </IconButton>

      <IconButton onPress={onToggleMicrophone}>
        <FontAwesome5
          name={isMicOn ? 'microphone' : 'microphone-slash'}
          size={(WIDHTH_WINDOW / 100) * 7}
          color={WHITE}
        />
      </IconButton>

      <IconButton onPress={onHangupPress} isHangupButton={true}>
        <FontAwesome5
          name="phone"
          size={(WIDHTH_WINDOW / 100) * 7}
          color={WHITE}
        />
      </IconButton>
    </Container>
  );
};

export default CallActionBox;
