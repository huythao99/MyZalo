import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert, sortID} from '../../ultities/Ultities';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Message} from '../../constants/Types';

// Define a type for the slice state
interface MessageState {
  conversation: Array<Conversation>;
  isLoading: Boolean;
}

interface Conversation {
  lastMessage: string;
  time: number;
  lastSenderId: string;
  isSeen: Boolean;
  id: string;
  lastReceiverId: string;
}

export const requestSendMessage = createAsyncThunk(
  'message/requestSendMessage',
  async ({
    sender,
    receiver,
    content,
    uriImage,
    uriVideo,
    time,
  }: {
    time: number;
    content: string;
    uriImage: string | null;
    uriVideo: string | null;
    sender: {
      id: string;
      name: string;
      avatar: string;
      email: string;
    };
    receiver: {
      id: string;
      name: string;
      avatar: string;
      email: string;
    };
  }): Promise<Partial<Message>> => {
    try {
      let urlImage = null;
      if (uriImage) {
        const reference = storage().ref(
          `message/${sortID(receiver.id, sender.id)}_${time}`,
        );
        await reference.putFile(uriImage);
        urlImage = await reference.getDownloadURL();
      }
      const message = {
        content,
        time,
        urlImage,
        uriVideo,
        sender,
        receiver,
      };
      await firestore()
        .collection('Messages')
        .doc(sortID(receiver.id, sender.id))
        .collection('Message')
        .add(message);
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

export const requestUpdateConversation = createAsyncThunk(
  'message/requestUpdateConversation',
  async ({
    sender,
    receiver,
    content,
    uriImage,
    uriVideo,
    time,
  }: {
    time: number;
    content: string;
    uriImage: string | null;
    uriVideo: string | null;
    sender: {
      id: string;
      name: string;
      avatar: string;
      email: string;
    };
    receiver: {
      id: string;
      name: string;
      avatar: string;
      email: string;
    };
  }): Promise<Partial<Message>> => {
    try {
      let urlImage = null;
      if (uriImage) {
        const reference = storage().ref(
          `message/${sortID(receiver.id, sender.id)}_${time}`,
        );
        await reference.putFile(uriImage);
        urlImage = await reference.getDownloadURL();
      }
      const message = {
        content,
        time,
        urlImage,
        uriVideo,
        sender,
        receiver,
      };
      await firestore()
        .collection('Conversation')
        .doc(sortID(sender.id, receiver.id))
        .set(message);
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
const initialState: MessageState = {
  isLoading: false,
  conversation: [],
};

export const messageSlice = createSlice({
  name: 'message',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export const {} = messageSlice.actions;

export default messageSlice.reducer;
