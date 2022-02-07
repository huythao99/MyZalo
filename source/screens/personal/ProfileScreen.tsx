import * as React from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import PostItem from '../../components/PostItem';
import {BLACK, BLUE_GRAY, LIGHT_BLUE, WHITE} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import {requestGetDataUser} from '../../features/profile/profileSlice';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {showAlert} from '../../ultities/Ultities';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigator';
import {useNavigation} from '@react-navigation/native';

const FlatListAnimated = Animated.createAnimatedComponent(FlatList);
const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity);

interface HeaderProps {
  avatarUser: string;
  coverImage: string;
  userName: string;
  onPress: () => void;
  onShowAvatar: () => void;
}

type ProfileScreenProps = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileProps {
  route: {
    params: {
      uid: string;
    };
  };
}

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const AvatarImageContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  align-self: center;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 30}px;
  height: ${(WIDHTH_WINDOW / 100) * 30}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 18}px;
  border-width: 5px;
  border-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  background-color: ${WHITE};
  margin-bottom: ${HEIGHT_WINDOW / 100}px;
`;

const UserNameText = styled.Text`
  font-size: ${normalize(16)}px;
  font-weight: 700;
  color: ${BLACK};
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
`;

const HeaderFlatList = (props: HeaderProps) => {
  return (
    <HeaderContainer>
      {props.coverImage !== '' && (
        <Image
          source={{uri: props.coverImage}}
          style={{
            width: WIDHTH_WINDOW,
            height: WIDHTH_WINDOW * 0.8,
            marginBottom: (WIDHTH_WINDOW / 100) * 24,
          }}
          resizeMode="cover"
        />
      )}
      {props.avatarUser !== '' && (
        <AvatarImageContainer onPress={props.onShowAvatar}>
          <AvatarImage source={{uri: props.avatarUser}} />
          <UserNameText>{props.userName}</UserNameText>
        </AvatarImageContainer>
      )}
    </HeaderContainer>
  );
};

export default function ProfileScreen(props: ProfileProps) {
  const dispatch = useAppDispatch();
  const listPost = useAppSelector(state => state.profile.listPost);
  const userAvatar = useAppSelector(state => state.profile.profileAvatar);
  const coverImage = useAppSelector(state => state.profile.profileCoverImage);
  const userName = useAppSelector(state => state.profile.profileName);
  const userID = useAppSelector(state => state.auth.uid);
  const navigation = useNavigation<ProfileScreenProps>();

  const scrollY = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, 100],
      [0, (WIDHTH_WINDOW / 100) * 35],
    );
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.25]);

    return {
      opacity,
      transform: [
        {
          translateX,
        },
      ],
    };
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onChangeAvatar = () => {};

  const onShowAvatar = () => {
    Image.getSize(
      userAvatar,
      (width, height) => {
        navigation.navigate('ShowImage', {
          uriImage: userAvatar,
          width,
          height,
        });
      },
      error => {
        showAlert(error.message, 'danger');
      },
    );
  };

  const onClickSendMessage = () => {
    if (userID === props.route.params.uid) {
      showAlert('Chắc năng chat với chính mình đang phát triển', 'info');
    } else {
      navigation.navigate('Chat', {
        friendAvatar: userAvatar,
        friendName: userName,
        friendID: props.route.params.uid,
      });
    }
  };

  const getDataUser = () => {
    dispatch(requestGetDataUser(props.route.params.uid));
  };

  const renderItem = ({item}) => {
    return <PostItem uid={userID} item={item} onClickUserOfPost={() => {}} />;
  };

  React.useEffect(() => {
    getDataUser();
  }, []);

  return (
    <Container>
      <FlatListAnimated
        onScroll={onScroll}
        data={listPost}
        keyExtractor={(_, index: number) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{flexGrow: 1, backgroundColor: BLUE_GRAY}}
        ListHeaderComponent={() => (
          <HeaderFlatList
            userName={userName}
            coverImage={coverImage}
            avatarUser={userAvatar}
            onPress={onChangeAvatar}
            onShowAvatar={onShowAvatar}
          />
        )}
      />
      <ButtonAnimated
        onPress={onClickSendMessage}
        style={[
          {
            width: (WIDHTH_WINDOW / 100) * 13,
            height: (WIDHTH_WINDOW / 100) * 13,
            backgroundColor: LIGHT_BLUE,
            borderRadius: (WIDHTH_WINDOW / 100) * 7,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: (HEIGHT_WINDOW / 100) * 3,
            right: (WIDHTH_WINDOW / 100) * 4,
          },
          buttonAnimatedStyle,
        ]}>
        <FontAwesome5
          name={'facebook-messenger'}
          color={WHITE}
          size={(WIDHTH_WINDOW / 100) * 5}
        />
      </ButtonAnimated>
    </Container>
  );
}
