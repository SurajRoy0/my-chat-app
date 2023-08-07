import React from "react";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import useChatContext from "@/Context/chatContext";
import ChatCompose from "./ChatCompose";

const Chat = () => {
  const { data } = useChatContext();
  return (
    <div className="flex flex-col p-5 grow">
      <ChatHeader />
      {data.chatId && <Messages />}
      <ChatCompose />
    </div>
  );
};

export default Chat;
