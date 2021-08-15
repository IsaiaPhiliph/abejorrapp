import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { useEffect } from "react";
import { theme } from "./theme";
import Home from "./views/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth } from "./firebase";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectCurrentUser, setCurrentUser } from "./features/auth/authSlice";
import { selectLoading, setLoading } from "./features/interface/interfaceSlice";
import SignInScreen from "./views/SignInScreen";
import SignUpScreen from "./views/SignUpScreen";
import { makeStyles } from "@material-ui/core";
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
  useEffect(() => {
    let t: number | undefined = undefined;
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
        t = window.setTimeout(() => {
          console.log(window.location);
          if (
            !(
              window.location.pathname === "/" ||
              window.location.pathname === "/sign-in" ||
              window.location.pathname === "/sign-up"
            )
          ) {
            window.location.replace("/");
          }
        }, 2000);
      }
    });
    return () => {
      unregister();
      if (t) window.clearTimeout(t);
    };
  }, [dispatch]);
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        {loading && <Loading />}
        <Router>
          {currentUser && (
            <Switch>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          )}
          {!currentUser && (
            <>
              <Switch>
                <Route exact path="/sign-in">
                  <SignInScreen />
                </Route>
                <Route exact path={["/sign-up"]}>
                  <SignUpScreen />
                </Route>
                <Route exact path="/">
                  <SignInScreen />
                </Route>
              </Switch>
            </>
          )}
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
