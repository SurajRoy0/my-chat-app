import React from "react";
import PopUpWrapper from "./PopUpWrapper";
import useAuth from "@/Context/authContext";
import useChatContext from "@/Context/chatContext";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Icon from "../Icon";
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from "@/utils/constant";

const DeleteMessagePopup = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();

  return (
    <PopUpWrapper {...props}>
      <div className="mt-3 mb-5">
        <div className="flex justify-end items-center mb-2">
          <Icon
            size="small"
            icon={<IoClose size={20} />}
            onclick={props.onHide}
          />
        </div>
        <div className="flex items-center justify-center gap-3">
          <RiErrorWarningLine size={24} className="text-red-500" />
          <div className="text-lg">Are you sure, want to delete message?</div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => {
              props.deleteMessageHandler(DELETED_FOR_ME);
            }}
            className="border-[2px] w-[170px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete for me
          </button>
          {props.self && (
            <button
              onClick={() => {
                props.deleteMessageHandler(DELETED_FOR_EVERYONE);
              }}
              className="border-[2px] w-[170px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
            >
              Delete for everyone
            </button>
          )}
        </div>
      </div>
    </PopUpWrapper>
  );
};

export default DeleteMessagePopup;
