import {
  AppBar,
  createStyles,
  Theme,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Button,
  Badge,
  Menu,
  MenuItem,
  ListItem,
  Grid,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  setDrawer,
  setNotificationsOpen,
  setUserMenuOpen,
} from "../features/interface/interfaceSlice";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { theme } from "../theme";
import { auth, db } from "../firebase";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { AccountCircle } from "@material-ui/icons";
import { selectNotifications } from "../features/notifications/notificationsSlice";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

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
    exitIcon: {
      fill: theme.palette.text.primary,
    },
    tickBtn: {
      color: theme.palette.success.main,
    },
    cancelBtn: {
      color: theme.palette.error.main,
    },
  })
);

export default function AbAppBar() {
  const classes = useStyles();
  const { t } = useTranslation();
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElNot, setAnchorElNot] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const notificationsOpen = Boolean(anchorElNot);
  const notifications = useAppSelector(selectNotifications);
  const logOut = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.log(err);
    }
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setUserMenuOpen(true));
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setNotificationsOpen(true));
    setAnchorElNot(event.currentTarget);
  };
  const handleMenuClose = () => {
    dispatch(setUserMenuOpen(false));
    setAnchorEl(null);
  };
  const handleNotificationsClone = () => {
    dispatch(setNotificationsOpen(false));
    setAnchorElNot(null);
  };
  const handleAcceptFriend = async (userId: string) => {
    if (currentUser?.email) {
      const myDoc = doc(db, "users", currentUser.email);
      const userDoc = doc(db, "users", userId);
      const notificationDoc = doc(
        collection(doc(db, "users", currentUser.email), "notifications"),
        userId + "-add"
      );
      const myFriendCollection = collection(myDoc, "friends");
      const userFriendCollection = collection(userDoc, "friends");
      try {
        await deleteDoc(notificationDoc);
        await setDoc(doc(myFriendCollection, userId), {
          createdAt: new Date().toDateString(),
        });
        await setDoc(doc(userFriendCollection, currentUser.email), {
          createdAt: new Date().toDateString(),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="primary-account-menu"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{t("myProfile")}</MenuItem>
      <MenuItem onClick={handleMenuClose}>{t("myAccount")}</MenuItem>
      <MenuItem
        onClick={(e) => {
          handleMenuClose();
          logOut();
        }}
      >
        {t("logOut")}
      </MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = (
    <Menu
      anchorEl={anchorElNot}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={"primary-notification-menu"}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={notificationsOpen}
      onClose={handleNotificationsClone}
    >
      {notifications &&
        notifications.length > 0 &&
        notifications.map((notification, index) => (
          <ListItem key={`notification-${index}`}>
            <Grid item>
              <Typography>
                {notification.data.type === "add" && t("notificationAddMsg")}
                {notification.data.from}
              </Typography>
            </Grid>
            <IconButton
              onClick={() => {
                handleNotificationsClone();
                handleAcceptFriend(notification.data.from);
              }}
              className={classes.tickBtn}
            >
              <CheckCircleOutlineIcon />
            </IconButton>
            <IconButton className={classes.cancelBtn}>
              <HighlightOffIcon />
            </IconButton>
          </ListItem>
        ))}
      {notifications.length <= 0 && (
        <ListItem>
          <Typography>{t("noNotifications")}</Typography>
        </ListItem>
      )}
    </Menu>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(setDrawer(true))}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t("home")}
          </Typography>
          {currentUser ? (
            <>
              <IconButton
                aria-label="show notifications"
                color="inherit"
                onClick={handleNotificationsOpen}
                aria-controls="primary-notification-menu"
                aria-haspopup="true"
              >
                {notifications.length > 0 ? (
                  <Badge badgeContent={notifications.length} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                ) : (
                  <NotificationsIcon />
                )}
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </>
          ) : (
            <Button color="inherit">{t("login")}</Button>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderNotificationsMenu}
    </div>
  );
}
