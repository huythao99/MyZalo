import * as React from 'react';
import {MessageItem} from '../constants/Types';
import styled from 'styled-components/native';
import {HEIGHT_WINDOW, normalize, WIDHTH_WINDOW} from '../constants/Dimensions';
import {
  BLACK,
  BLUE_GRAY,
  BLUE_GRAY_200,
  LIGHT_BLUE,
  WHITE,
} from '../constants/COLOR';

interface MessageItemProps {
  item: MessageItem;
  userID: string;
  isLastMessage: Boolean;
}

type ContainerProps = {
  isMessageOfFriend: Boolean;
};

const Container = styled.View`
  flex-direction: row;
  justify-content: ${(props: ContainerProps) =>
    props.isMessageOfFriend ? 'flex-start' : 'flex-end'};
  margin-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
`;

const UserImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 10}px;
  height: ${(WIDHTH_WINDOW / 100) * 10}px;
  resize-mode: cover;
  border-radius: ${(WIDHTH_WINDOW / 100) * 6}px;
`;

const MessageFriendContainer = styled.View`
  max-width: ${(WIDHTH_WINDOW / 100) * 70}px;
  background-color: ${BLUE_GRAY};
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 2}px;
  margin-horizontal: ${WIDHTH_WINDOW / 100}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 3}px;
  padding-vertical: ${HEIGHT_WINDOW / 100 / 2}px;
`;

const MessageFriendText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
`;

const MessageImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 60}px;
  height: ${(WIDHTH_WINDOW / 100) * 70}px;
  resize-mode: cover;
  margin-top: ${HEIGHT_WINDOW / 100}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

const MessageUserContainer = styled(MessageFriendContainer)`
  background-color: ${LIGHT_BLUE};
`;

const MessageUserText = styled(MessageFriendText)`
  color: ${WHITE};
`;

function MessageItemRender(props: MessageItemProps) {
  return (
    <Container isMessageOfFriend={props.item.sender.id !== props.userID}>
      {props.item.sender.id !== props.userID ? (
        <>
          <UserImage source={{uri: props.item.sender.avatar}} />
          <MessageFriendContainer>
            <MessageFriendText>{props.item.content}</MessageFriendText>
            {props.item.urlImage && (
              <MessageImage source={{uri: props.item.urlImage}} />
            )}
          </MessageFriendContainer>
        </>
      ) : (
        <>
          <MessageUserContainer>
            <MessageUserText>{props.item.content}</MessageUserText>
            {props.item.urlImage && (
              <MessageImage source={{uri: props.item.urlImage}} />
            )}
          </MessageUserContainer>
        </>
      )}
    </Container>
  );
}

export default React.memo(MessageItemRender);
