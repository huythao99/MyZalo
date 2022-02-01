import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {requestLogout} from '../../features/auth/authSlice';
import styled from 'styled-components/native';
import {
  BLACK,
  BLUE_GREY_50,
  GREY_600,
  LIGHT_BLUE,
  WHITE,
} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigator';

type PersonalScreenProps = StackNavigationProp<RootStackParamList, 'Personal'>;

const UserContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${WHITE};
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 2}px;
  margin-bottom: ${HEIGHT_WINDOW / 100}px;
`;

const UserAvatarImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 12}px;
  height: ${(WIDHTH_WINDOW / 100) * 12}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 6}px;
  resize-mode: cover;
`;

const UserNameText = styled.Text`
  font-size: ${normalize(13)}px;
  color: ${BLACK};
  margin-left: ${(WIDHTH_WINDOW / 100) * 3}px;
`;

const UserTitle = styled.Text`
  font-size: ${normalize(11)}px;
  color: ${GREY_600};
  margin-left: ${(WIDHTH_WINDOW / 100) * 3}px;
`;

const RowButton = styled(UserContainer)``;
const TitleButton = styled(UserNameText)``;
const DetailButton = styled(UserTitle)``;

export default function PersonalScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<PersonalScreenProps>();
  const userAvatar = useAppSelector(state => state.auth.photoURL);
  const userName = useAppSelector(state => state.auth.username);
  const userId = useAppSelector(state => state.auth.uid);

  const onShowProfileScreen = () => {
    navigation.navigate('Profile', {uid: userId});
  };

  const onLogout = () => {
    dispatch(requestLogout());
  };
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: BLUE_GREY_50}}>
      <UserContainer onPress={onShowProfileScreen}>
        <UserAvatarImage source={{uri: userAvatar}} />
        <View>
          <UserNameText>{userName}</UserNameText>
          <UserTitle>Xem trang cá nhân</UserTitle>
        </View>
      </UserContainer>
      <RowButton>
        <FontAwesome5
          name={'wallet'}
          color={LIGHT_BLUE}
          size={(WIDHTH_WINDOW / 100) * 4.5}
        />
        <View>
          <TitleButton>Ví QR</TitleButton>
          <DetailButton>
            Lưu trữ và xuất trình các mã QR quan trọng
          </DetailButton>
        </View>
      </RowButton>
      <RowButton>
        <FontAwesome5
          name={'cloud'}
          color={LIGHT_BLUE}
          size={(WIDHTH_WINDOW / 100) * 4.5}
        />
        <View>
          <TitleButton>Cloud của tôi</TitleButton>
          <DetailButton>Lưu trữ các tin nhắn quan trọng</DetailButton>
        </View>
      </RowButton>
      <RowButton>
        <FontAwesome5
          name={'shield-alt'}
          color={LIGHT_BLUE}
          size={(WIDHTH_WINDOW / 100) * 4.5}
        />
        <View>
          <TitleButton>Tài khoản và bảo mật</TitleButton>
        </View>
      </RowButton>
      <RowButton>
        <FontAwesome5
          name={'lock'}
          color={LIGHT_BLUE}
          size={(WIDHTH_WINDOW / 100) * 4.5}
        />
        <View>
          <TitleButton>Quyền riêng tư</TitleButton>
        </View>
      </RowButton>
      <RowButton onPress={onLogout}>
        <FontAwesome5
          name={'sign-out-alt'}
          color={LIGHT_BLUE}
          size={(WIDHTH_WINDOW / 100) * 4.5}
        />
        <View>
          <TitleButton>Đăng xuất</TitleButton>
        </View>
      </RowButton>
    </ScrollView>
  );
}
