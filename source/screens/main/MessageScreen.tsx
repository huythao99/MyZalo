import * as React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {requestLogout} from '../../features/auth/authSlice';
import styled from 'styled-components/native';
import {BLACK, BLUE_GRAY, BLUE_GRAY_200, WHITE} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {requestListConversation} from '../../features/main/messageSlice';
import ConversationItem from '../../components/ConversationItem';
import {Conversation} from '../../constants/Types';

type FormValues = {
  search: string;
};

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const SearchContainer = styled.View`
  flex-direction: row;
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 5}px;
  background-color: ${BLUE_GRAY};
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
  align-items: center;
  margin-vertical: ${(HEIGHT_WINDOW / 100) * 2}px;
`;

const InputText = styled.TextInput`
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
  padding-vertical: 0px;
  height: ${(HEIGHT_WINDOW / 100) * 5}px;
  font-weight: 400;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
  flex: 1;
`;

const SearchButton = styled.TouchableOpacity`
  padding: ${WIDHTH_WINDOW / 100}px;
`;

const ContainerTitleText = styled(Container)`
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.Text`
  font-size: ${normalize(16)}px;
  font-weight: 700;
  color: ${BLUE_GRAY_200};
`;

export default function MessageScreen() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.uid);
  const listConversation = useAppSelector(state => state.message.conversation);
  const {control, handleSubmit} = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = data => {};

  const renderItem = ({item}: {item: Conversation}) => {
    return <ConversationItem item={item} />;
  };

  const getData = () => {
    dispatch(requestListConversation({uid: userId}));
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <Container>
      <Controller
        control={control}
        name={'search'}
        render={({field: {onChange, value}}) => {
          return (
            <SearchContainer>
              <InputText
                value={value}
                placeholder={'Tìm kiếm'}
                onChangeText={onChange}
              />
              <SearchButton onPress={onSubmit}>
                <FontAwesome5
                  name={'search'}
                  size={(WIDHTH_WINDOW / 100) * 5}
                  color={BLUE_GRAY_200}
                />
              </SearchButton>
            </SearchContainer>
          );
        }}
      />
      {listConversation.length === 0 ? (
        <ContainerTitleText>
          <TitleText>Hãy bắt đầu cuộc trò chuyện của bạn</TitleText>
        </ContainerTitleText>
      ) : (
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={listConversation}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </Container>
  );
}
