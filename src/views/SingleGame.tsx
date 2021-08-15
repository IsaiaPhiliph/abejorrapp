import {
  Card,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectGames, setRounds } from "../features/games/gamesSlice";
import { theme } from "../theme";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "react-i18next";
import { selectCurrentUser } from "../features/auth/authSlice";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
  })
);

export default function SingleGame() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const classes = useStyles();
  const currentUser = useAppSelector(selectCurrentUser);
  const games = useAppSelector(selectGames);
  const currentGame = games.find((game) => game.id === id);
  const [gameScore, setGameScore] = useState<{
    [key: string]: number;
  }>();
  const savePoints = async (
    points: string,
    gameId: string,
    roundId: string
  ) => {
    if (currentUser?.displayName) {
      const roundColl = collection(doc(db, "games", gameId), "rounds");
      await updateDoc(doc(roundColl, roundId), {
        [currentUser.displayName]: parseInt(points),
      });
    }
  };
  // @ts-ignore
  location.name = currentGame?.data.name || t("game");
  useEffect(() => {
    let totalPoints: { [key: string]: number } = {};
    currentGame?.data?.rounds?.forEach((round) => {
      currentGame.data.players.forEach((player) => {
        let userPoints = round.data[player.username];
        if (!totalPoints[player.username]) {
          totalPoints[player.username] = 0;
        }
        totalPoints[player.username] += userPoints;
      });
    });
    console.log(totalPoints);
    setGameScore(totalPoints);
  }, [currentGame]);
  useEffect(() => {
    if (currentGame?.id) {
      const unsuscribe = onSnapshot(
        collection(doc(db, "games", currentGame.id), "rounds"),
        (snap) => {
          // @ts-ignore
          let rounds = [];
          snap.forEach((item) => {
            rounds.push({ id: item.id, data: item.data() });
          });
          // @ts-ignore
          dispatch(setRounds({ gameId: currentGame.id, rounds: rounds }));
        }
      );
      return () => unsuscribe();
    }
  }, [currentGame?.id, dispatch]);
  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Card>
            <Grid container>
              <Grid
                item
                style={{
                  padding: theme.spacing(2),
                  background: theme.palette.primary.dark,
                  width: "100%",
                }}
              >
                <Typography
                  style={{ color: theme.palette.common.white }}
                  variant="h6"
                >
                  {t("score")}
                </Typography>
              </Grid>
              <Grid container direction="column">
                <Divider />
                {gameScore &&
                  Object.keys(gameScore).map((key) => {
                    return (
                      <>
                        <Grid
                          item
                          container
                          justifyContent="space-between"
                          style={{ padding: theme.spacing(1), width: "100%" }}
                        >
                          <Grid item>
                            <Typography>{key}</Typography>
                          </Grid>
                          <Grid item>
                            <Typography>{gameScore[key]}</Typography>
                          </Grid>
                        </Grid>
                        <Divider />
                      </>
                    );
                  })}
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {currentGame?.data?.rounds?.map((round, roundIndex) => (
          <Grid item>
            <Card>
              <Grid
                item
                style={{
                  padding: theme.spacing(2),
                  width: "100%",
                  background: theme.palette.primary.light,
                }}
              >
                <Typography color="textSecondary" variant={"h6"}>
                  {t("round") + (roundIndex + 1)}
                </Typography>
              </Grid>
              <Divider />

              {currentGame.data.players.map((player) => {
                return (
                  <>
                    <Grid
                      item
                      container
                      justifyContent={"space-between"}
                      direction="row"
                      wrap="nowrap"
                    >
                      <Grid style={{ padding: theme.spacing(2) }} item>
                        <Typography>{player.username}</Typography>
                      </Grid>
                      <Grid item style={{ padding: theme.spacing(2) }}>
                        {player.id === currentUser?.displayName ? (
                          <TextField
                            onFocus={(event) => {
                              event.target.select();
                            }}
                            type="tel"
                            style={{ width: "47px" }}
                            size="small"
                            variant="outlined"
                            value={round.data[currentUser.displayName]}
                            onChange={(e) => {
                              if (e.target.value === "") {
                                e.target.value = "0";
                              }
                              if (!isNaN(parseInt(e.target.value)))
                                savePoints(
                                  e.target.value,
                                  currentGame.id,
                                  round.id
                                );
                            }}
                          />
                        ) : (
                          <Typography>{round.data[player.id]}</Typography>
                        )}
                      </Grid>
                    </Grid>
                    <Divider />
                  </>
                );
              })}
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
