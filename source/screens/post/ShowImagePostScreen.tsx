import * as React from 'react';
import styled from 'styled-components/native';
import {TRANSPARENT} from '../../constants/COLOR';
import {HEIGHT_WINDOW, WIDHTH_WINDOW} from '../../constants/Dimensions';

interface ShowImageProps {
  route: {
    params: {
      uriImage: string;
      width: number;
      height: number;
    };
  };
}

type ImageProps = {
  width: number;
  height: number;
};

const Container = styled.View`
  width: ${WIDHTH_WINDOW};
  height: ${HEIGHT_WINDOW};
  background-color: ${TRANSPARENT};
  justify-content: center;
`;

const ContentImage = styled.Image`
  width: ${WIDHTH_WINDOW}px;
  height: ${(props: ImageProps) =>
    (props.height * WIDHTH_WINDOW) / props.width}px;
`;

export default function ShowImagePostScreen(props: ShowImageProps) {
  return (
    <Container>
      <ContentImage
        source={{uri: props.route.params.uriImage}}
        width={props.route.params.width}
        height={props.route.params.height}
      />
    </Container>
  );
}
