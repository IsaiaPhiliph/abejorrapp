import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import AddFriend from "../components/AddFriend";
import { theme } from "../theme";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default function AddFriendScreen() {
  return (
    <div>
      <Grid container direction="column">
        <Grid item style={{ padding: theme.spacing(2) }}>
          <AddFriend />
        </Grid>
      </Grid>
    </div>
  );
}
