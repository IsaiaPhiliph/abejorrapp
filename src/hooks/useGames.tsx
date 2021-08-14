import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Friend, setFriends } from "../features/friends/friendsSlice";
import { Game, setGames } from "../features/games/gamesSlice";
import {
  setNotifications,
  Notification,
} from "../features/notifications/notificationsSlice";

import { db } from "../firebase";

export default function useGames() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  useEffect(() => {
    if (currentUser && currentUser.email) {
      const userDoc = doc(db, "users", currentUser.email);
      const gamesCollection = collection(userDoc, "games");

      const unsuscribe = onSnapshot(gamesCollection, (snap) => {
        const docs = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Game,
        }));
        dispatch(setGames(docs));
        console.log(docs);
      });
      return () => unsuscribe();
    }
  }, [dispatch, currentUser]);
  return;
}
