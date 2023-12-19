import React from "react";

const DashboardHeader = (): React.JSX.Element => {
  return (
    <>
      <div className="flex justify-center items-center p-4 bg-sky-500 text-3xl text-white mx-2 rounded-md mt-2">
        <h1 className="uppercase font-semibold">Aplikasi Manajemen Proyek</h1>
      </div>
    </>
  );
};

export default DashboardHeader;
