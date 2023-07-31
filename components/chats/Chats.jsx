import React, { useEffect } from "react";
import useChatContext from "@/Context/chatContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Chats = () => {
  const { users, setUsers } = useChatContext();

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const availableUsers = {};
      snapshot.forEach((doc) => {
        availableUsers[doc.id] = doc.data();
      });
      setUsers(availableUsers);
    });
  }, []);

  return <div>Chats</div>;
};

export default Chats;
