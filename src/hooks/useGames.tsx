import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Game, setGames } from "../features/games/gamesSlice";
import { selectUsers } from "../features/users/usersSlice";

import { db } from "../firebase";

export default function useGames() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  useEffect(() => {
    if (currentUser && currentUser.displayName && users) {
      const userDoc = doc(db, "users", currentUser.displayName);
      const q = query(
        collection(db, "games"),
        where("players", "array-contains", currentUser.displayName)
      );
      const unsubscribe = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Game,
        }));
        let newDocs = [...docs];
        newDocs.forEach((value, index, array) => {
          let newPlayers = [...value.data.players];
          newPlayers.forEach((player, indx, arr) => {
            arr[indx] = {
              // @ts-ignore
              id: player,
              // @ts-ignore
              username: users.find((user) => user.id === player)?.data
                .displayName,
            };
          });
          array[index].data.players = [...newPlayers];
        });
        dispatch(setGames(newDocs));
        console.log(docs);
      });
      return () => unsubscribe();
    }
  }, [dispatch, currentUser, users]);
  return;
}
