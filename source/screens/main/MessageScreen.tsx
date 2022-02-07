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
import ConversationItem from '../../components/ConversationItem';
import {Conversation} from '../../constants/Types';
import firestore from '@react-native-firebase/firestore';
import {RootStackParamList} from '../../navigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

type FormValues = {
  search: string;
};

type MessageScreenProps = StackNavigationProp<RootStackParamList, 'Message'>;

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
  const navigation = useNavigation<MessageScreenProps>();
  const userId = useAppSelector(state => state.auth.uid);
  const [listConversation, setListConversation] = React.useState([]);
  const {control, handleSubmit} = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = data => {};

  const onClickItem = (
    friendID: string,
    friendAvatar: string,
    friendName: string,
  ) => {
    navigation.navigate('Chat', {
      friendID,
      friendAvatar,
      friendName,
    });
  };

  const renderItem = ({item}: {item: Conversation}) => {
    return (
      <ConversationItem uid={userId} item={item} onClickItem={onClickItem} />
    );
  };

  React.useEffect(() => {
    const unsubcribe = firestore()
      .collection('Conversation')
      .onSnapshot(QuerySnapshot => {
        let listConversationData = [];
        QuerySnapshot.forEach(documentSnapshot => {
          if (
            documentSnapshot.data().sender.id === userId ||
            documentSnapshot.data().receiver.id === userId
          ) {
            listConversationData.push(documentSnapshot.data());
          }
        });
        const lastListConversation = listConversationData.sort(
          (a, b) => b.time - a.time,
        );
        setListConversation(lastListConversation);
      });
    return () => unsubcribe();
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
