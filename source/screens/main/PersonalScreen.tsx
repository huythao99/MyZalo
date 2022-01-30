import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useAppDispatch} from '../../app/hook';
import {requestLogout} from '../../features/auth/authSlice';

export default function PersonalScreen() {
  const dispatch = useAppDispatch();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          dispatch(requestLogout());
        }}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
