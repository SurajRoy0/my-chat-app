import React, { useEffect, useRef } from "react";
import ClickAwayListener from "react-click-away-listener";

const MessageMenu = ({
  setEditMessage,
  setShowMenu,
  self,
  showMenu,
  deletePopupHandler,
}) => {
  const ref = useRef();
  const clickAwayHandler = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    ref?.current?.scrollIntoViewIfNeeded();
  }, [showMenu]);
  return (
    <ClickAwayListener onClickAway={clickAwayHandler}>
      <div
        ref={ref}
        className={`w-[200px] absolute top-8 ${
          self ? "right-0" : "top-0"
        } bg-c0 z-10 rounded-md overflow-hidden`}
      >
        <ul className="flex flex-col py-2">
          {self && (
            <li
              onClick={(e) => {
                e.stopPropagation();
                setEditMessage();
                setShowMenu(false);
              }}
              className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
            >
              Edit Message
            </li>
          )}
          <li
            onClick={(e) => {
              e.stopPropagation();
              deletePopupHandler(true);
            }}
            className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
          >
            Delete Message
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};

export default MessageMenu;
