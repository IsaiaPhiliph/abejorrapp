import { createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import { RootState } from "../../app/store";

export interface Notification extends DocumentData {
  type: "add";
  from: string;
}

export interface Notifications {
  notifications: { id: string; data: Notification }[];
}

const initialState: Notifications = {
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNotifications: (
      state,
      action: {
        type: string;
        payload: { id: string; data: Notification }[];
      }
    ) => {
      state.notifications = action.payload;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;

export default notificationsSlice.reducer;
