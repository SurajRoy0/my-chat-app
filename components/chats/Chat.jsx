import React from "react";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import useChatContext from "@/Context/chatContext";
import ChatCompose from "./ChatCompose";
import useAuth from "@/Context/authContext";

const Chat = () => {
  const { currentUser } = useAuth();
  const { data, users } = useChatContext();

  const isUserBlocked = users[currentUser.uid].blockedUsers?.find(
    (user) => user === data?.user?.uid
  );

  const isCurrentUserBlocked = users[data.user.uid]?.blockedUsers?.find(
    (user) => user === currentUser.uid
  );

  console.log(isCurrentUserBlocked, isUserBlocked);
  return (
    <div className="flex flex-col p-5 grow">
      <ChatHeader />
      {data.chatId && <Messages />}

      {!isUserBlocked && !isCurrentUserBlocked && <ChatCompose />}
      {isUserBlocked && (
        <div className="w-full text-center text-c3 py-5">
          {`You have blocked ${data?.user.displayName}!`}
        </div>
      )}
      {isCurrentUserBlocked && (
        <div className="w-full text-center text-c3 py-5">
          {`${data?.user.displayName} has blocked you!`}
        </div>
      )}
    </div>
  );
};

export default Chat;
