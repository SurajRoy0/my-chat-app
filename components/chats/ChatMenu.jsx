import useAuth from "@/Context/authContext";
import useChatContext from "@/Context/chatContext";
import { db } from "@/firebase/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import ClickAwayListener from "react-click-away-listener";

const ChatMenu = ({ setShowMenu }) => {
  const { currentUser } = useAuth();
  const { data, users, dispatch } = useChatContext();

  const isUserBlocked = users[currentUser.uid].blockedUsers?.find(
    (user) => user === data.user.uid
  );

  const isCurrentUserBlocked = users[data.user.uid]?.blockedUsers?.find(
    (user) => user === currentUser.uid
  );

  const clickAwayHandler = () => {
    setShowMenu(false);
  };

  const userBlockingHandler = async (action) => {
    if (action === "BLOCK_USER") {
      await updateDoc(doc(db, "users", currentUser.uid), {
        blockedUsers: arrayUnion(data?.user?.uid),
      });
    }

    if (action === "UNBLOCK_USER") {
      await updateDoc(doc(db, "users", currentUser.uid), {
        blockedUsers: arrayRemove(data?.user?.uid),
      });
    }
  };

  const chatDeleteHandler = async () => {
    try {
      const chatRef = doc(db, "chats", data.chatId);
      const chatDoc = await getDoc(chatRef);

      const updatedMessages = chatDoc?.data()?.messages?.map((msg) => {
        msg.deleteChatInfo = {
          ...msg.deleteChatInfo,
          [currentUser.uid]: true,
        };
        return msg;
      });
      await updateDoc(chatRef, {
        messages: updatedMessages,
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".chatDeleted"]: true,
      });

      dispatch({ type: "INITIAL_STATE" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ClickAwayListener onClickAway={clickAwayHandler}>
      <div className="w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden">
        <ul className="flex flex-col py-2">
          <li
            onClick={(e) => {
              e.stopPropagation();
              chatDeleteHandler();
              setShowMenu(false);
            }}
            className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
          >
            Delete Chat
          </li>
          {!isCurrentUserBlocked && (
            <li
              onClick={(e) => {
                e.stopPropagation();
                userBlockingHandler(
                  isUserBlocked ? "UNBLOCK_USER" : "BLOCK_USER"
                );
              }}
              className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
            >
              {isUserBlocked ? "Unblock User" : "Block User"}
            </li>
          )}
        </ul>
      </div>
    </ClickAwayListener>
  );
};

export default ChatMenu;
