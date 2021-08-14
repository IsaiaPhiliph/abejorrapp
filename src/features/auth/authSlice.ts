import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface CurrentUser {
  email: string | null;
  uid: string;
  displayName: string | null;
}

export interface AuthState {
  currentUser: CurrentUser | undefined;
}

const initialState: AuthState = {
  currentUser: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCurrentUser: (
      state,
      action: { type: string; payload: CurrentUser | undefined }
    ) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;

export default authSlice.reducer;
