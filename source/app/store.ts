import {configureStore} from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import messageSlice from '../features/main/messageSlice';
import postSlice from '../features/post/postSlice';
// ...

export const store = configureStore({
  reducer: {
    auth: authSlice,
    message: messageSlice,
    post: postSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
