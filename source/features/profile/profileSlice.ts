import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultities/Ultities';
import firestore from '@react-native-firebase/firestore';
import {Message, Profile} from '../../constants/Types';

// Define a type for the slice state
interface ProfileState {
  listPost: Array<PostItem>;
  profileAvatar: string;
  profileCoverImage: string;
  profileName: string;
  isLoading: Boolean;
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

export const requestGetDataUser = createAsyncThunk(
  'profile/requestGetDataUser',
  async (uid: string): Promise<Partial<Profile>> => {
    try {
      let listPost = [];
      const userData = await firestore().collection('Users').doc(uid).get();
      const listPostResponse = await firestore().collection('Posts').get();
      listPostResponse.forEach(post => {
        if (post.data().posterId.indexOf(uid) !== -1) {
          listPost.push(post.data());
        }
      });
      const newListPost = listPost.sort(
        (a: PostItem, b: PostItem) => a.timeCreate - b.timeCreate,
      );
      return new Promise(resolve => {
        resolve({
          status: true,
          listPost: newListPost,
          profileAvatar: userData.data().photoURL,
          profileCoverImage: userData.data().coverImage,
          profileName: userData.data().username,
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
const initialState: ProfileState = {
  listPost: [],
  profileAvatar: '',
  profileCoverImage: '',
  profileName: '',
  isLoading: false,
};

export const profileSlice = createSlice({
  name: 'profile',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestGetDataUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(requestGetDataUser.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status) {
        state.listPost = action.payload.listPost;
        state.profileAvatar = action.payload.profileAvatar;
        state.profileCoverImage = action.payload.profileCoverImage;
        state.profileName = action.payload.profileName;
      }
    });
    builder.addCase(requestGetDataUser.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {} = profileSlice.actions;

export default profileSlice.reducer;
