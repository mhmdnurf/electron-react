import React from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";

const BackButton = (): React.JSX.Element => {
  return (
    <>
      <Link to={"/"} className="ml-4">
        <div className="inline-block bg-sky-700 p-2 rounded-md m-2 hover:bg-sky-800 hover:transform hover:scale-110">
          <div className="flex">
            <GoArrowLeft size={30} color="white" />
            <h1 className="ml-2 pr-4 text-white font-semibold text-xl">Back</h1>
          </div>
        </div>
      </Link>
    </>
  );
};

export default BackButton;
