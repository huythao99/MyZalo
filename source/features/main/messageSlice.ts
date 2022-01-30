import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultities/Ultities';
import firestore from '@react-native-firebase/firestore';
import {Message} from '../../constants/Types';

// Define a type for the slice state
interface MessageState {
  conversation: Array<Conversation>;
  isLoading: Boolean;
}

interface Conversation {
  lastMessage: string;
  time: number;
  lastSender: {
    uid: string;
    username: string;
    userAvatar: string;
  };
  lastReceiver: {
    uid: string;
    username: string;
    userAvatar: string;
  };
}

export const requestListConversation = createAsyncThunk(
  'message/requestListConversation',
  async ({uid}: {uid: string}): Promise<Partial<Message>> => {
    try {
      let listConversation = [];
      const querySnapshot = await firestore().collection('Conversation').get();
      if (querySnapshot.size === 0) {
        return new Promise(resolve => {
          resolve({
            status: false,
          });
        });
      } else {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id.indexOf(uid) !== -1) {
            listConversation.push(documentSnapshot.data());
          }
        });
        listConversation.sort(
          (a: Conversation, b: Conversation) => a.time - b.time,
        );
        return new Promise(resolve => {
          resolve({
            status: true,
            conversation: listConversation,
          });
        });
      }
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
const initialState: MessageState = {
  isLoading: false,
  conversation: [],
};

export const messageSlice = createSlice({
  name: 'message',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestListConversation.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(requestListConversation.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status) {
        state.conversation = action.payload.conversation;
      }
    });
    builder.addCase(requestListConversation.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {} = messageSlice.actions;

export default messageSlice.reducer;
