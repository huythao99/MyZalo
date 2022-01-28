import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import AppNavigator from './AppNavigator';
import {LIGHT_BLUE} from './source/constants/COLOR';
import {Provider} from 'react-redux';
import {store} from './source/app/store';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={LIGHT_BLUE} />
      <Provider store={store}>
        <AppNavigator />
      </Provider>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;
