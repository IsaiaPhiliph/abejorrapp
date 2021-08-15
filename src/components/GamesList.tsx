import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { useAppSelector } from "../app/hooks";
import { selectGames } from "../features/games/gamesSlice";
import GamepadIcon from "@material-ui/icons/Gamepad";
import { Link, Typography } from "@material-ui/core";
import { Link as RLink } from "react-router-dom";
import { theme } from "../theme";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);
export default function GamesList() {
  const games = useAppSelector(selectGames);
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {games.length > 0 ? (
        games.map((game) => {
          // eslint-disable-next-line array-callback-return
          if (!game.data) return;
          return (
            <Link
              color="textPrimary"
              underline="none"
              component={RLink}
              to={`/game/${game.id}`}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={{ background: theme.palette.primary.main }}>
                    <GamepadIcon
                      htmlColor={theme.palette.secondary.main}
                      style={{ fill: theme.palette.common.white }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={game.data.name}
                  secondary={
                    game.data.status ||
                    game.data.players
                      .map((player) => player.username)
                      .join(", ")
                  }
                />
              </ListItem>
            </Link>
          );
        })
      ) : (
        <Typography
          style={{
            padding: theme.spacing(2),
          }}
        >
          No tienes partidas
        </Typography>
      )}
    </List>
  );
}
