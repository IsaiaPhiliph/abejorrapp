import GamesList from "../components/GamesList";
import AddIcon from "@material-ui/icons/Add";
import { createStyles, Fab, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) =>
  createStyles({
    addIcon: {
      position: "fixed",
      bottom: 0,
      right: 0,
      margin: theme.spacing(0, 2, 2, 0),
    },
  })
);

export default function GamesScreen() {
  const history = useHistory();
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    history.push("/new-game");
  };
  const classes = useStyles();

  return (
    <>
      <Fab
        onClick={handleClick}
        className={classes.addIcon}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <GamesList />
    </>
  );
}
