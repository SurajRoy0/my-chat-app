import React, { useState } from "react";
import Icon from "../Icon";
import { CgAttachment } from "react-icons/cg";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import ComposeBar from "./ComposeBar";
import EmojiPicker from "emoji-picker-react";
import ClickAwayListener from "react-click-away-listener";
import useChatContext from "@/Context/chatContext";
import { IoClose } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";

const ChatCompose = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const screenWidth = window.innerWidth;
  const {
    isTyping,
    editMessage,
    setEditMessage,
    inputText,
    setInputText,
    setAttachment,
    attachmentPreview,
    setAttachmentPreview,
  } = useChatContext();
  const onFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
    if (file) {
      const AttachmentUrl = URL.createObjectURL(file);
      setAttachmentPreview(AttachmentUrl);
      console.log(AttachmentUrl);
    }
  };

  return (
    <div className="flex items-center bg-c1/[0.5] p-2 rounded-xl relative">
      {attachmentPreview && (
        <div className="absolute w-[100px] h-[100px] bottom-16 left-0 bg-c1 p-2 rounded-md">
          <img src={attachmentPreview} alt="" />
          <div
            className="w-6 h-6 rounded-full flex bg-red-500 justify-center items-center absolute -right-2 -top-2 cursor-pointer"
            onClick={() => {
              setAttachment(null);
              setAttachmentPreview(null);
            }}
          >
            <MdDeleteForever size={14} />
          </div>
        </div>
      )}
      <div className="shrink-0">
        <input
          type="file"
          id="fileUploader"
          className="hidden"
          onChange={onFileChange}
        />
        <label htmlFor="fileUploader">
          <Icon
            size="large"
            icon={<CgAttachment size={20} className="text-c3" />}
          />
        </label>
      </div>
      <div className="shrink-0  relative">
        <Icon
          size="large"
          className=""
          icon={
            <HiOutlineEmojiHappy
              size={24}
              className="text-c3"
              onClick={() => setShowEmojiPicker(true)}
            />
          }
        />
        {showEmojiPicker && (
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <div className="absolute bottom-12 left-0 shadow-lg">
              <EmojiPicker
                emojiStyle="native"
                theme="light"
                onEmojiClick={(emojiData) =>
                  setInputText((prevText) => (prevText += emojiData.emoji))
                }
                autoFocusSearch={false}
                
                height={screenWidth <= 768 ? 400 : 450}
                width={screenWidth <= 768 ? 272 : 350}
              />
            </div>
          </ClickAwayListener>
        )}
      </div>
      {isTyping && (
        <div className="absolute -top-6 left-4 bg-c2 w-full h-6">
          <div className="flex gap-2 w-full h-full opacity-50 text-sm text-white">
            {`Typing`}
            <img src="/typing.svg" alt="typing" />
          </div>
        </div>
      )}
      {editMessage && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-c4 flex items-center gap-2 py-2 px-2 rounded-full text-sm font-semibold cursor-pointer shadow-lg"
          onClick={() => setEditMessage(null)}
        >
          <span>Cancel Edit</span>
          <IoClose size={20} className="text-white" />
        </div>
      )}
      <ComposeBar />
    </div>
  );
};

export default ChatCompose;
