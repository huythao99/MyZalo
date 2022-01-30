import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {RootStackParamList} from '../../navigator';
import styled from 'styled-components/native';
import {
  BLACK,
  BLUE_GRAY,
  LIGHT_BLUE_A700,
  RED_A400,
  WHITE,
} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import {Controller, useForm, SubmitHandler} from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {REGEX_EMAIL} from '../../constants/Regex';
import LoadingScreen from '../../components/LoadingScreen';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {requestLogin} from '../../features/auth/authSlice';

type LoginScreenProps = StackNavigationProp<RootStackParamList, 'Login'>;

type FormValues = {
  email: string;
  password: string;
};

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
  justify-content: space-between;
  padding-bottom: ${(HEIGHT_WINDOW / 100) * 2}px;
`;

const TitleHeaderContainer = styled.View`
  flex-direction: row;
  background-color: ${BLUE_GRAY};
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  padding-vertical: ${HEIGHT_WINDOW / 100}px;
  margin-bottom: ${(HEIGHT_WINDOW / 100) * 2}px;
`;

const TitleHeaderText = styled.Text`
  font-size: ${normalize(11)}px;
  font-weight: 400;
  color: ${BLACK};
`;

const TopContainer = styled.View``;

const InputTextItem = styled.TextInput`
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  padding-vertical: ${HEIGHT_WINDOW / 100 / 2}px;
  font-size: ${normalize(14)}px;
  font-weight: 400;
  color: ${BLACK};
  border-bottom-width: 1px;
  border-bottom-color: ${BLUE_GRAY};
  margin-vertical: ${(HEIGHT_WINDOW / 100) * 2}px;
  height: ${(HEIGHT_WINDOW / 100) * 5}px;
`;

const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${HEIGHT_WINDOW / 100 / 2}px;
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const ErrorText = styled.Text`
  font-size: ${normalize(11)}px;
  font-weight: 400;
  color: ${RED_A400};
  margin-left: ${(WIDHTH_WINDOW / 100) * 1.5}px;
`;

const HighLightButton = styled.TouchableOpacity`
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const HighLightText = styled.Text`
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
  font-weight: 700;
  font-size: ${normalize(11)}px;
  color: ${LIGHT_BLUE_A700};
`;

const BottomContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const NextButton = styled.TouchableOpacity`
  width: ${(WIDHTH_WINDOW / 100) * 12}px;
  height: ${(WIDHTH_WINDOW / 100) * 12}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 6}px;
  justify-content: center;
  align-items: center;
  background-color: ${LIGHT_BLUE_A700};
`;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenProps>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.auth.isLoading);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();

  const onClickRegister = () => {
    navigation.push('Register');
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    dispatch(
      requestLogin({userEmail: data.email, userPassword: data.password}),
    );
  };

  return (
    <Container>
      <TopContainer>
        <TitleHeaderContainer>
          <TitleHeaderText>
            Vui lòng nhập email và mật khẩu để đăng nhập
          </TitleHeaderText>
        </TitleHeaderContainer>
        <Controller
          control={control}
          name="email"
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập email của bạn',
            },
            pattern: {
              value: REGEX_EMAIL,
              message: 'Vui lòng nhập email đúng định dạng',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <InputTextItem
                  placeholder={'Email'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType={'email-address'}
                  autoCapitalize="none"
                />
                {errors.email && (
                  <ErrorContainer>
                    <FontAwesome5
                      color={RED_A400}
                      name={'exclamation-circle'}
                      size={(WIDHTH_WINDOW / 100) * 3}
                    />
                    <ErrorText>{errors.email?.message}</ErrorText>
                  </ErrorContainer>
                )}
              </>
            );
          }}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập mật khẩu của bạn',
            },
            minLength: {
              value: 6,
              message: 'Mật khẩu trong khoảng tử 6 - 32 ký tự',
            },
            maxLength: {
              value: 32,
              message: 'Mật khẩu trong khoảng tử 6 - 32 ký tự',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <InputTextItem
                  placeholder={'Mật khẩu'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
                {errors.password && (
                  <ErrorContainer>
                    <FontAwesome5
                      color={RED_A400}
                      name={'exclamation-circle'}
                      size={(WIDHTH_WINDOW / 100) * 3}
                    />
                    <ErrorText>{errors.password?.message}</ErrorText>
                  </ErrorContainer>
                )}
              </>
            );
          }}
        />
        <HighLightButton>
          <HighLightText>Lấy lại mật khẩu</HighLightText>
        </HighLightButton>
        <HighLightButton onPress={onClickRegister}>
          <HighLightText>Bạn chưa có tài khoản? Đăng ký ngay</HighLightText>
        </HighLightButton>
      </TopContainer>
      <BottomContainer>
        <NextButton onPress={handleSubmit(onSubmit)}>
          <FontAwesome5
            name={'arrow-right'}
            color={WHITE}
            size={(WIDHTH_WINDOW / 100) * 4.5}
          />
        </NextButton>
      </BottomContainer>
      {isLoading && <LoadingScreen />}
    </Container>
  );
}
