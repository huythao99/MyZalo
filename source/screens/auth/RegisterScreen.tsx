import * as React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {
  BLACK,
  BLUE_GRAY,
  BLUE_GRAY_200,
  LIGHT_BLUE_A700,
  RED_A400,
  WHITE,
} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigator';

type FormValues = {
  fullname: string;
};

type ButtonProps = {
  isActive?: Boolean;
};

type RegisterScreenProps = StackNavigationProp<RootStackParamList, 'Register'>;

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  justify-content: space-between;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 2}px;
`;

const TopContainer = styled.View``;

const TitleText = styled.Text`
  font-size: ${normalize(12)}px;
  font-weight: 700;
  color: ${BLACK};
`;

const InputText = styled.TextInput`
  font-size: ${normalize(13)}px;
  font-weight: 400;
  color: ${BLACK};
  padding: 0;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
  border-bottom-width: 1px;
  border-bottom-color: ${BLUE_GRAY};
  height: ${(HEIGHT_WINDOW / 100) * 5}px;
  width: 100%;
`;

const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${HEIGHT_WINDOW / 100 / 2}px;
`;

const ErrorText = styled.Text`
  font-size: ${normalize(12)}px;
  font-weight: 400;
  color: ${RED_A400};
  margin-left: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

const TitleNoticeText = styled(TitleText)`
  font-weight: 400;
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
`;

const Dot = styled.View`
  width: ${WIDHTH_WINDOW / 100}px;
  height: ${WIDHTH_WINDOW / 100}px;
  border-radius: ${WIDHTH_WINDOW / 100}px;
  background-color: ${BLACK};
  margin-right: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

const NoticeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const NoticeContentText = styled(TitleText)`
  font-weight: 400;
`;

const BottomContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ConfirmText = styled(TitleText)`
  font-weight: 400;
  color: ${BLACK};
  flex: 0.7;
`;

const NextButton = styled.TouchableOpacity`
  width: ${(WIDHTH_WINDOW / 100) * 12}px;
  height: ${(WIDHTH_WINDOW / 100) * 12}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 6}px;
  justify-content: center;
  align-items: center;
  background-color: ${(props: ButtonProps) =>
    props.isActive ? BLUE_GRAY_200 : LIGHT_BLUE_A700};
`;

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();
  const navigation = useNavigation<RegisterScreenProps>();

  const onSubmit: SubmitHandler<FormValues> = data => {
    navigation.navigate('LastRegister', {
      name: data.fullname,
    });
  };

  return (
    <Container>
      <TopContainer>
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập tên của bạn',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <TitleText>Tên Zalo</TitleText>
              <InputText
                autoCapitalize={'words'}
                placeholder={'Gồm 2 - 40 kí tự'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.fullname && (
                <ErrorContainer>
                  <FontAwesome5
                    color={RED_A400}
                    name={'exclamation-circle'}
                    size={(WIDHTH_WINDOW / 100) * 4}
                  />
                  <ErrorText>{errors.fullname?.message}</ErrorText>
                </ErrorContainer>
              )}
            </>
          )}
          name="fullname"
        />
        <TitleNoticeText>Lưu ý khi đặt tên:</TitleNoticeText>
        <NoticeContainer>
          <Dot />
          <NoticeContentText>
            Không vi phạm quy định đặt tên trên zalo
          </NoticeContentText>
        </NoticeContainer>
        <NoticeContainer>
          <Dot />
          <NoticeContentText>
            Nên sử dụng tên thật để giúp bạn bè dễ nhận ra
          </NoticeContentText>
        </NoticeContainer>
      </TopContainer>
      <BottomContainer>
        <ConfirmText>
          Tiếp tục nghĩa là bạn đồng ý với các điều khoản sử dụng zalo
        </ConfirmText>
        <NextButton onPress={handleSubmit(onSubmit)}>
          <FontAwesome5
            name={'arrow-right'}
            color={WHITE}
            size={(WIDHTH_WINDOW / 100) * 4.5}
          />
        </NextButton>
      </BottomContainer>
    </Container>
  );
}
