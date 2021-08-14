import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import interfaceReducer from "../features/interface/interfaceSlice";
import usersReducer from "../features/users/usersSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import friendsReducer from "../features/friends/friendsSlice";
import gamesReducer from "../features/games/gamesSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    interface: interfaceReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    friends: friendsReducer,
    games: gamesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
