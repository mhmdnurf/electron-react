import React from "react";
import MenuButton from "../components/MenuButton";
import DashboardHeader from "../components/DashboardHeader";

const Dashboard = (): React.JSX.Element => {
  return (
    <>
      <DashboardHeader />
      <MenuButton
        title="Form Jadwal"
        bgColor="bg-lime-500"
        link="form-jadwal"
      />
      <MenuButton
        title="Form Anggaran"
        bgColor="bg-blue-500"
        link="form-anggaran"
      />
      <MenuButton title="Keluar" bgColor="bg-red-500" />
    </>
  );
};

export default Dashboard;
