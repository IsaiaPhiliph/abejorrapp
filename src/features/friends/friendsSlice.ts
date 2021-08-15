import { createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import { RootState } from "../../app/store";

export interface Friend extends DocumentData {
  id: string;
  username:string
}

export interface Friends {
  friends: { id: string; data: Friend }[];
}

const initialState: Friends = {
  friends: [],
};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setFriends: (
      state,
      action: {
        type: string;
        payload: { id: string; data: Friend }[];
      }
    ) => {
      state.friends = action.payload;
    },
  },
});

export const { setFriends } = friendsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectFriends = (state: RootState) => state.friends.friends;

export default friendsSlice.reducer;
