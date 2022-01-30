export interface User {
  status?: Boolean;
  uid?: string;
  userEmail?: string;
  userPassword?: string;
  username?: string;
  photoURL?: string;
}

export interface Conversation {
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

export interface Message {
  status?: Boolean;
  conversation?: Array<Conversation>;
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

export interface Post {
  status?: Boolean;
  listPost?: Array<PostItem>;
}
