import * as React from 'react';
import styled from 'styled-components/native';
import {HEIGHT_WINDOW} from '../constants/Dimensions';
import {Conversation} from '../constants/Types';

interface ConversationItemProps {
  item: Conversation;
}

const Container = styled.View`
  flex-direction: row;
  padding-vertical: ${(HEIGHT_WINDOW / 100) * 2}px;
  justify-content: space-between;
  align-items: center;
`;

function ConversationItem(props: ConversationItemProps) {
  return <Container></Container>;
}

export default React.memo(ConversationItem);
