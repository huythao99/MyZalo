export interface User {
  status?: Boolean;
  uid?: string;
  userEmail?: string;
  userPassword?: string;
  username?: string;
  photoURL?: string;
  coverImage?: string;
}

export interface Conversation {
  content: string;
  time: number;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar: string;
  };
  uriImage: string;
  uriVideo: string;
}

export interface MessageItem {
  time: number;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  uriImage: string;
  uriVideo: string;
  urlImage: string;
}

export interface Message {
  status?: Boolean;
  conversation?: Array<Conversation>;
}

export interface Profile {
  status?: Boolean;
  listPost?: Array<PostItem>;
  profileAvatar: string;
  profileCoverImage: string;
  profileName: string;
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
