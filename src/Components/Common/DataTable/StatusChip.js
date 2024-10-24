import React, { useState } from "react"
import { MdOutlineAccessTime } from "react-icons/md";
import {daysDifference, formatDurationFromUnixTimestamp } from "../../../utils/functions";

const StatusChip = ({ info }) => {

    const [isTeminationBoxShown, setIsTeminationBoxShown] = useState(false)
    const terminationStatuses = info?.row?.original?.terminationStatuses?.length ? info?.row?.original?.terminationStatuses[0] : ""

    // let bgColor = info.getValue() === "Pending Approval" ? "green" : "red";
    let bgColor =
        info.getValue() === "Pending Approval"
            ? "yellow"
            : info.getValue() === "Active"
                ? "green"
                : info.getValue() === "Terminated"
                    ? "red"
                    : info.getValue() === "Rejected"
                        ? "orange"
                        : "#AAAAAA";
    return (
        <div className="relative flex w-full justify-center items-center">
            <span
                style={{
                    backgroundColor: `${bgColor}`,
                    color: `${bgColor === "yellow" ? "#000" : "#fff"}`,
                }}
                className={`py-2 my-3 w-[150px] rounded-full shadow bg-yellow-500 text-black font-medium`}
            >
                {!info.getValue() || info.getValue() == ""
                    ? "-"
                    : (info.getValue() == "Pending Approval" && info?.row?.original?.approvalPendingLevel)
                        ? "L" +
                        info?.row?.original?.approvalPendingLevel +
                        " " +
                        info.getValue()
                        : info.getValue()}
                {/* {info.getValue() === true ? "Active" : "Inactive"} */}
            </span>
            {
                isTeminationBoxShown &&
                <div className="absolute bg-white p-3 -top-20 inline-flex flex-col gap-4 border border-blue-600">
                    <div className="">Termination Notice Active
                         {/* {terminationStatuses?.terminationStartDate ? formatDurationFromUnixTimestamp(terminationStatuses?.terminationStartDate) :"" } */}
                         </div>
                    <div className="">Termination End Date : {
                    terminationStatuses?.terminationEndDate ? 
                    formatDurationFromUnixTimestamp(terminationStatuses?.terminationEndDate) 
                    :"" 
                    }   <span className="ml-4 bg-orange-300 p-2">{terminationStatuses?.terminationEndDate && daysDifference(terminationStatuses?.terminationEndDate)} days remaining</span></div>
                </div>
            }
            {
                // (info.getValue() === "Active" && terminationDetails !== null) &&
                terminationStatuses && info.getValue() == "Active" &&
                <span
                    className="absolute right-3 text-white text-xl" 
                    onMouseEnter={() => setIsTeminationBoxShown(!isTeminationBoxShown)}
                    onMouseLeave={() => setIsTeminationBoxShown(!isTeminationBoxShown)}
                >
                    <MdOutlineAccessTime/>
                </span>
            }
        </div>
    )
}

export default StatusChip