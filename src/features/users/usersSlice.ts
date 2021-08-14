import { createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import { RootState } from "../../app/store";

export interface AbUser extends DocumentData {
  data: { email: string; photoUrl: string; displayName: string };
  id: string;
}

export interface Users {
  users: AbUser[];
}

const initialState: Users = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUsers: (state, action: { type: string; payload: AbUser[] }) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUsers = (state: RootState) => state.users.users;

export default usersSlice.reducer;
