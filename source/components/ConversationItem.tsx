import * as React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {BLACK, BLUE_GRAY, GREY_700} from '../constants/COLOR';
import {HEIGHT_WINDOW, normalize, WIDHTH_WINDOW} from '../constants/Dimensions';
import {Conversation} from '../constants/Types';
import {timeAgo} from '../ultities/Ultities';

interface ConversationItemProps {
  item: Conversation;
  uid: string;
  onClickItem: (
    friendID: string,
    friendAvatar: string,
    friendName: string,
    friendEmail: string,
  ) => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 2}px;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  border-top-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const LeftContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const AvatarImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 15}px;
  height: ${(WIDHTH_WINDOW / 100) * 15}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 8}px;
  resize-mode: cover;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const ContentMessageText = styled.Text`
  font-size: ${normalize(12)}px;
  color: ${GREY_700};
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const ContentTimeText = styled(ContentMessageText)`
  margin-horizontal: 0px;
`;

function ConversationItem(props: ConversationItemProps) {
  return (
    <Container
      onPress={() =>
        props.onClickItem(
          props.uid === props.item.sender.id
            ? props.item.receiver.id
            : props.item.sender.id,
          props.uid === props.item.sender.id
            ? props.item.receiver.avatar
            : props.item.sender.avatar,
          props.uid === props.item.sender.id
            ? props.item.receiver.name
            : props.item.sender.name,
          props.uid === props.item.sender.id
            ? props.item.receiver.email
            : props.item.sender.email,
        )
      }>
      <LeftContainer>
        <AvatarImage
          source={{
            uri:
              props.uid === props.item.sender.id
                ? props.item.receiver.avatar
                : props.item.sender.avatar,
          }}
        />
        <View>
          <UserNameText numberOfLine={1}>
            {props.uid === props.item.sender.id
              ? props.item.receiver.name
              : props.item.sender.name}
          </UserNameText>
          <ContentMessageText>
            {props.item.content !== ''
              ? props.item.content
              : props.item.uriImage
              ? 'Đã gửi 1 ảnh'
              : 'Đã gửi 1 video'}
          </ContentMessageText>
        </View>
      </LeftContainer>
      <ContentTimeText>{timeAgo(props.item.time)}</ContentTimeText>
    </Container>
  );
}

export default React.memo(ConversationItem);
