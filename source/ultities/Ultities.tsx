import {Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const showAlert = (
  description: string,
  type: 'success' | 'warning' | 'danger' | 'info',
) => {
  showMessage({
    message: 'Thông báo',
    description,
    type: type,
    duration: 2000,
  });
};

export const sortID = (s1: string, s2: string) => {
  if (s1.localeCompare(s2) === 1) {
    return `${s2}_${s1}`;
  }
  return `${s1}_${s2}`;
};

export const timeAgo = (time: number) => {
  const now = Date.now();
  const ago = Math.round((now - time) / 1000);
  if (ago < 60) {
    return 'Vừa xong';
  } else if (ago < 3600) {
    return `${Math.round(ago / 60)} phút`;
  } else if (ago < 86400) {
    return `${Math.round(ago / 3600)} giờ`;
  } else if (ago < 86400 * 30) {
    return `${Math.round(ago / 86400)} ngày`;
  } else if (ago < 86400 * 30 * 12) {
    return `${Math.round(ago / (86400 * 30 * 12))} tháng`;
  } else return `${Math.round(ago / (86400 * 30))} năm`;
};

export const getUIDOfPost = (posterId: string, timeNow: number) => {
  return posterId.replace(`_${timeNow}`, '');
};

export const checkPermision = async (type: string) => {
  const platform = Platform.OS.toUpperCase();
  const response = await check(PERMISSIONS[platform][type]);
  let result = false;
  switch (response) {
    case RESULTS.UNAVAILABLE:
      showAlert('Thiết bị không hỗ trợ', 'warning');
      break;
    case RESULTS.DENIED:
      showAlert(
        'Quyền truy cập danh bạ đã bị từ chối, hãy vào cài đặt để cấp cho ứng dụng quyền truy cập danh bạ',
        'warning',
      );
      break;
    case RESULTS.LIMITED:
      showAlert(
        'The permission is limited: some actions are possible',
        'warning',
      );
      break;
    case RESULTS.GRANTED:
      result = true;
      break;
    case RESULTS.BLOCKED:
      showAlert(
        'The permission is denied and not requestable anymore',
        'warning',
      );
      break;
  }
  return result;
};

export const TypePermission = {
  contact: {
    ios: 'Contacts',
    android: 'READ_CONTACTS',
  },
};
