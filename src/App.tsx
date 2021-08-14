import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { useEffect } from "react";
import { theme } from "./theme";
import Home from "./views/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { auth } from "./firebase";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectCurrentUser, setCurrentUser } from "./features/auth/authSlice";
import { selectLoading, setLoading } from "./features/interface/interfaceSlice";
import SignInScreen from "./views/SignInScreen";
import SignUpScreen from "./views/SignUpScreen";
import { makeStyles, Typography } from "@material-ui/core";
import Loading from "./views/Loading";

const useStyles = makeStyles((theme) => ({
  app: {
    minHeight: "100vh",
    background: theme.palette.background.default,
  },
}));

function App() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectLoading);
  const history = useHistory();
  useEffect(() => {
    dispatch(setLoading(true));
    const unregister = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setCurrentUser({
            email: user.email,
            displayName: user.displayName,
            uid: user.uid,
          })
        );
        dispatch(setLoading(false));
      } else if (!user) {
        dispatch(setCurrentUser(undefined));
        dispatch(setLoading(false));
      }
    });
    return () => unregister();
  }, [dispatch]);
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        {loading && <Loading />}
        <Router>
          <Switch>
            {currentUser && (
              <Route path="/">
                <Home />
              </Route>
            )}
            {!currentUser && (
              <>
                <Route exact path="/sign-in">
                  <SignInScreen />
                </Route>
                <Route exact path={["/sign-up"]}>
                  <SignUpScreen />
                </Route>
                <Route exact path="/">
                  <SignInScreen />
                </Route>
              </>
            )}
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
