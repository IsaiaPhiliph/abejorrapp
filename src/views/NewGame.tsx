import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Button, Card, Grid, makeStyles, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Autocomplete } from "@material-ui/lab";
import { useAppSelector } from "../app/hooks";
import { selectFriends } from "../features/friends/friendsSlice";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { selectCurrentUser } from "../features/auth/authSlice";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(2),
  },
}));

export default function NewGame() {
  const [online, setOnline] = useState(true);
  const friends = useAppSelector(selectFriends);
  const currentUser = useAppSelector(selectCurrentUser);
  const [name, setName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<
    { value: string; label: string }[]
  >([]);
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
      value: friend.id,
      label: friend.id,
    }));
  const handleCreateGame: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (currentUser) {
      const newSelectedFriends = [...selectedFriends];
      newSelectedFriends.push({
        value: currentUser.email!,
        label: currentUser.email!,
      });
      console.log(newSelectedFriends);
      newSelectedFriends.forEach((selectedFriend) => {
        const friendGames = collection(
          doc(db, "users", selectedFriend.value),
          "games"
        );
        try {
          setDoc(doc(friendGames), {
            name,
            players: newSelectedFriends.map((friend) => friend.value),
            rounds: newSelectedFriends.map((friend, index) => ({
              round_num: index + 1,
              points: newSelectedFriends.map((friend) => ({
                user: friend.value,
                points: 0,
              })),
            })),
          });
        } catch (err) {
          console.error(err);
        }
      });
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
              color="secondary"
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
