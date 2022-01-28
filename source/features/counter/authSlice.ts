import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import auth from '@react-native-firebase/auth';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {showAlert} from '../../ultities/Ultities';
import firestore from '@react-native-firebase/firestore';
import {User} from '../../constants/Types';

// Define a type for the slice state
interface AuthState {
  existUser: boolean;
  isLoadingSplash: boolean;
  username: string;
  uid: string;
  email: string;
  password: string;
  photoURL: string;
  isLoading: Boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  existUser: false,
  isLoadingSplash: true,
  username: '',
  uid: '',
  email: '',
  password: '',
  photoURL: '',
  isLoading: false,
};

export const createUser = createAsyncThunk(
  'auth/createUser',
  async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<Partial<User>> => {
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const update = {
        displayName: username,
        photoURL:
          'https://scontent.fhan5-4.fna.fbcdn.net/v/t1.15752-9/240974152_277625863860238_4251757873495375724_n.png?_nc_cat=104&ccb=1-5&_nc_sid=ae9488&_nc_ohc=iUmCsMMItawAX8yB09V&_nc_ht=scontent.fhan5-4.fna&oh=03_AVIcVXLMLuuEdn67A_oLy6fzv9o0xpWB4a-6gcH4BT8pSQ&oe=62164F89',
      };

      await auth().currentUser.updateProfile(update);
      const userInfo = response.user;
      const result = {
        status: true,
        uid: userInfo.uid,
        userEmail: userInfo.email,
        userPassword: password,
        username: username,
        photoURL: update.photoURL,
      };
      await firestore().collection('Users').doc(result.uid).set(result);
      await AsyncStorageLib.setItem('user', JSON.stringify(result));
      showAlert('Tạo tài khoản thành công', 'success');
      return new Promise(resolve => {
        resolve({
          ...result,
        });
      });
    } catch (error) {
      showAlert(error.message, 'danger');
      return new Promise(resolve => {
        resolve({
          status: false,
        });
      });
    }
  },
);

export const requestLogin = createAsyncThunk(
  'auth/requestLogin',
  async ({
    userEmail,
    userPassword,
  }: {
    userEmail: string;
    userPassword: string;
  }): Promise<Partial<User>> => {
    try {
      const response = await auth().signInWithEmailAndPassword(
        userEmail,
        userPassword,
      );
      const userInfo = response.user;
      const result = {
        status: true,
        uid: userInfo.uid,
        userEmail: userInfo.email,
        userPassword: userPassword,
        username: userInfo.displayName,
        photoURL: userInfo.photoURL,
      };
      await AsyncStorageLib.setItem('user', JSON.stringify(result));
      showAlert('Chào mừng bạn đến với MyZalo', 'success');
      return new Promise(resolve => {
        resolve({
          status: true,
          ...result,
        });
      });
    } catch (error) {
      showAlert('Tài khoản hoặc mật khẩu không chính xác', 'danger');
      return new Promise(resolve => {
        resolve({
          status: false,
        });
      });
    }
  },
);

export const requestAutoLogin = createAsyncThunk(
  'auth/requestAutoLogin',
  async (): Promise<Partial<User>> => {
    try {
      const user = await AsyncStorageLib.getItem('user');
      const userInfo = JSON.parse(user);
      const res = await auth().signInWithEmailAndPassword(
        userInfo.userEmail,
        userInfo.userPassword,
      );
      showAlert('Chào mừng bạn đến với MyZalo', 'success');
      return new Promise(resolve => {
        resolve({
          status: true,
          ...userInfo,
        });
      });
    } catch (error) {
      // showAlert('Tài khoản hoặc mật khẩu không chính xác', 'danger');
      return new Promise(resolve => {
        resolve({
          status: false,
        });
      });
    }
  },
);

export const requestLogout = createAsyncThunk(
  'auth/requestLogout',
  async (): Promise<Partial<User>> => {
    try {
      await auth().signOut();
      await AsyncStorageLib.removeItem('user');
      showAlert('Tạm biệt, hẹn gặp lại', 'success');
      return new Promise(resolve => {
        resolve({
          status: true,
        });
      });
    } catch (error) {
      showAlert(error.message, 'danger');
      return new Promise(resolve => {
        resolve({
          status: false,
        });
      });
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loadingSplash: state => {
      state.isLoadingSplash = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(createUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.uid = action.payload.uid;
        state.username = action.payload.username;
        state.photoURL = action.payload.photoURL;
        state.password = action.payload.userPassword;
        state.existUser = true;
      }
      state.isLoading = false;
    });
    builder.addCase(createUser.rejected, state => {
      state.isLoading = false;
    });
    // login
    builder.addCase(requestLogin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(requestLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status) {
        state.existUser = true;
        state.uid = action.payload.uid;
        state.username = action.payload.username;
        state.photoURL = action.payload.photoURL;
        state.password = action.payload.userPassword;
      }
    });
    builder.addCase(requestLogin.rejected, state => {
      state.isLoading = false;
    });
    // auto login
    builder.addCase(requestAutoLogin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(requestAutoLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoadingSplash = false;
      if (action.payload.status) {
        state.existUser = true;
        state.uid = action.payload.uid;
        state.username = action.payload.username;
        state.photoURL = action.payload.photoURL;
        state.password = action.payload.userPassword;
      }
    });
    builder.addCase(requestAutoLogin.rejected, state => {
      state.isLoading = false;
      state.isLoadingSplash = false;
    });
    builder.addCase(requestLogout.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(requestLogout.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status) {
        state.existUser = false;
        state.isLoadingSplash = false;
        state.password = '';
        state.photoURL = '';
        state.email = '';
        state.uid = '';
        state.username = '';
      }
    });
    builder.addCase(requestLogout.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {loadingSplash} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLoadingSplash = (state: RootState) =>
  state.auth.isLoadingSplash;

export default authSlice.reducer;
