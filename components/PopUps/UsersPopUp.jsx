import React from "react";
import PopUpWrapper from "./PopUpWrapper";
import useAuth from "@/Context/authContext";
import useChatContext from "@/Context/chatContext";
import Avatar from "../Header/Avatar";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Search from "../SearchBar/Search";

const UsersPopUp = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();

  const selectUserHandler = async (user) => {
    try {
      const combinedChatId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      const res = await getDoc(doc(db, "chats", combinedChatId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedChatId), {
          messages: [],
        });

        const currentUserChatRef = await getDoc(
          doc(db, "userChats", currentUser.uid)
        );

        const userChatRef = await getDoc(doc(db, "userChats", user.uid));

        if (!currentUserChatRef.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedChatId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || null,
            color: user.color,
          },
          [combinedChatId + ".date"]: serverTimestamp(),
        });

        if (!userChatRef.exists()) {
          await setDoc(doc(db, "userChats", user.uid), {});
        }
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedChatId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL || null,
            color: currentUser.color,
          },
          [combinedChatId + ".date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedChatId + ".chatDeleted"]: false,
        });
      }
      dispatch({ type: "CHANGE_USER", payload: user });
      props.closePopUp();
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PopUpWrapper {...props}>
      <Search closePopUpHandler={props.closePopUp} />
      <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
        <div className="absolute w-full">
          {users &&
            Object.values(users).map((user) => (
              <div
                onClick={() => selectUserHandler(user)}
                className="flex items-center gap-4 rounded-full hover:bg-c5 py-2 px-4 cursor-pointer"
              >
                <Avatar size="large" user={user} />
                <div className="flex flex-col grow">
                  <span className="text-base text-white flex items-center justify-between">
                    <div className="font-medium">{user?.displayName}</div>
                  </span>
                  <p className="text-sm text-c3">{user?.email}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </PopUpWrapper>
  );
};

export default UsersPopUp;
