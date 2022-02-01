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
    uriVideo,
  }: {
    userName: string;
    uid: string;
    content: string;
    uriImage: string | null;
    userAvatar: string;
    uriVideo: string | null;
  }): Promise<Partial<Post>> => {
    try {
      const timeNow = Date.now();
      let urlImage = null;
      if (uriImage) {
        const reference = storage().ref(`post/${uid}_${timeNow}_${uriImage}`);
        await reference.putFile(uriImage);
        urlImage = await reference.getDownloadURL();
      }
      const post = {
        timeCreate: timeNow,
        id: `${uid}_${timeNow}`,
        posterId: `${uid}`,
        posterAvatar: userAvatar,
        posterName: userName,
        content: content,
        uriImage: urlImage,
        numOfShare: 0,
        numOfComment: 0,
        listUserLike: [],
        uriVideo: uriVideo,
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

export const requestLikePost = createAsyncThunk(
  'post/requestLikePost',
  async ({postID, userID}: {postID: string; userID: string}) => {
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async documentSnapshot => {
          if (documentSnapshot.data().id === postID) {
            let newListUserLike = [];
            const index = documentSnapshot
              .data()
              .listUserLike.findIndex((item: string) => item === userID);
            if (index === -1) {
              newListUserLike = [
                ...documentSnapshot.data().listUserLike,
                userID,
              ];
            } else {
              newListUserLike = documentSnapshot
                .data()
                .listUserLike.filter((item: string) => item !== userID);
            }
            firestore()
              .collection('Posts')
              .doc(documentSnapshot.id)
              .update({
                listUserLike: newListUserLike,
              })
              .then(() => {})
              .catch(error => {
                showAlert(error.message, 'danger');
              });
          }
        });
      })
      .catch(error => {
        showAlert(error.message, 'danger');
      });
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
