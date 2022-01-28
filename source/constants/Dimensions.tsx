import {Dimensions, PixelRatio, Platform} from 'react-native';

export const WIDHTH_WINDOW = Dimensions.get('window').width;
export const HEIGHT_WINDOW = Dimensions.get('window').height;
const scale = WIDHTH_WINDOW / 320;
export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
