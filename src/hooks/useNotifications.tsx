import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  setNotifications,
  Notification,
} from "../features/notifications/notificationsSlice";

import { db } from "../firebase";

export default function useNotifications() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  useEffect(() => {
    if (currentUser && currentUser.email) {
      const userDoc = doc(db, "users", currentUser.email);
      const notificationsCollection = collection(userDoc, "notifications");

      const unsuscribe = onSnapshot(notificationsCollection, (snap) => {
        const docs = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Notification,
        }));
        dispatch(setNotifications(docs));
      });
      return () => unsuscribe();
    }
  }, [dispatch, currentUser]);
  return;
}
