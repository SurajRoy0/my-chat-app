import useAuth from "@/Context/authContext";
import useChatContext from "@/Context/chatContext";
import React, { useState } from "react";
import Avatar from "../Header/Avatar";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { formatDateConditionally } from "@/utils/formattedDate";
import { wrapEmojisInHtmlTag } from "@/utils/addingHtmlTag";
import { GoChevronDown } from "react-icons/go";
import Icon from "../Icon";
import MessageMenu from "./MessageMenu";
import DeleteMessagePopup from "../PopUps/DeleteMessagePopup";
import { db } from "@/firebase/firebase";
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from "@/utils/constant";

const Message = ({ msg }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { currentUser } = useAuth();
  const { users, data, imageViewer, setImageViewer, setEditMessage } =
    useChatContext();
  const self = msg.sender === currentUser.uid;

  const timestamp = new Timestamp(msg?.date?.seconds, msg?.date?.nanoseconds);
  const date = timestamp.toDate();

  const deletePopupHandler = () => {
    setShowDeletePopup(true);
    setShowMenu(false);
  };

  const deleteMessageHandler = async (action) => {
    try {
      const msgId = msg.id;
      const chatRef = doc(db, "chats", data.chatId);

      const chatDoc = await getDoc(chatRef);

      const updatedMessages = chatDoc.data().messages.map((message) => {
        if (message.id === msgId) {
          if (action === DELETED_FOR_ME) {
            message.deletedInfo = {
              [currentUser.uid]: DELETED_FOR_ME,
            };
          }

          if (action === DELETED_FOR_EVERYONE) {
            message.deletedInfo = {
              deletedForEveryone: true,
            };
          }
        }
        return message;
      });
      await updateDoc(chatRef, { messages: updatedMessages });
      setShowDeletePopup(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
      {showDeletePopup && (
        <DeleteMessagePopup
          deleteMessageHandler={deleteMessageHandler}
          noHeader={true}
          shortHeight={true}
          self={self}
          onHide={() => {
            setShowDeletePopup(false);
          }}
          className="DeleteMsgPopup"
        />
      )}
      <div
        className={`flex items-end gap-3 mb-1 ${
          self ? "justify-start flex-row-reverse" : ""
        }`}
      >
        <Avatar
          size="small"
          user={self ? currentUser : users[data.user.uid]}
          className="mb-4"
        />
        <div
          className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${
            self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"
          }`}
        >
          {msg.text && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: wrapEmojisInHtmlTag(msg.text),
              }}
            ></div>
          )}
          {msg.imgURL && (
            <>
              <Image
                src={msg.imgURL}
                width={250}
                height={250}
                alt={msg?.text || ""}
                onClick={() =>
                  setImageViewer({
                    msgId: msg.id,
                    url: msg.imgURL,
                  })
                }
              />
              {imageViewer && imageViewer.msgId === msg.id && (
                <ImageViewer
                  src={[imageViewer.url]}
                  currentIndex={0}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={() => setImageViewer(null)}
                />
              )}
            </>
          )}
          <div
            className={`${
              showMenu ? "" : "hidden"
            } group-hover:flex absolute top-2 ${
              self ? "left-2 bg-c5" : "right-2 bg-c1"
            }`}
            onClick={() => setShowMenu(true)}
          >
            <Icon
              size="medium"
              className="hover:bg-inherit rounded-none"
              icon={<GoChevronDown size={24} className="text-c3" />}
            />
            {showMenu && (
              <MessageMenu
                self={self}
                setShowMenu={setShowMenu}
                showMenu={showMenu}
                deletePopupHandler={deletePopupHandler}
                setEditMessage={() => setEditMessage(msg)}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex items-end ${
          self ? "justify-start flex-row-reverse mr-12" : "ml-12"
        }`}
      >
        <div className="text-xs text-c3">{formatDateConditionally(date)}</div>
      </div>
    </div>
  );
};

export default Message;
