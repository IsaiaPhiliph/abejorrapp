import React, { useState } from "react";
import { Button, Card, Grid, makeStyles, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Autocomplete } from "@material-ui/lab";
import { useAppSelector } from "../app/hooks";
import { selectFriends } from "../features/friends/friendsSlice";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { selectCurrentUser } from "../features/auth/authSlice";
import { theme } from "../theme";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(2),
  },
}));

export default function NewGame() {
  const [, setOnline] = useState(true);
  const friends = useAppSelector(selectFriends);
  const currentUser = useAppSelector(selectCurrentUser);
  const [name, setName] = useState("");
  const history = useHistory();
  const [selectedFriends, setSelectedFriends] = useState<
    { value: string; label: string }[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setOnline(checked);
  };
  const { t } = useTranslation();
  const classes = useStyles();
  const options = friends
    .filter((friend) => {
      let already = true;
      selectedFriends.forEach((selectedFriend) => {
        if (selectedFriend.value === friend.id) {
          already = false;
        }
      });
      return already;
    })
    .map((friend) => ({
      value: friend.data.username,
      label: friend.data.username,
    }));
  const handleCreateGame: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    if (currentUser) {
      const newSelectedFriends = [...selectedFriends];
      newSelectedFriends.push({
        value: currentUser.displayName!,
        label: currentUser.displayName!,
      });
      console.log(newSelectedFriends);
      try {
        const gameDoc = await addDoc(collection(db, "games"), {
          name: name || "Partida sin nombre",
          players: newSelectedFriends.map((friend) => friend.value),
        });
        const roundsCollection = collection(gameDoc, "rounds");
        let pointsObject: { [key: string]: number } = {};
        newSelectedFriends.forEach(async (friend, index) => {
          // const newDoc = await setDoc(doc(roundsCollection,`round-${index}`),{
          //   ...newSelectedFriends.map(friend=>({playerId:friend.value, points:0}))
          // })
          pointsObject[friend.value] = 0;
        });
        newSelectedFriends.forEach(async (friend, index) => {
          await setDoc(doc(roundsCollection, `round-${index}`), pointsObject);
        });

        console.log(pointsObject);
        history.push(`/game/${gameDoc.id}`);
        // rounds: newSelectedFriends.map((friend, index) => ({
        //   round_num: index + 1,
        //   points: newSelectedFriends.map((friend) => ({
        //     user: friend.value,
        //     points: 0,
        //   })),
        // })),
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <div>
      <Card className={classes.card}>
        <Grid
          className={classes.container}
          spacing={2}
          container
          direction="column"
          alignItems="stretch"
        >
          <Grid item>
            <TextField
              fullWidth
              id="game-name"
              variant="outlined"
              label={t("gameName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            {options && (
              <Autocomplete
                multiple
                id="tags-standard"
                value={selectedFriends}
                onChange={(e, value) => {
                  setSelectedFriends([...value]);
                }}
                options={options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t("selectFriends")}
                    placeholder={t("selectFriends")}
                  />
                )}
              />
            )}
          </Grid>
          {/* <Grid item container justifyContent="center">
            <FormControlLabel
              control={
                <Switch
                  checked={online}
                  onChange={handleChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Online"
            />
          </Grid> */}
          <Grid item>
            <Button
              onClick={handleCreateGame}
              fullWidth
              style={{
                background: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
              }}
              variant="contained"
            >
              {t("next")}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
