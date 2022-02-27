import * as React from 'react';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {
  BLACK,
  BLUE_GRAY,
  BLUE_GRAY_200,
  LIGHT_BLUE,
  WHITE,
} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import {showAlert, sortID} from '../../ultities/Ultities';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {FlatList} from 'react-native';
import {
  requestSendMessage,
  requestUpdateConversation,
} from '../../features/main/messageSlice';
import MessageItemRender from '../../components/MessageItem';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigator';

interface ChatProps {
  route: {
    params: {
      friendID: string;
      friendAvatar: string;
      friendName: string;
      friendEmail?: string;
    };
  };
}

type ChatScreenProps = StackNavigationProp<RootStackParamList, 'Chat'>;

type FormValues = {
  content: string;
};

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 1.5}px;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  border-bottom-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const BackButton = styled.TouchableOpacity`
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 3}px;
`;

const UserButton = styled.TouchableOpacity`
  flex-direction: row;
  flex: 1;
  align-items: center;
  margin-left: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

const UserHeaderImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 12}px;
  height: ${(WIDHTH_WINDOW / 100) * 12}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 8}px;
  resize-mode: cover;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
  flex: 1;
`;

const ToolButton = styled(BackButton)``;

const BottomContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 1.75}px;
  border-top-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const InputContainer = styled.View`
  flex: 1;
  border-width: 1px;
  border-color: ${BLUE_GRAY_200}};
  border-radius: ${(WIDHTH_WINDOW / 100) * 12}px;
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

const InputText = styled.TextInput`
  width: 100%;
  padding-vertical: 0px;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
  height: ${(HEIGHT_WINDOW / 100) * 3.5}px;
  font-size: ${normalize(12)}px;
  font-weight: 400;
  color: ${BLACK};
`;

const ButtonImageChoose = styled.TouchableOpacity``;
const ImageChoose = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 20}px;
  height: ${(WIDHTH_WINDOW / 100) * 20}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 2}px;
  resize-mode: cover;
`;

export default function ChatScreen(props: ChatProps) {
  const navigation = useNavigation<ChatScreenProps>();
  const userID = useAppSelector(state => state.auth.uid);
  const userAvatar = useAppSelector(state => state.auth.photoURL);
  const userName = useAppSelector(state => state.auth.username);
  const userEmail = useAppSelector(state => state.auth.email);
  const dispatch = useAppDispatch();
  const {control, handleSubmit, resetField} = useForm<FormValues>();
  const [listMessage, setListMessage] = React.useState([]);
  const [uriImage, setUriImage] = React.useState(null);
  const [uriVideo, setUriVideo] = React.useState(null);

  const onBack = () => {
    navigation.goBack();
  };

  const onCall = () => {
    navigation.navigate('Calling', {
      user: {
        name: props.route.params.friendEmail.substring(
          0,
          props.route.params.friendEmail.lastIndexOf('@'),
        ),
        avatar: props.route.params.friendAvatar,
        displayname: props.route.params.friendName,
      },
      sendVideo: false,
    });
  };

  const onVideoCall = () => {
    navigation.navigate('Calling', {
      user: {
        name: props.route.params.friendEmail.substring(
          0,
          props.route.params.friendEmail.lastIndexOf('@'),
        ),
        avatar: props.route.params.friendAvatar,
        displayname: props.route.params.friendName,
      },
      sendVideo: true,
    });
  };

  const onShowProfile = () => {
    navigation.navigate('Profile', {
      uid: props.route.params.friendID,
    });
  };

  const onOpenCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.9,
        cameraType: 'back',
      },
      response => {
        if (response.assets) {
          setUriImage(response.assets[0].uri);
        }
      },
    );
  };

  const onOpenLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.9,
      },
      response => {
        if (response.assets) {
          setUriImage(response.assets[0].uri);
        }
      },
    );
  };

  const onDeleteImage = () => {
    setUriImage(null);
  };

  const onSendMessage: SubmitHandler<FormValues> = async data => {
    if (data.content === '' && !uriImage && !uriVideo) {
      return;
    }
    const timeNow = Date.now();
    await dispatch(
      requestSendMessage({
        content: data.content,
        uriImage,
        uriVideo,
        time: timeNow,
        sender: {
          id: userID,
          avatar: userAvatar,
          name: userName,
          email: userEmail,
        },
        receiver: {
          id: props.route.params.friendID,
          name: props.route.params.friendName,
          avatar: props.route.params.friendAvatar,
          email: props.route.params.friendEmail,
        },
      }),
    );
    resetField('content');
    setUriImage(null);
    dispatch(
      requestUpdateConversation({
        content: data.content,
        uriImage,
        uriVideo,
        time: timeNow,
        sender: {
          id: userID,
          avatar: userAvatar,
          name: userName,
          email: userEmail,
        },
        receiver: {
          id: props.route.params.friendID,
          name: props.route.params.friendName,
          avatar: props.route.params.friendAvatar,
          email: props.route.params.friendEmail,
        },
      }),
    );
  };

  const renderItem = ({item, index}) => {
    const isLastMessage =
      item.sender.id === listMessage[index - 1]?.sender?.id &&
      item.sender.id !== listMessage[index + 1]?.sender?.id;
    return (
      <MessageItemRender
        item={item}
        userID={userID}
        isLastMessage={isLastMessage}
      />
    );
  };

  React.useEffect(() => {
    const unsubcribe = firestore()
      .collection('Messages')
      .doc(sortID(userID, props.route.params.friendID))
      .collection('Message')
      .onSnapshot(querySnapshot => {
        let arrayMessage = [];
        querySnapshot.forEach(documentSnapshot => {
          arrayMessage.push(documentSnapshot.data());
        });
        const lastArrayMessage = arrayMessage.sort((a, b) => b.time - a.time);
        setListMessage(lastArrayMessage);
      });
    return () => unsubcribe();
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <BackButton onPress={onBack}>
          <FontAwesome5
            name={'arrow-left'}
            size={(WIDHTH_WINDOW / 100) * 5}
            color={LIGHT_BLUE}
          />
        </BackButton>
        <UserButton>
          <UserHeaderImage source={{uri: props.route.params.friendAvatar}} />
          <UserNameText>{props.route.params.friendName}</UserNameText>
        </UserButton>
        <ToolButton onPress={onCall}>
          <FontAwesome5
            name={'phone-alt'}
            color={LIGHT_BLUE}
            size={(WIDHTH_WINDOW / 100) * 5}
          />
        </ToolButton>
        <ToolButton onPress={onVideoCall}>
          <FontAwesome5
            name={'video'}
            color={LIGHT_BLUE}
            size={(WIDHTH_WINDOW / 100) * 5}
          />
        </ToolButton>
        <ToolButton onPress={onShowProfile}>
          <FontAwesome5
            name={'info-circle'}
            color={LIGHT_BLUE}
            size={(WIDHTH_WINDOW / 100) * 5}
          />
        </ToolButton>
      </HeaderContainer>
      <FlatList
        data={listMessage}
        renderItem={renderItem}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={(_, index) => index.toString()}
        inverted={true}
      />
      <BottomContainer>
        <ToolButton onPress={onOpenCamera}>
          <FontAwesome5
            name={'camera'}
            color={LIGHT_BLUE}
            size={(WIDHTH_WINDOW / 100) * 4.5}
          />
        </ToolButton>
        <ToolButton onPress={onOpenLibrary}>
          <FontAwesome5
            name={'image'}
            color={LIGHT_BLUE}
            size={(WIDHTH_WINDOW / 100) * 4.5}
          />
        </ToolButton>
        <ToolButton>
          <FontAwesome5
            name={'microphone'}
            color={LIGHT_BLUE}
            size={(WIDHTH_WINDOW / 100) * 4.5}
          />
        </ToolButton>
        <Controller
          name="content"
          control={control}
          render={({field: {value, onChange}}) => {
            return (
              <InputContainer>
                <InputText
                  value={value}
                  onChangeText={onChange}
                  placeholder={'Aa'}
                />
              </InputContainer>
            );
          }}
        />
        <ToolButton onPress={handleSubmit(onSendMessage)}>
          <FontAwesome5
            name={'paper-plane'}
            solid={true}
            color={LIGHT_BLUE}
            size={(WIDHTH_WINDOW / 100) * 4.5}
          />
        </ToolButton>
      </BottomContainer>
      {uriImage !== null && (
        <BottomContainer>
          <ButtonImageChoose onPress={onDeleteImage}>
            <ImageChoose source={{uri: uriImage}} />
          </ButtonImageChoose>
        </BottomContainer>
      )}
    </Container>
  );
}
