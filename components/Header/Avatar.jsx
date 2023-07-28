import Image from "next/image";
import React from "react";

const Avatar = ({ size, user, onClick }) => {
  let s = 0;
  let c = "";
  let f = "";
  switch (size) {
    case "small":
      s = 32;
      c = "w-8 h-8";
      break;
    case "medium":
      s = 36;
      c = "w-9 h-9";
      break;
    case "large":
      s = 56;
      c = "w-10 h-10";
      f = "text-2xl";
      break;
    case "x-large":
      s = 96;
      c = "w-24 h-24";
      f = "text-4xl";
      break;
    default:
      s = 40;
      c = "w-24 h-24";
      f = "text-base";
      break;
  }

  return (
    <div
      className={`${c} rounded-full flex items-center justify-center text-base shrick-0 relative`}
      style={{ backgroundColor: user?.color }}
      onClick={onClick}
    >
      {user?.photoURL ? (
        <div className={`${c} overflow-hidden rounded-full`}>
          <Image src={user?.photoURL} alt="user profile" width={s} height={s} />{" "}
        </div>
      ) : (
        <div className={`uppercase font-semibold ${f}`}>
          {user?.displayName.charAt(0)}{" "}
        </div>
      )}
    </div>
  );
};

export default Avatar;
