import React, { useEffect, useState } from "react";
import useChatContext from "@/Context/chatContext";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "../Header/Avatar";
import useAuth from "@/Context/authContext";
import { formatDateConditionally } from "@/utils/formattedDate";

const Chats = () => {
  const [search, setSearch] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const {
    dispatch,
    users,
    setUsers,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    data,
    setInputText,
    setAttachment,
    setAttachmentPreview,
    setEditMessage,
    setImageViewer,
  } = useChatContext();

  const { currentUser } = useAuth();

  useEffect(() => {
    const documentsIds = Object.keys(chats);
    if (documentsIds.length === 0) return;

    const q = query(
      collection(db, "chats"),
      where("__name__", "in", documentsIds)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let msgs = {};
      snapshot?.forEach((doc) => {
        if (doc.id !== data.chatId) {
          msgs[doc.id] = doc?.data().messages?.filter((msg) => {
            return (
              msg?.read === false &&
              msg?.deletedInfo?.deletedForEveryone !== true &&
              msg?.sender !== currentUser.uid
            );
          });
        }
        Object.keys(msgs || {})?.map((c) => {
          if (msgs[c]?.length < 1) {
            delete msgs[c];
          }
        });
      });
      setUnreadMessages(msgs);
    });
    return () => unsub();
  }, [chats, selectedChat]);

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const availableUsers = {};
      snapshot.forEach((doc) => {
        availableUsers[doc.id] = doc.data();
      });
      setUsers(availableUsers);
    });
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          setChats(doc.data());
        }
      });
    };
    currentUser.uid && getChats();
  }, []);

  const filteredChatsResult = Object.entries(chats || {})
    .filter(([, chat]) =>
      chat?.userInfo?.displayName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b[1].date - a[1].date);

  const readChatHandler = async (selectedChatId) => {
    const chatRef = doc(db, "chats", selectedChatId);
    const chatDoc = await getDoc(chatRef);

    const updatedMessages = chatDoc?.data()?.messages?.map((msg) => {
      if (msg?.read === false) {
        msg.read = true;
      }

      return msg;
    });

    await updateDoc(chatRef, {
      messages: updatedMessages,
    });
  };

  const selectedChatHandler = (user, selectedChatId) => {
    setInputText("");
    setAttachment(null);
    setAttachmentPreview(null);
    setEditMessage(null);
    setImageViewer(null);
    setSelectedChat(user);

    dispatch({ type: "CHANGE_USER", payload: user });

    if (unreadMessages?.[selectedChatId]?.length > 0) {
      readChatHandler(selectedChatId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center w-full bg-c2 py-5">
        <RiSearch2Line className="absolute top-9 left-4 text-c3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Chat"
          className="w-full h-12 rounded-xl bg-c1/[0.5] pl-11 pr-16 placeholder:text-c3 outline-none text-base"
        />
      </div>
      <ul className="flex flex-col w-full my-5 gap-[2px]">
        {Object.keys(users || {}).length > 0 &&
          filteredChatsResult?.map((chat) => {
            const timestamp = new Timestamp(
              chat[1]?.date?.seconds,
              chat[1]?.date?.nanoseconds
            );
            const date = timestamp.toDate();
            const user = users[chat[1].userInfo.uid];
            return (
              <li
                key={chat[0]}
                onClick={() => selectedChatHandler(user, chat[0])}
                className={`h-[60px] flex items-center gap-4 rounded-xl hover:bg-c1 p-4 cursor-pointer ${
                  selectedChat?.uid === user?.uid ? "bg-c1" : ""
                }`}
              >
                <Avatar size="large" user={user} />
                <div className="flex flex-col grow relative">
                  <span className="text-base text-white flex items-center justify-between ">
                    <div className="font-medium">{user?.displayName}</div>
                    <div className="text-c3 text-xs">
                      {formatDateConditionally(date)}
                    </div>
                  </span>
                  <span className="text-base text-white flex items-center justify-between ">
                    <p className="text-sm text-c3 line-clamp-1 break-all">
                      {chat[1]?.lastMessage?.text ||
                        (chat[1]?.lastMessage?.imgURL && "Image") ||
                        "Send first message!"}
                    </p>
                    {!!unreadMessages?.[chat[0]]?.length && (
                      <span className="min-w-[20px] h-5 rounded-full bg-green-500 flex justify-center items-center">
                        {unreadMessages?.[chat[0]]?.length}
                      </span>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Chats;
