import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Friend, setFriends } from "../features/friends/friendsSlice";
import {
  setNotifications,
  Notification,
} from "../features/notifications/notificationsSlice";
import { selectUsers } from "../features/users/usersSlice";

import { db } from "../firebase";

export default function useFriends() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentUser = useAppSelector(selectCurrentUser);
  const users = useAppSelector(selectUsers);
  useEffect(() => {
    if (currentUser && currentUser.displayName && users) {
      const userDoc = doc(db, "users", currentUser.displayName);
      const friendsCollection = collection(userDoc, "friends");

      const unsuscribe = onSnapshot(friendsCollection, (snap) => {
        const docs = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Friend,
        }));

        dispatch(
          setFriends(
            docs.map((doc) => {
              doc.data.username =
                users.find((user) => user.id === doc.id)?.data.displayName ||
                t("noUsername");
              return doc;
            })
          )
        );
      });
      return () => unsuscribe();
    }
  }, [dispatch, currentUser, users]);
  return;
}
