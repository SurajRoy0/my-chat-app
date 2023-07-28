import React from "react";

const Icon = ({ size, icon, onclick, className }) => {
  let c = "";
  switch (size) {
    case "small":
      c = "w-8 h-8";
      break;
    case "medium":
      c = "w-9 h-9";
      break;
    case "large":
      c = "w-10 h-10";
      break;
    default:
      c = "w-12 h-12";
      break;
  }
  return (
    <div
      className={`${c} rounded-full flex items-center justify-center hover:bg-c1 cursor-pointer ${className}`}
      onClick={onclick}
    >
      {icon && icon}
    </div>
  );
};

export default Icon;
