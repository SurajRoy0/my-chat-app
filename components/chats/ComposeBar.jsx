import useAuth from "@/Context/authContext";
import useChatContext from "@/Context/chatContext";
import { db, storage } from "@/firebase/firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect } from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuid } from "uuid";

let typingTimeout = null;

const ComposeBar = () => {
  const {
    inputText,
    setInputText,
    data,
    attachment,
    setAttachmentPreview,
    setAttachment,
    editMessage,
    setEditMessage,
  } = useChatContext();
  const { currentUser } = useAuth();

  const messageTypingHandler = async (e) => {
    setInputText(e.target.value);
    await updateDoc(doc(db, "chats", data.chatId), {
      [`typing.${currentUser.uid}`]: true,
    });

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(async () => {
      await updateDoc(doc(db, "chats", data.chatId), {
        [`typing.${currentUser.uid}`]: false,
      });
      typingTimeout = null;
    }, 500);
  };

  const onKeyUpHandler = (e) => {
    if (e.key === "Enter") {
      if (editMessage) {
        editMessageHandler();
      } else {
        sendMessageHandler();
      }
    }
  };

  useEffect(() => {
    setInputText(editMessage?.text || "");
  }, [editMessage]);

  const sendMessageHandler = async () => {
    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: inputText,
                sender: currentUser.uid,
                date: Timestamp.now(),
                read: false,
                imgURL: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      if (inputText) {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: inputText,
            sender: currentUser.uid,
            date: Timestamp.now(),
            read: false,
          }),
        });
      }
    }
    let msg = { text: inputText };
    if (attachment) {
      msg.imgURL = true;
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: msg,
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: msg,
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setInputText("");
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const editMessageHandler = async () => {
    const msgId = editMessage.id;
    const chatRef = doc(db, "chats", data.chatId);

    const chatDoc = await getDoc(chatRef);

    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const updatedMessages = chatDoc?.data().messages?.map((msg) => {
              if (msgId === msg.id) {
                msg.text = inputText;
                msg.imgURL = downloadURL;
              }
              return msg;
            });
            await updateDoc(chatRef, {
              messages: updatedMessages,
            });
          });
        }
      );
    } else {
      if (inputText) {
        const updatedMessages = chatDoc?.data()?.messages?.map((msg) => {
          if (msgId === msg.id) {
            msg.text = inputText;
          }
          return msg;
        });
        await updateDoc(chatRef, {
          messages: updatedMessages,
        });
      }
    }
    setInputText("");
    setAttachment(null);
    setAttachmentPreview(null);
    setEditMessage(null);
  };

  return (
    <div className="flex items-center gap-2 grow">
      <input
        type="text"
        className="grow w-full outline-none px-2 py-2 text-white bg-transparent placeholder:text-c3 text-base"
        placeholder="Type Message"
        value={inputText}
        onChange={messageTypingHandler}
        onKeyUp={onKeyUpHandler}
      />
      <button
        onClick={() => {
          if (editMessage) {
            editMessageHandler();
          } else {
            sendMessageHandler();
          }
        }}
        className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${
          inputText.trim().length > 0 ? "bg-c4" : ""
        }`}
      >
        <TbSend size={25} className="text-white" />
      </button>
    </div>
  );
};

export default ComposeBar;
