import {
  Button,
  Card,
  createStyles,
  DialogContentText,
  Fab,
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import abejaTramposa from "../assets/img/abeja-tramposa.png";
import abeja from "../assets/img/abeja1.png";
import normal from "../assets/img/normal.png";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    addIcon: {
      position: "fixed",
      bottom: 0,
      right: 0,
      margin: theme.spacing(0, 2, 2, 0),
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
  const [dialog, setDialog] = useState(false);
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setDialog(true);
  };
  const handleClose = () => {
    setDialog(false);
  };
  return (
    <div className={classes.root}>
      <Fab
        onClick={handleClick}
        className={classes.addIcon}
        color="secondary"
        aria-label="add"
      >
        <HelpOutlineIcon />
      </Fab>
      <Dialog
        open={dialog}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{ textAlign: "center" }}
          id="alert-dialog-slide-title"
        >
          {"Ayudita"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText align="center" id="alert-dialog-slide-description">
            Valor de las cartas
          </DialogContentText>
          <Grid container justifyContent="center" spacing={2}>
            <Grid
              item
              container
              direction="column"
              style={{ width: "min-content" }}
            >
              <Typography
                style={{ padding: theme.spacing(1) }}
                variant="caption"
              >
                Abejorro tramposo
              </Typography>
              <img
                style={{ width: "100px" }}
                src={abejaTramposa}
                alt="abeja-tramposa"
              />
              <Typography
                style={{ padding: theme.spacing(1) }}
                variant="caption"
              >
                10 Puntos
              </Typography>
            </Grid>
            <Grid
              item
              container
              direction="column"
              style={{ width: "min-content" }}
            >
              <Typography
                style={{ padding: theme.spacing(1) }}
                variant="caption"
              >
                Cartas de acción
              </Typography>
              <img
                style={{ width: "100px" }}
                src={abeja}
                alt="abeja-tramposa"
              />
              <Typography
                style={{ padding: theme.spacing(1) }}
                variant="caption"
              >
                5 Puntos
              </Typography>
            </Grid>
            <Grid
              item
              container
              direction="column"
              style={{ width: "min-content" }}
            >
              <Typography
                style={{ padding: theme.spacing(1) }}
                variant="caption"
              >
                Cartas Normales
              </Typography>
              <img
                style={{ width: "100px" }}
                src={normal}
                alt="abeja-tramposa"
              />
              <Typography
                style={{ padding: theme.spacing(1) }}
                variant="caption"
              >
                1 Punto
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
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
