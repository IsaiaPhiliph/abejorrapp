import { Grid } from "@material-ui/core";
import React from "react";
import AddFriend from "../components/AddFriend";
import { theme } from "../theme";

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
