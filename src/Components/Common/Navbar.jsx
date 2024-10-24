import React from "react";
import { HeaderUserWidget } from "./HeaderUserWidget";
import { BsHouse } from "react-icons/bs";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
// import { Tb3DCubeSphere } from "react-icons/tb";
import { HiCubeTransparent } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Navbar = ({ sessionData, toggleSidebar }) => {
  const handleJump = () => {
    window.location.href = "/apps";
  };
  return (
    <div className="w-full sticky left-0 top-0 right-0 flex flex-row justify-between items-center py-1 px-5 md:px-8 lg:px-10 z-[2] bg-white shadow">
      <div className={`flex justify-center items-center font-semibold text-xl py-5 px-0 lg:p-5 hamburger-menu-holder`}>
        <button type="button" onClick={toggleSidebar}>
            <HiOutlineMenuAlt2 size={'20px'} className="mr-3" />
        </button>
        <p>Contract Management System</p>
      </div>
      <div className="flex flex-row justify-center items-center gap-5">
        <Link to={"/"}>
          <BsHouse size={"20px"} />
        </Link>
        <HiCubeTransparent size={"20px"} onClick={handleJump} className="cursor-pointer"/>
        {/* <BsBell size={'20px'} /> */}
        <HeaderUserWidget sessionData={sessionData} />
      </div>
    </div>
  );
};

export default Navbar;
