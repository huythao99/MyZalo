import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';
import {BLACK, BLUE_GRAY_200, WHITE} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigator';
import PostItem from '../../components/PostItem';
import firestore from '@react-native-firebase/firestore';
import {showAlert} from '../../ultities/Ultities';

interface HeaderProps {
  avatarUser: string;
  onPress: () => void;
}

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${WHITE};
  margin-bottom: ${HEIGHT_WINDOW / 100}px;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 2}px;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const AvatarUserImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 8}px;
  height: ${(WIDHTH_WINDOW / 100) * 8}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 5}px;
  resize-mode: cover;
`;

const CreatePostButton = styled.TouchableOpacity`
  flex: 1;
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 5}px;
  padding-vertical: ${HEIGHT_WINDOW / 100 / 1.25}px;
  border-width: 1px;
  border-color: ${BLUE_GRAY_200};
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const CreatePostText = styled.Text`
  font-size: ${normalize(12)}px;
  font-weight: 400;
  color: ${BLACK};
`;

const HeaderFlatList = (props: HeaderProps) => {
  return (
    <SearchContainer>
      <AvatarUserImage source={{uri: props.avatarUser}} />
      <CreatePostButton onPress={props.onPress}>
        <CreatePostText>Bạn đang nghĩ gì?</CreatePostText>
      </CreatePostButton>
    </SearchContainer>
  );
};

export default function HomeScreen() {
  const avatarUser = useAppSelector(state => state.auth.photoURL);
  const userID = useAppSelector(state => state.auth.uid);
  const [listPost, setListPost] = React.useState([]);
  const navigation = useNavigation<HomeScreenProps>();

  const onClickCreatePostButton = () => {
    navigation.navigate('CreatePost');
  };

  const onClickUserOfPost = (uid: string) => {
    navigation.navigate('Profile', {
      uid: uid,
    });
  };

  const renderItem = ({item}) => {
    return (
      <PostItem
        item={item}
        onClickUserOfPost={onClickUserOfPost}
        uid={userID}
      />
    );
  };

  React.useEffect(() => {
    const unsubcribe = firestore()
      .collection('Posts')
      .onSnapshot(
        querySnapshot => {
          let dataPost = [];
          querySnapshot.forEach(documentSnapshot => {
            dataPost.push(documentSnapshot.data());
          });
          dataPost.sort((a, b) => b.timeCreate - a.timeCreate);
          setListPost(dataPost);
        },
        error => {
          showAlert(error.message, 'danger');
        },
      );
    return () => unsubcribe();
  }, []);

  return (
    <FlatList
      data={listPost}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{flexGrow: 1, backgroundColor: BLUE_GRAY_200}}
      ListHeaderComponent={() => (
        <HeaderFlatList
          onPress={onClickCreatePostButton}
          avatarUser={avatarUser}
        />
      )}
    />
  );
}
