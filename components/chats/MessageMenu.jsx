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
        className={`md:w-[200px] w-[130px] absolute top-8 ${
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
              className="flex items-center md:py-3 md:px-5 py-1 px-2 md:text-base text-[14px] hover:bg-black cursor-pointer"
            >
              Edit Message
            </li>
          )}
          <li
            onClick={(e) => {
              e.stopPropagation();
              deletePopupHandler(true);
            }}
            className="flex items-centermd:py-3 md:px-5 py-1 px-2 md:text-base text-[14px] hover:bg-black cursor-pointer"
          >
            Delete Message
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};

export default MessageMenu;
