import useChatContext from "@/Context/chatContext";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useAuth from "@/Context/authContext";
import { DELETED_FOR_ME } from "@/utils/constant";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data, setIsTyping } = useChatContext();
  const { currentUser } = useAuth();
  const bottomScrollRef = useRef();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc?.data().messages);
        setIsTyping(doc?.data().typing?.[data.user.uid] || false);
      }
      setTimeout(() => {
        scrollToButton();
      }, 0);
    });
    return () => unsub();
  }, [data.chatId]);

  const scrollToButton = () => {
    const chatContainer = bottomScrollRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };
  return (
    <div
      ref={bottomScrollRef}
      className="grow p-5 overflow-auto scrollbar flex flex-col"
    >
      {messages
        ?.filter((msg) => {
          return (
            msg?.deletedInfo?.[currentUser.uid] !== DELETED_FOR_ME &&
            !msg?.deletedInfo?.deletedForEveryone &&
            !msg?.deletedInfo?.[currentUser.uid]
          );
        })
        ?.map((msg) => {
          return <Message msg={msg} key={msg.id} />;
        })}
    </div>
  );
};

export default Messages;
