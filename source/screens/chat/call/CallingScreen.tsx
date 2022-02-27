import React, {useEffect, useState, useRef} from 'react';
import {PermissionsAndroid, Alert, Platform} from 'react-native';
import CallActionBox from '../../../components/CallActionBox';
import {useNavigation} from '@react-navigation/core';
import {Voximplant} from 'react-native-voximplant';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigator';
import {
  requestPermission,
  showAlert,
  TypePermission,
} from '../../../ultities/Ultities';
import styled from 'styled-components/native';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../../constants/Dimensions';
import {BLACK, WHITE} from '../../../constants/COLOR';

type CallScreenProps = StackNavigationProp<RootStackParamList, 'Calling'>;

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

interface CallingProps {
  route: {
    params: {
      user?: {
        name: string;
        displayname: string;
        avatar: string;
      };
      call?: any;
      isIncomingCall?: Boolean;
      sendVideo?: Boolean;
    };
  };
}

const Container = styled.View`
  width: ${WIDHTH_WINDOW}px;
  height: ${HEIGHT_WINDOW}px;
  background-color: ${BLACK};
`;

const CameraPreview = styled.View`
  align-items: center;
  padding-vertical: ${HEIGHT_WINDOW / 100}px;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 5}px;
`;

const LocalVideo = styled.View`
  width: ${(WIDHTH_WINDOW / 100) * 20}px;
  height: ${(WIDHTH_WINDOW / 100) * 20 * 1.5}px;
  position: absolute;
  right: ${(WIDHTH_WINDOW / 100) * 2.5}px;
  top: ${((HEIGHT_WINDOW / 100) * 25) / 2}px;
`;

const RemoteVideo = styled.View`
  flex: 1;
`;

const NameUser = styled.Text`
  font-size: ${normalize(20)}px;
  font-weight: bold;
  color: ${WHITE};
  margin-top: ${(HEIGHT_WINDOW / 100) * 6}px;
  margin-bottom: ${(HEIGHT_WINDOW / 100) * 2}px;
`;

const PhoneNumber = styled.Text`
  font-size: ${normalize(20)}px;
  color: ${WHITE};
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${(HEIGHT_WINDOW / 100) * 6}px;
  left: ${(WIDHTH_WINDOW / 100) * 5}px;
  zindex: 1px;
`;

const CallingScreen = (props: CallingProps) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const navigation = useNavigation<CallScreenProps>();

  const {
    user,
    call: incomingCall,
    isIncomingCall,
    sendVideo,
  } = props.route?.params;

  const voximplant = Voximplant.getInstance();
  const camera = Voximplant.Hardware;

  const call = useRef(incomingCall);
  const endpoint = useRef(null);

  const goBack = () => {
    navigation.pop();
  };

  const onChangeCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    camera.CameraManager.getInstance().switchCamera(
      isFrontCamera ? camera.CameraType.BACK : camera.CameraType.FRONT,
    );
  };

  useEffect(() => {
    const getPermissions = async () => {
      const permissionCamera = await requestPermission(
        TypePermission.camera[Platform.OS],
      );
      const permissionMicro = await requestPermission(
        TypePermission.micro[Platform.OS],
      );
      setPermissionGranted(permissionCamera && permissionMicro);
    };
    getPermissions();
  }, []);

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }

    const callSettings = {
      video: {
        sendVideo: sendVideo,
        receiveVideo: true,
      },
    };

    const makeCall = async () => {
      call.current = await voximplant.call(user.name, callSettings);
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallStatus('Calling...');
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallStatus('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        navigation.goBack();
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    };

    const showError = reason => {
      showAlert(reason, 'danger');
      navigation.goBack();
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
    };
  }, [permissionGranted]);

  const onHangupPress = () => {
    call.current.hangup();
  };

  return (
    <Container>
      <BackButton onPress={goBack}>
        <FontAwesome5 name="arrow-left" color="white" size={25} />
      </BackButton>

      <RemoteVideo>
        <Voximplant.VideoView
          videoStreamId={remoteVideoStreamId}
          scaleType={Voximplant.RenderScaleType.SCALE_FIT}
        />
      </RemoteVideo>

      {sendVideo && (
        <LocalVideo>
          <Voximplant.VideoView
            videoStreamId={localVideoStreamId}
            scaleType={Voximplant.RenderScaleType.SCALE_FIT}
            showOnTop={true}
          />
        </LocalVideo>
      )}

      <CameraPreview>
        <NameUser>{user?.displayname}</NameUser>
        <PhoneNumber>{callStatus}</PhoneNumber>
      </CameraPreview>

      <CallActionBox
        onHangupPress={onHangupPress}
        onChangeCamera={onChangeCamera}
      />
    </Container>
  );
};

export default CallingScreen;
