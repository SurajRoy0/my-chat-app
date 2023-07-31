import React, { useState } from "react";

import { BiEdit, BiCheck } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { MdAddAPhoto, MdDeleteForever, MdPhotoCamera } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import Avatar from "./Avatar";
import useAuth from "@/Context/authContext";
import Icon from "../Icon";
import { profileColors } from "@/utils/constant";
import { toast } from "react-toastify";
import ToastMessage from "@/components/alerts/ToastMessage";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth, storage } from "@/firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import UsersPopUp from "../PopUps/UsersPopUp";

const LeftNav = () => {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  const [isUsersPopUpOpen, setIsUsersPopUpOpen] = useState(false);
  const { currentUser, signOut, setCurrentUser } = useAuth();

  const authUser = auth?.currentUser;

  const uploadImageToFirestore = (file) => {
    try {
      if (file) {
        const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

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
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                updateProfileHandler("PHOTO", downloadURL);
              }
            );
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfileHandler = (type, value) => {
    let obj = { ...currentUser };
    switch (type) {
      case "COLOR":
        obj.color = value;
        break;
      case "NAME":
        obj.displayName = value;
        break;
      case "PHOTO":
        obj.photoURL = value;
        break;
      case "PHOTO_REMOVE":
        obj.photoURL = null;
        break;
      default:
        break;
    }

    try {
      toast.promise(
        async () => {
          const userDocRef = doc(db, "users", currentUser?.uid);
          await updateDoc(userDocRef, obj);
          setCurrentUser(obj);
          console.log(obj);
          if (type === "PHOTO") {
            console.log(value);
            await updateProfile(authUser, {
              photoURL: value,
            });
          }

          if (type === "PHOTO_REMOVE") {
            await updateProfile(authUser, {
              photoURL: null,
            });
          }

          if (type === "NAME") {
            await updateProfile(authUser, {
              displayName: value,
            });
          }
          setNameEdited(false);
        },
        {
          pending: "Updating profile!",
          success: "Profile updated successfully!",
          error: "Profile update faild!",
        },
        {
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onKeyUpHandler = (e) => {
    if (
      e.target.innerText.trim() !== currentUser.displayName &&
      e.target.innerText.trim() !== ""
    ) {
      setNameEdited(true);
    } else {
      setNameEdited(false);
    }
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter" && e.keyCode === 13) e.preventDefault();
  };

  const editProfileContainer = () => {
    return (
      <div className="relative flex flex-col items-center">
        <ToastMessage />
        <Icon
          size={"small"}
          className="absolute top-0 right-5 hover:bg-c2"
          icon={<IoClose size={20} />}
          onclick={() => setEditProfileOpen(false)}
        />
        <div className="relative group cursor-pointer">
          <Avatar size="x-large" user={currentUser} />
          <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex ">
            <label htmlFor="fileUpload">
              {currentUser?.photoURL ? (
                <MdPhotoCamera size={34} className="cursor-pointer" />
              ) : (
                <MdAddAPhoto size={34} className="cursor-pointer" />
              )}
            </label>
            <input
              id="fileUpload"
              type="file"
              onChange={(e) => uploadImageToFirestore(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
          {currentUser?.photoURL && (
            <div
              onClick={() => updateProfileHandler("PHOTO_REMOVE")}
              className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0"
            >
              <MdDeleteForever size={14} />
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center gap-2">
            {!nameEdited && <BiEdit className="text-c3" />}
            {nameEdited && (
              <BsFillCheckCircleFill
                className="text-c4 cursor-pointer"
                onClick={() =>
                  updateProfileHandler(
                    "NAME",
                    document.getElementById("displayNameEdit").innerText
                  )
                }
              />
            )}
            <div
              className="bg-transparent outline-none border-none text-center"
              contentEditable
              id="displayNameEdit"
              onKeyUp={onKeyUpHandler}
              onKeyDown={onKeyDownHandler}
            >
              {currentUser?.displayName}
            </div>
          </div>
          <span className="text-c3 text-sm">{currentUser.email}</span>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-5">
          {profileColors.map((color, index) => (
            <span
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125`}
              style={{ backgroundColor: color }}
              onClick={() => updateProfileHandler("COLOR", color)}
            >
              {color === currentUser?.color && <BiCheck size={24} />}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        editProfileOpen ? "w-[350px]" : "w-[80px] items-center"
      } flex flex-col justify-between py-5 shrink-0 transition-all`}
    >
      {editProfileOpen ? (
        editProfileContainer()
      ) : (
        <div
          className="relative group cursor-pointer"
          onClick={() => setEditProfileOpen(true)}
        >
          <Avatar size="large" user={currentUser} />
          <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
            <BiEdit size={14} />
          </div>
        </div>
      )}

      <div
        className={`${
          editProfileOpen ? "ml-5" : "flex-col items-center"
        } flex gap-5`}
      >
        <Icon
          size={"x-large"}
          className={"bg-green-500 hover:bg-gray-600"}
          icon={<FiPlus size={24} />}
          onclick={() => setIsUsersPopUpOpen(true)}
        />
        <Icon
          size={"x-large"}
          className={" hover:bg-c2"}
          icon={<IoLogOutOutline size={24} />}
          onclick={signOut}
        />
      </div>
      {isUsersPopUpOpen && (
        <UsersPopUp
          closePopUp={() => setIsUsersPopUpOpen(false)}
          title="Find Users"
        />
      )}
    </div>
  );
};

export default LeftNav;
