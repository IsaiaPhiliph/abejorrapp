import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface InterfaceState {
  loading: boolean;
  drawer: boolean;
  userMenuOpen: boolean;
  notificationsOpen: boolean;
}

const initialState: InterfaceState = {
  loading: false,
  drawer: false,
  userMenuOpen: false,
  notificationsOpen: false,
};

export const interfaceSlice = createSlice({
  name: "interface",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLoading: (state, action: { type: string; payload: boolean }) => {
      state.loading = action.payload;
    },
    setDrawer: (state, action: { payload: boolean; type: string }) => {
      state.drawer = action.payload;
    },
    setUserMenuOpen: (state, action: { type: string; payload: boolean }) => {
      state.userMenuOpen = action.payload;
    },
    setNotificationsOpen: (
      state,
      action: { type: string; payload: boolean }
    ) => {
      state.notificationsOpen = action.payload;
    },
  },
});

export const { setLoading, setDrawer, setUserMenuOpen, setNotificationsOpen } =
  interfaceSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectLoading = (state: RootState) => state.interface.loading;
export const selectNotificationsOpen = (state: RootState) =>
  state.interface.notificationsOpen;
export const selectDrawer = (state: RootState) => state.interface.drawer;
export const selectUserMenuOpen = (state: RootState) =>
  state.interface.userMenuOpen;

export default interfaceSlice.reducer;
