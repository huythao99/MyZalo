import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {BLACK, BLUE_GRAY, LIGHT_BLUE, WHITE} from '../../constants/COLOR';
import {
  HEIGHT_WINDOW,
  normalize,
  WIDHTH_WINDOW,
} from '../../constants/Dimensions';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  useSharedValue,
  useAnimatedScrollHandler,
  SharedValue,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigator';
import LoadingScreen from '../../components/LoadingScreen';

type OnBoardingScreenProps = StackNavigationProp<
  RootStackParamList,
  'OnBoarding'
>;

const ScrollViewAnimated = Animated.createAnimatedComponent(ScrollView);

const DATA = [
  {
    source: require('../../assets/carousel1.jpg'),
  },
  {
    source: require('../../assets/carousel2.jpg'),
  },
  {
    source: require('../../assets/carousel3.jpg'),
  },
  {
    source: require('../../assets/carousel4.jpg'),
  },
  {
    source: require('../../assets/carousel5.jpg'),
  },
];

const CarouselImage = styled.Image`
  width: ${WIDHTH_WINDOW}px;
  height: ${(WIDHTH_WINDOW / 100) * 110}px;
`;

const IndicatorContainer = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: center;
`;

const TouchableButton = styled.TouchableOpacity`
  height: ${(HEIGHT_WINDOW / 100) * 5}px;
  width: ${(WIDHTH_WINDOW / 100) * 60}px;
  border-radius: ${(WIDHTH_WINDOW / 100) * 7}px;
  align-self: center;
  background-color: ${LIGHT_BLUE};
  margin-vertical: ${HEIGHT_WINDOW / 100}px;
  justify-content: center;
  align-items: center;
`;

const TitleButtonText = styled.Text`
  font-size: ${normalize(13)}px;
  font-weight: 700;
  color: ${WHITE};
`;

const TouchableRegisterButton = styled(TouchableButton)`
  background-color: ${BLUE_GRAY};
`;

const TitleRegisterButtonText = styled(TitleButtonText)`
  color: ${BLACK};
`;

const Indicator = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const indicatorStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      [
        WIDHTH_WINDOW * (index - 1),
        WIDHTH_WINDOW * index,
        WIDHTH_WINDOW * (index + 1),
      ],
      [WHITE, LIGHT_BLUE, WHITE],
    );
    return {
      backgroundColor,
    };
  }, []);
  return (
    <Animated.View
      style={[styles.indicator, indicatorStyle]}
      key={index.toString()}
    />
  );
};

export default function OnBoardingScreen() {
  const navigation = useNavigation<OnBoardingScreenProps>();
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onClickRegisterButton = () => {
    navigation.navigate('Register');
  };

  const onClickLoginButton = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollViewAnimated
        onScroll={onScroll}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}>
        {DATA.map((item, index) => {
          return (
            <CarouselImage
              source={item.source}
              key={index.toString()}
              resizeMod={'contain'}
            />
          );
        })}
      </ScrollViewAnimated>
      <IndicatorContainer>
        {DATA.map((_, index) => {
          return (
            <Indicator key={index.toString()} scrollX={scrollX} index={index} />
          );
        })}
      </IndicatorContainer>
      <TouchableButton onPress={onClickLoginButton}>
        <TitleButtonText>ĐĂNG NHẬP</TitleButtonText>
      </TouchableButton>
      <TouchableRegisterButton onPress={onClickRegisterButton}>
        <TitleRegisterButtonText>ĐĂNG KÝ</TitleRegisterButtonText>
      </TouchableRegisterButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: HEIGHT_WINDOW / 100,
    backgroundColor: WHITE,
  },
  indicator: {
    width: (WIDHTH_WINDOW / 100) * 3,
    height: (WIDHTH_WINDOW / 100) * 3,
    borderRadius: (WIDHTH_WINDOW / 100) * 3,
    marginHorizontal: (WIDHTH_WINDOW / 100) * 2,
    borderWidth: 1,
  },
});
