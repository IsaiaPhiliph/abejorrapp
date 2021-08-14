import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectDrawer, setDrawer } from "../features/interface/interfaceSlice";
import { useTranslation } from "react-i18next";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

type Anchor = "top" | "left" | "bottom" | "right";

export default function AbAppDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const drawer = useAppSelector(selectDrawer);
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      dispatch(setDrawer(open));
    };

  const menu = [
    {
      text: t("home"),
      link: "/",
      icon: <HomeIcon />,
    },
    {
      text: t("newGame"),
      link: "/new-game",
      icon: <AddIcon />,
    },
    {
      text: t("addFriend"),
      link: "/add-friend",
      icon: <PersonAddIcon />,
    },
    {
      text:t("games"),
      link:"/games",
      icon:<VideogameAssetIcon/>
    }
  ];

  const list = (
    anchor: Anchor,
    menu: {
      text: string;
      link: string;
      icon: JSX.Element;
    }[]
  ) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {menu.map((item, index) => (
          <ListItem
            onClick={() => {
              if (history.location.pathname !== item.link)
                history.push(item.link);
            }}
            button
            key={item.link}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        anchor={"left"}
        open={drawer}
        onClose={toggleDrawer("left", false)}
      >
        {list("left", menu)}
      </Drawer>
    </div>
  );
}
