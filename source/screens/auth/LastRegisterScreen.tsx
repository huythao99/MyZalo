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
import {REGEX_EMAIL} from '../../constants/Regex';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {createUser} from '../../features/auth/authSlice';
import LoadingScreen from '../../components/LoadingScreen';

type FormValues = {
  email: string;
  password: string;
};

type ButtonProps = {
  isActive?: Boolean;
};

interface LastRegisterProps {
  route: {
    params: {
      name: string;
    };
  };
}

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
  margin-top: ${HEIGHT_WINDOW / 100}px;
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

export default function LastRegisterScreen(props: LastRegisterProps) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.auth.isLoading);

  const onSubmit: SubmitHandler<FormValues> = data => {
    dispatch(
      createUser({
        username: props.route.params.name,
        email: data.email,
        password: data.password,
      }),
    );
  };

  return (
    <Container>
      <TopContainer>
        <Controller
          control={control}
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
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <TitleText>Email</TitleText>
              <InputText
                placeholder={'email'}
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
                    size={(WIDHTH_WINDOW / 100) * 4}
                  />
                  <ErrorText>{errors.email?.message}</ErrorText>
                </ErrorContainer>
              )}
            </>
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập password',
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
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <TitleText>PassWord</TitleText>
              <InputText
                placeholder={'password'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize={'none'}
                secureTextEntry={true}
              />
              {errors.password && (
                <ErrorContainer>
                  <FontAwesome5
                    color={RED_A400}
                    name={'exclamation-circle'}
                    size={(WIDHTH_WINDOW / 100) * 4}
                  />
                  <ErrorText>{errors.password?.message}</ErrorText>
                </ErrorContainer>
              )}
            </>
          )}
          name="password"
        />
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
      {isLoading && <LoadingScreen />}
    </Container>
  );
}
