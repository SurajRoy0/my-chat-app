import React, { useEffect, useState } from "react";
import useChatContext from "@/Context/chatContext";
import { Timestamp, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "../Header/Avatar";
import useAuth from "@/Context/authContext";
import { formatDateConditionally } from "@/utils/formattedDate";

const Chats = () => {
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const {
    dispatch,
    users,
    setUsers,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = useChatContext();

  const { currentUser } = useAuth();

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
          const data = Object.entries(doc.data() || {});
          setChats(data);
        }
      });
    };
    currentUser.uid && getChats();
  }, []);

  useEffect(() => {
    const filteredChatsResult = chats.filter(([, chat]) =>
      chat?.userInfo?.displayName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredChats(filteredChatsResult);
  }, [search]);

  const selectedChatHandler = (user, selectedChatId) => {
    setSelectedChat(user);
    dispatch({ type: "CHANGE_USER", payload: user });
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
          filteredChats?.map((chat) => {
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
                        (chat[1]?.lastMessage?.img && "Image") ||
                        "Send first message!"}
                    </p>
                    <span className="min-w-[20px] h-5 rounded-full bg-green-500 flex justify-center items-center">
                      5
                    </span>
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
