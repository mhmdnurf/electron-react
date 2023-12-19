import React from "react";
import { Link } from "react-router-dom";

interface Menu {
  title: string;
  link?: string;
  bgColor?: string;
}

const MenuButton = ({
  title,
  link = "#",
  bgColor,
}: Menu): React.JSX.Element => {
  const handleExit = () => {
    title === "Keluar" && console.log("Keluar");
  };
  return (
    <>
      <div className="flex justify-center items-center">
        <Link
          to={`/${link}`}
          onClick={handleExit}
          className={`${bgColor} flex justify-center items-center font-semibold rounded-lg hover:transform hover:scale-110 text-white w-[300px] h-[100px] text-3xl mt-4`}
        >
          {title}
        </Link>
      </div>
    </>
  );
};
export default MenuButton;
