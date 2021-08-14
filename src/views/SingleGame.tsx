import {
  Card,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectGames } from "../features/games/gamesSlice";
import { theme } from "../theme";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
  })
);

export default function SingleGame() {
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const games = useAppSelector(selectGames);
  const currentGame = games.find((game) => game.id === id);
  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        {currentGame?.data.rounds.map((round) => (
          <Grid item>
            <Card>
              {currentGame.data.players.map((player) => (
                <Grid item container>
                  <Grid
                    style={{ padding: theme.spacing(2), width: "100%" }}
                    item
                  >
                    <Typography>{player}</Typography>
                  </Grid>
                  <Grid
                    style={{ padding: theme.spacing(2), width: "100%" }}
                    item
                  >
                    <TextField size="small" variant="outlined" />
                  </Grid>
                </Grid>
              ))}
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
