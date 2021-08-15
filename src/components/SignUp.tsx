import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useTranslation } from "react-i18next";
import { Link as RLink } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../features/auth/authSlice";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [signUpInfo, setSignUpInfo] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    value: string,
    field: "username" | "password" | "email"
  ) => {
    setSignUpInfo({
      ...signUpInfo,
      [field]: value,
    });
  };

  const handleFormSubmit = () => {
    console.log(signUpInfo);

    createUserWithEmailAndPassword(auth, signUpInfo.email, signUpInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: signUpInfo.username,
        })
          .then(() => {
            if (user.email) {
              setDoc(doc(db, "users", signUpInfo.username), {
                email: user.email,
                photoUrl: user.photoURL,
                displayName: signUpInfo.username,
              }).catch((err) => console.error(err));
            }
            dispatch(
              setCurrentUser({
                email: user.email,
                displayName: signUpInfo.username,
                uid: signUpInfo.username,
              })
            );
          })
          .catch((err) => console.error(err));
        //TODO Notify user that it was not possible to update his display name
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg(t("signUpError"));
        // ..
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("signup")}
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="displayName"
                variant="outlined"
                required
                fullWidth
                id="displayName"
                label={t("username")}
                value={signUpInfo.username}
                onChange={(e) => {
                  handleChange(e.target.value, "username");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                autoFocus
                id="email"
                label={t("emailAddress")}
                name="email"
                autoComplete="username"
                value={signUpInfo.email}
                onChange={(e) => handleChange(e.target.value, "email")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label={t("password")}
                type="password"
                id="password"
                autoComplete="current-password"
                value={signUpInfo.password}
                onChange={(e) => handleChange(e.target.value, "password")}
              />
            </Grid>
            {errorMsg && (
              <Grid item xs={12}>
                <Typography align="center" color="error">
                  {errorMsg}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t("signup")}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RLink} to="/sign-in" variant="body2">
                {t("alreadyHaveAccount")}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
