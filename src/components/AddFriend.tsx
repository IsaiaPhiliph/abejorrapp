import {
  Button,
  Card,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/authSlice";
import { selectUsers } from "../features/users/usersSlice";
import { db } from "../firebase";
import { theme } from "../theme";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
    },
  })
);

export default function AddFriend() {
  const classes = useStyles();
  const { t } = useTranslation();
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const options = users
    .filter(
      (user) => user.id !== currentUser?.displayName && user.data.displayName
    )
    .map((user) => ({
      label: user.data.displayName,
      value: user.id,
    }));
  console.log(options);
  const emptyOption = { label: "", value: "" };
  const [selectedUser, setSelectedUser] = useState(emptyOption);
  return (
    <div>
      <Card className={classes.card}>
        {currentUser && options.length > 0 && currentUser && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                Object.entries(selectedUser).toString() !==
                  Object.entries(emptyOption).toString() &&
                currentUser
              ) {
                //User selected an option...
                try {
                  const userDoc = doc(db, "users", selectedUser.value);
                  const userNotifications = collection(
                    userDoc,
                    "notifications"
                  );
                  const notificationDoc = doc(
                    userNotifications,
                    currentUser.displayName + "-add"
                  );

                  await setDoc(notificationDoc, {
                    type: "add",
                    from: currentUser.displayName,
                  });
                } catch (err) {
                  console.error(err);
                }
              }
            }}
          >
            <Grid container spacing={2} direction="column" alignItems="stretch">
              <Grid item>
                <Autocomplete
                  value={selectedUser}
                  onChange={(e, value) => {
                    if (value) setSelectedUser(value);
                  }}
                  id="users-select"
                  options={options}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("pickAUser")}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    background: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  }}
                  variant="contained"
                >
                  {t("addFriend")}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Card>
    </div>
  );
}
