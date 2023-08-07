import useAuth from "@/Context/authContext";
import useChatContext from "@/Context/chatContext";
import React from "react";
import Avatar from "../Header/Avatar";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";
import { Timestamp } from "firebase/firestore";
import { formatDateConditionally } from "@/utils/formattedDate";
import { wrapEmojisInHtmlTag } from "@/utils/addingHtmlTag";

const Message = ({ msg }) => {
  const { currentUser } = useAuth();
  const { users, data, imageViewer, setImageViewer } = useChatContext();
  const self = msg.sender === currentUser.uid;

  const timestamp = new Timestamp(msg?.date?.seconds, msg?.date?.nanoseconds);
  const date = timestamp.toDate();
  return (
    <div className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
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
