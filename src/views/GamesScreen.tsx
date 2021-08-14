import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import { useAppSelector } from "../app/hooks";
import { selectGames } from "../features/games/gamesSlice";
import GamepadIcon from "@material-ui/icons/Gamepad";
import { Link } from "@material-ui/core";
import { Link as RLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export default function GamesScreen() {
  const classes = useStyles();
  const games = useAppSelector(selectGames);
  return (
    <List className={classes.root}>
      {games.map((game) => (
        <Link
          color="textPrimary"
          underline="none"
          component={RLink}
          to={`/game/${game.id}`}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <GamepadIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={game.data.name}
              secondary={game.data.status || game.data.players.join(", ")}
            />
          </ListItem>
        </Link>
      ))}
    </List>
  );
}
