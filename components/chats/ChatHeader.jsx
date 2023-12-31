import useChatContext from "@/Context/chatContext";
import React, { useEffect, useState } from "react";
import Avatar from "../Header/Avatar";
import Icon from "../Icon";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { FaArrowLeft } from 'react-icons/fa';
import ChatMenu from "./ChatMenu";

const ChatHeader = () => {
  const [showMenu, setShowMenu] = useState();

  const {
    dispatch,
    users,
    data,
  } = useChatContext();

  const isOnline = users[data.user.uid]?.isOnline;
  const user = users[data.user.uid];
  

  const chatCloseHandler = () => {
    dispatch({ type: "INITIAL_STATE"});
  }


   window.addEventListener('popstate', chatCloseHandler);

  return (
    <div className="flex justify-between items-center pb-5 border-b border-white/[0.5]">
      {user && (
        <div className="flex items-center justify-center gap-3">
          <span onClick={chatCloseHandler} className="cursor-pointer"><FaArrowLeft size={18}/></span>
        <div className="flex items-center gap-3">
          <Avatar size="large" user={user} />
          <div>
            <div className="font-medium">{user?.displayName}</div>
            <p className="text-sm text-c3">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Icon
          size="large"
          className={`${showMenu ? "bg-c1" : ""}`}
          onclick={() => setShowMenu(true)}
          icon={<IoEllipsisVerticalSharp size={20} className="text-c3" />}
        />
        {showMenu && <ChatMenu setShowMenu={setShowMenu} />}
      </div>
    </div>
  );
};

export default ChatHeader;
