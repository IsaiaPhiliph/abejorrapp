import {
  Card,
  createStyles,
  Divider,
  Fab,
  Grid,
  ListItem,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import { theme } from "../theme";
import GamesList from "../components/GamesList";
import { useAppSelector } from "../app/hooks";
import { selectFriends } from "../features/friends/friendsSlice";
import FaceIcon from "@material-ui/icons/Face";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addIcon: {
      position: "fixed",
      bottom: 0,
      right: 0,
      margin: theme.spacing(0, 2, 2, 0),
    },
  })
);

export default function HomeScreen() {
  const classes = useStyles();
  const history = useHistory();
  const friends = useAppSelector(selectFriends);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    history.push("/new-game");
  };

  return (
    <div>
      <Grid container>
        <Grid item style={{ width: "100%", padding: theme.spacing(2) }}>
          <Card>
            <Grid container direction="column">
              <Grid item>
                <Typography
                  style={{
                    padding: theme.spacing(2),
                    background: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  }}
                  variant="h6"
                >
                  Partidas
                </Typography>
              </Grid>
              <Divider />
              <Grid item>
                <GamesList />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item style={{ width: "100%", padding: theme.spacing(2) }}>
          <Card>
            <Grid container direction="column">
              <Grid item>
                <Typography
                  style={{
                    padding: theme.spacing(2),
                    background: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  }}
                  variant="h6"
                >
                  Amigos
                </Typography>
              </Grid>
              <Divider />
              <Grid item>
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <Grid
                      container
                      style={{ padding: theme.spacing(2) }}
                      alignItems="flex-end"
                    >
                      <Grid item>
                        <FaceIcon htmlColor={theme.palette.primary.dark} />
                      </Grid>
                      <Grid item>
                        <ListItem key={friend.data.username}>
                          {friend.data.username}
                        </ListItem>
                      </Grid>
                    </Grid>
                  ))
                ) : (
                  <Typography
                    style={{
                      padding: theme.spacing(2),
                    }}
                  >
                    No tienes amigos
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Fab
        onClick={handleClick}
        className={classes.addIcon}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
