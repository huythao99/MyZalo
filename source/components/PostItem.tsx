import * as React from 'react';
import styled from 'styled-components/native';
import {HEIGHT_WINDOW, normalize, WIDHTH_WINDOW} from '../constants/Dimensions';
import {
  BLACK,
  BLUE_A200,
  BLUE_GRAY,
  BLUE_GRAY_200,
  GREY_700,
  WHITE,
} from '../constants/COLOR';
import {timeAgo} from '../ultities/Ultities';
import {TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface PostItemProps {
  item: {
    timeCreate: number;
    posterId: string;
    posterAvatar: string;
    posterName: string;
    content: string;
    uriImage: string | null;
    numOfLike: number;
    numOfShare: number;
    numOfComment: number;
    listUserLike: Array<string>;
  };
}

type AlignSelfProps = {
  position: 'flex-start' | 'flex-end';
};

const Container = styled.View`
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
  padding-top: ${HEIGHT_WINDOW / 100}px;
  width: 100%;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  align-items: flex-start;
`;

const UserContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

const UserAvatarImage = styled.Image`
  width: ${(WIDHTH_WINDOW / 100) * 11}px;
  height: ${(WIDHTH_WINDOW / 100) * 11}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 6}px;
  resize-mode: cover;
  margin-right: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

const UserNameText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
`;

const TimeCreatedPostText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(11)}px;
  color: ${BLUE_GRAY_200};
`;

const ContentTextButton = styled.TouchableOpacity`
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
`;

const ContentText = styled.Text`
  font-weight: 400;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
`;

const ContentImageButton = styled.TouchableOpacity`
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
`;
const ContentImage = styled.Image`
  width: ${WIDHTH_WINDOW}px;
  height: ${(WIDHTH_WINDOW * 9) / 10}px;
  resize-mode: cover;
`;

const InfoReactionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${(WIDHTH_WINDOW / 100) * 4}px;
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
`;

const InfoReactionWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: ${(props: AlignSelfProps) => props.position};
`;

const InfoReactionText = styled.Text`
  font-size: ${normalize(12)}px;
  color: ${GREY_700};
  margin-left: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

const ReactionButtonContainer = styled.View`
  flex-direction: row;
  padding-vertical: ${HEIGHT_WINDOW / 100}px;
  border-top-width: 1px;
  border-color: ${BLUE_GRAY};
  align-items: center;
`;

const ReactionButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ReactionText = styled.Text`
  font-size: ${normalize(12)}px;
  color: ${GREY_700};
  margin-left: ${(WIDHTH_WINDOW / 100) * 2}px;
`;

function PostItem(props: PostItemProps) {
  return (
    <Container>
      <HeaderContainer>
        <UserContainer>
          <UserAvatarImage source={{uri: props.item.posterAvatar}} />
          <View>
            <UserNameText>{props.item.posterName}</UserNameText>
            <TimeCreatedPostText>
              {timeAgo(props.item.timeCreate)}
            </TimeCreatedPostText>
          </View>
        </UserContainer>
        <TouchableOpacity>
          <FontAwesome5
            name={'ellipsis-h'}
            size={(WIDHTH_WINDOW / 100) * 4.5}
          />
        </TouchableOpacity>
      </HeaderContainer>
      <ContentTextButton>
        <ContentText>{props.item.content}</ContentText>
      </ContentTextButton>
      {props.item.uriImage && (
        <ContentImageButton>
          <ContentImage source={{uri: props.item.uriImage}} />
        </ContentImageButton>
      )}
      <InfoReactionContainer>
        {props.item.numOfLike > 0 && (
          <InfoReactionWrap position={'flex-start'}>
            <FontAwesome5
              size={(WIDHTH_WINDOW / 100) * 4.5}
              color={BLUE_A200}
              name={'thumbs-up'}
            />
            <InfoReactionText>
              {props.item.numOfLike} lượt thích
            </InfoReactionText>
          </InfoReactionWrap>
        )}
        {props.item.numOfComment > 0 && (
          <InfoReactionWrap position={'flex-end'}>
            <InfoReactionText>
              {props.item.numOfLike} bình luận
            </InfoReactionText>
          </InfoReactionWrap>
        )}
        {props.item.numOfShare > 0 && (
          <InfoReactionWrap position={'flex-end'}>
            <InfoReactionText>{props.item.numOfLike} chia sẻ</InfoReactionText>
          </InfoReactionWrap>
        )}
      </InfoReactionContainer>
      <ReactionButtonContainer>
        <ReactionButton>
          <FontAwesome5
            size={(WIDHTH_WINDOW / 100) * 4.5}
            color={GREY_700}
            name={'thumbs-up'}
          />
          <ReactionText>Thích</ReactionText>
        </ReactionButton>
        <ReactionButton>
          <FontAwesome5
            size={(WIDHTH_WINDOW / 100) * 4.5}
            color={GREY_700}
            name={'comment'}
          />
          <ReactionText>Bình luận</ReactionText>
        </ReactionButton>
        <ReactionButton>
          <FontAwesome5
            size={(WIDHTH_WINDOW / 100) * 4.5}
            color={GREY_700}
            name={'share'}
          />
          <ReactionText>Chia sẻ</ReactionText>
        </ReactionButton>
      </ReactionButtonContainer>
    </Container>
  );
}

export default React.memo(PostItem);