import React, { useEffect, useState, useContext } from "react";
import { BsChevronDown, BsPower } from "react-icons/bs";
import { fetchLogoutSession } from "../../Services/sessionService";
import { removeLocalStorage } from "../../utils/functions";
import UserContext from "../../context/UserContext";

export const HeaderUserWidget = ({ sessionData }) => {
  const unitNamee = localStorage.getItem("unitName");
  const [unitName, setUnitName] = useState();
  const [isOrganisationListVisible, setOrganisationListVisible] = useState(false);
  const { organisation } = useContext(UserContext);

  useEffect(() => {
    setUnitName(unitNamee);
  }, [unitNamee, organisation]);

  const handleLogout = async () => {
    try {
      const response = await fetchLogoutSession();
      if (response?.status === true) {
        removeLocalStorage();
        window.location.href = "/login";
      } else {
        removeLocalStorage();
        window.location.href = "/login";
      }
    } catch (error) {
      removeLocalStorage();
      window.location.href = "/login";
      console.error("Error:", error);
    }
  };

  function getAbbreviation(str = "Jupiter Hospital") {
    const words = str?.split(" ");
    let abbreviation = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.length > 0) {
        abbreviation += word[0].toUpperCase();
      }
    }
    return abbreviation;
  }

  return (
    <div className="relative">
      <button
        className="group transition-all duration-200 focus:overflow-visible w-max h-max p-0 overflow-hidden flex flex-row items-center justify-center bg-white gap-2"
        onClick={() => setOrganisationListVisible(!isOrganisationListVisible)}
      >
        <span className="flex items-center">
          <span className="w-8 h-8 block bg-blue-700 text-white rounded-full inline-flex items-center justify-center font-bold text-sm me-2">
            {sessionData && getAbbreviation(sessionData?.displayName)}
          </span>
          <span className="text-start leading-none me-3 hidden lg:block">
            <span className="font-bold block">{sessionData?.displayName}</span>
            <span className="text-xs">{unitName}</span>
          </span>
          <BsChevronDown className={`transition-transform ${isOrganisationListVisible ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isOrganisationListVisible && (
        <div className="absolute shadow-lg top-12 right-0 w-52 max-h-[200px] overflow-y-auto p-2 bg-white border border-zinc-200 rounded-lg flex flex-col gap-2 z-50">
          {organisation?.length && organisation?.map((org, index) => (
            <p
              key={index}
              onClick={() => {
                setUnitName(org?.name);
                localStorage.setItem("unitId", org?.id);
                localStorage.setItem("unitName", org?.name);
                window.location.reload();
              }}
              className={`flex flex-row gap-2 items-center ${unitName === org?.name ? "bg-zinc-200" : ""} hover:bg-zinc-200 p-2 rounded-lg cursor-pointer`}
            >
              {org?.name}
            </p>
          ))}

          <span
            onClick={handleLogout}
            className="flex flex-row gap-2 items-center hover:bg-zinc-100 p-2 rounded-lg cursor-pointer"
          >
            <BsPower />
            <p>Logout</p>
          </span>
        </div>
      )}
    </div>
  );
};
