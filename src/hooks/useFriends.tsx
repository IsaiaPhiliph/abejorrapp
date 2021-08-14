import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Friend, setFriends } from "../features/friends/friendsSlice";
import {
  setNotifications,
  Notification,
} from "../features/notifications/notificationsSlice";

import { db } from "../firebase";

export default function useFriends() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  useEffect(() => {
    if (currentUser && currentUser.email) {
      const userDoc = doc(db, "users", currentUser.email);
      const friendsCollection = collection(userDoc, "friends");

      const unsuscribe = onSnapshot(friendsCollection, (snap) => {
        const docs = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Friend,
        }));
        dispatch(setFriends(docs));
      });
      return () => unsuscribe();
    }
  }, [dispatch, currentUser]);
  return;
}
