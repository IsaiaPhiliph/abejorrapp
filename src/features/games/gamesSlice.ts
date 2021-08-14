import { createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import { RootState } from "../../app/store";

export interface Game extends DocumentData {
  name: string;
  status: 0;
  rounds: {
    round_num: number;
    points: {
      points: number;
      user: string;
    }[];
  }[];
  players: string[];
}

export interface Games {
  games: { id: string; data: Game }[];
}

const initialState: Games = {
  games: [],
};

export const gamesSlice = createSlice({
  name: "games",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setGames: (
      state,
      action: {
        type: string;
        payload: { id: string; data: Game }[];
      }
    ) => {
      state.games = action.payload;
    },
  },
});

export const { setGames } = gamesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectGames = (state: RootState) => state.games.games;

export default gamesSlice.reducer;
