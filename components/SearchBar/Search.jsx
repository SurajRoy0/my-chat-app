import { db } from "@/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "../Header/Avatar";
import useAuth from "@/Context/authContext";
import useChatContext from "@/Context/chatContext";

const Search = (props) => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useAuth();
  const { dispatch } = useChatContext();

  const searchQueryHandler = async () => {
    if (!!userName) {
      try {
        setError(false);
        const searchUsersRef = collection(db, "users");
        const q = query(searchUsersRef, where("displayName", "==", userName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setError(true);
          setUser(null);
        } else {
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        }
      } catch (error) {
        setError(error);
      }
    }
  };

  const onKeyUpHandler = (e) => {
    if (e.code === "Enter") {
      searchQueryHandler();
    }
  };

  const selectUserHandler = async (user) => {
    try {
      const combinedChatId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      const res = await getDoc(doc(db, "chats", combinedChatId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedChatId), {
          messages: [],
        });

        const currentUserChatRef = await getDoc(
          doc(db, "userChats", currentUser.uid)
        );

        const userChatRef = await getDoc(doc(db, "userChats", user.uid));

        if (!currentUserChatRef.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedChatId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || null,
            color: user.color,
          },
          [combinedChatId + ".date"]: serverTimestamp(),
        });

        if (!userChatRef.exists()) {
          await setDoc(doc(db, "userChats", user.uid), {});
        }
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedChatId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL || null,
            color: currentUser.color,
          },
          [combinedChatId + ".date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedChatId + ".chatDeleted"]: false,
        });
      }
      dispatch({ type: "CHANGE_USER", payload: user });
      setUser(null);
      setUserName("");
      props.closePopUpHandler();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="shrink-0">
      <div className="relative">
        <RiSearch2Line className="absolute top-4 left-4 text-c3" />
        <input
          type="text"
          placeholder="Search User"
          onChange={(e) => setUserName(e.target.value)}
          onKeyUp={onKeyUpHandler}
          value={userName}
          autoFocus
          className="w-full h-12 rounded-xl bg-c1/[0.5] pl-11 pr-16 placeholder:text-c3 outline-none text-base"
        />
        <span
          className="absolute top-[14px] right-4 text-sm text-c3 cursor-pointer"
          onClick={searchQueryHandler}
        >
          Search
        </span>
      </div>
      {error && (
        <>
          <div className="mt-5 w-full text-center text-sm">User Not Found!</div>
          <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
        </>
      )}
      {user && (
        <>
          {" "}
          <div
            onClick={() => selectUserHandler(user)}
            className=" mt-3 flex items-center gap-4 rounded-full hover:bg-c5 py-2 px-4 cursor-pointer"
          >
            <Avatar size="large" user={user} />
            <div className="flex flex-col grow">
              <span className="text-base text-white flex items-center justify-between">
                <div className="font-medium">{user?.displayName}</div>
              </span>
              <p className="text-sm text-c3">{user?.email}</p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/[0.1] mt-3"></div>
        </>
      )}
    </div>
  );
};

export default Search;
