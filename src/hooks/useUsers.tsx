import { collection, onSnapshot } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { AbUser, setUsers } from "../features/users/usersSlice";
import { db } from "../firebase";

export default function useUsers() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const usersCollection = collection(db, "users");
    const unsuscribe = onSnapshot(usersCollection, (snap) => {
      const docs = snap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
      dispatch(setUsers(docs as AbUser[]));
    });
    return () => unsuscribe();
  }, [dispatch]);
  return;
}
