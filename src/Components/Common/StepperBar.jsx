import React from "react";
import {
  BsCheckCircle,
  BsCircle,
  BsXCircle,
} from "react-icons/bs";
import { FaHourglassHalf } from "react-icons/fa";

const StepperBar = ({ data }) => {
 
  //   const step = 2;
  return (
    <div className="border px-10 py-10 rounded-lg bg-white shadow relative">
      <div className="flex items-center stepper-container relative">
        {data?.map((item, index) => (
          <div className={`text-black w-full step relative text-xl`}>
            <div
              className={`inline-flex h-10 items-center rounded-md px-4 py-2 relative   bg-white`}
              //   ${
              //     step == item?.step ? " border-2 border-gray-500" : ""
              //   }
              //    onClick={()=>setStep(index+1)}
            >
              {item?.status == "Approved" || item?.status == "Active" || item?.status == "Terminate" ? (
                <>
                  <BsCheckCircle className={`text-green-600`} />
                </>
              ) : item?.status == "Rejected" ? (
                <BsXCircle className={` text-red-600  `} />
              ) : item?.status == "Pending" ? (
                <FaHourglassHalf className={` text-orange-400  `} />
              ) : (
                <BsCircle className={` text-gray-400  `} />
              )}

              <p
                className={`ml-2   ${
                  item?.isActive ? "text-green-600" : "text-black"
                } flex flex-col gap-1`}
              >
                <span className="text-lg">{item?.title}</span>
                <span className="text-xs">{item?.by}</span>
                <span className="text-xs">{item?.date}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepperBar;
