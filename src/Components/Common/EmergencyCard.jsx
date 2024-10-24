import React from "react";
import { convertTimestampToFormattedDate } from "../../utils/other";
export const EmergencyCard = ({ cardData }) => {
  let borderColorClass;
  let textColorClass;
  const colorCodeType = cardData?.codetype?.toLowerCase();
  switch (colorCodeType) {
    case "red":
      borderColorClass = "border-[#ff0000]";
      textColorClass = "text-[#ff0000]";
      break;
    case "pink":
      borderColorClass = "border-[#ffc0cb]";
      textColorClass = "text-[#ffc0cb]";
      break;
    case "blue (adult)":
      borderColorClass = "border-[#0000ff]";
      textColorClass = "text-[#0000ff]";
      break;
    case "blue (peadiatric)":
      borderColorClass = "border-[#0000ff]";
      textColorClass = "text-[#0000ff]";
      break;
    case "grey":
      borderColorClass = "border-[#808080]";
      textColorClass = "text-[#808080]";
      break;
    case "purple":
      borderColorClass = "border-[#800080]";
      textColorClass = "text-[#800080]";
      break;
    case "hazmat":
      borderColorClass = "border-[#008000]";
      textColorClass = "text-[#008000]";
      break;
    default:
      borderColorClass = "border-black";
      textColorClass = "text-black";
      break;
  }

  return (
    <>
      <span
        className={`bg-gray-100 border-l-4 ${borderColorClass} group flex items-center justify-start rounded-lg px-3 py-2.5 cursor-pointer ease-in-out duration-150`}
        data-color={`${cardData?.codetype?.toLowerCase()}`}
      >
        <ul className="w-full border-red-600 list-none">
          <li className="flex justify-between py-0.5">
            <span className="text-gray-600 font-medium">Code</span>
            <span className={`${textColorClass} font-semibold`}>
              {cardData.codetype || cardData.codeType}
            </span>
          </li>
          <li className="flex justify-between py-0.5">
            <span className="text-gray-600 font-medium">Id</span>
            <span className="font-semibold">{cardData.id}</span>
          </li>
          <li className="flex justify-between py-0.5">
            <span className="text-gray-600 font-medium">Location</span>
            <span className="font-semibold">
              {cardData.locationName || cardData.locationDetails}
            </span>
          </li>
          <li className="flex justify-between py-0.5">
            <span className="text-gray-600 font-medium">Reported on</span>
            <span className="font-semibold">
              {convertTimestampToFormattedDate(cardData?.createdOn) || "--"}
            </span>
          </li>
          <li className="flex justify-between py-0.5">
            <span className="text-gray-600 font-medium">Status</span>
            <span className="font-semibold">{cardData.status}</span>
          </li>
        </ul>
      </span>
    </>
  );
};
