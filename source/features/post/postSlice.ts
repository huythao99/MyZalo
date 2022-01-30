import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import {showAlert} from '../../ultities/Ultities';
import {Post} from '../../constants/Types';
import storage from '@react-native-firebase/storage';

interface PostState {
  isLoading: Boolean;
  listPost: Array<PostItem>;
}

interface PostItem {
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
}

export const requestCreatePost = createAsyncThunk(
  'post/requestCreatePost',
  async ({
    userName,
    uid,
    content,
    uriImage,
    userAvatar,
  }: {
    userName: string;
    uid: string;
    content: string;
    uriImage: string | null;
    userAvatar: string;
  }): Promise<Partial<Post>> => {
    try {
      const timeNow = Date.now();

      const reference = storage().ref(`post/${uid}_${timeNow}_${uriImage}`);
      await reference.putFile(uriImage);
      const urlImage = await reference.getDownloadURL();
      const post = {
        timeCreate: timeNow,
        posterId: `${uid}_${timeNow}`,
        posterAvatar: userAvatar,
        posterName: userName,
        content: content,
        uriImage: urlImage,
        numOfLike: 0,
        numOfShare: 0,
        numOfComment: 0,
        listUserLike: [],
      };
      await firestore().collection('Posts').add(post);
      showAlert('Đăng bài thành công', 'success');
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

// Define the initial state using that type
const initialState: PostState = {
  isLoading: false,
  listPost: [],
};

export const postSlice = createSlice({
  name: 'post',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestCreatePost.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(requestCreatePost.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(requestCreatePost.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {} = postSlice.actions;

export default postSlice.reducer;
