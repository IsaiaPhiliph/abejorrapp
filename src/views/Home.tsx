import React from "react";
import AbAppBar from "../components/AbAppBar";
import { Route, Switch } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import NewGame from "./NewGame";
import AbAppDrawer from "../components/AbAppDrawer";
import AddFriendScreen from "./AddFriendScreen";
import useUsers from "../hooks/useUsers";
import useNotifications from "../hooks/useNotifications";
import useFriends from "../hooks/useFriends";
import GamesScreen from "./GamesScreen";
import useGames from "../hooks/useGames";
import SingleGame from "./SingleGame";

export default function Home() {
  useUsers();
  useNotifications();
  useFriends();
  useGames();
  return (
    <div>
      <AbAppBar />
      <AbAppDrawer />
      <div style={{ paddingTop: "3.5rem" }}>
        <Switch>
          <Route path="/add-friend">
            <AddFriendScreen />
          </Route>
          <Route path={`/new-game`}>
            <NewGame />
          </Route>
          <Route exact path={"/games"}>
            <GamesScreen />
          </Route>
          <Route path="/game/:id">
            <SingleGame />
          </Route>
          <Route exact path={"/"}>
            <HomeScreen />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
