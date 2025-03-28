import { configureStore } from "@reduxjs/toolkit";
import colorReducer from "./reducers/color";

// 创建 Redux store
const store = configureStore({
  reducer: {
    color: colorReducer,
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware(), // 使用默认的中间件
  // devTools: process.env.NODE_ENV !== 'production', // 在开发环境启用 Redux DevTools
});

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
