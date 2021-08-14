import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";

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

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    history.push("/new-game");
  };

  return (
    <div>
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
