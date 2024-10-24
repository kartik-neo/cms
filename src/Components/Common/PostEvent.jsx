import React from "react";
import "../../App.css";

const PostEvent = () => {
  let arrData = [
    { heading: "Activated By", value: "John Doe" },
    { heading: "Activation Date & Time", value: "02/06/2024  12:34 PM" },
    { heading: "Deactivation Date & Time", value: "02/06/2024  12:34 PM" },
    { heading: "Victim Name", value: "John Doe" },
    { heading: "Gender", value: "Male" },
    { heading: "Victim Type", value: "Patient" },
    { heading: "Victim Condition", value: "Unconcious" },
    { heading: "Deactivated By", value: "John Doe" },
    { heading: "MR No", value: "12345" },
    { heading: "IP No", value: "12345" },
    { heading: "Emp Code", value: "N/A" },
    { heading: "Location", value: "3rd floor, Ward No 32" },
    { heading: "Total Emergecy Duration", value: " 1Hr 32 Min" },
  ];
  return (
    <div className="flex">
      <div className="border p-4">
        <div className="h-8 w-8 bg-blue-500 rounded-full"></div>
        <p className="mt-2">Code Blue</p>
      </div>
      <div className="container border grid grid-cols-4 gap-5 p-4">
        {arrData &&
          arrData.map((data, index) => (
            <div className="item flex" key={index}>
              <h1 className="text-xs">{data.heading}:</h1>
              <p className="text-xs text-gray-600 ml-3">{data.value}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostEvent;
