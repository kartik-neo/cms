import React, { useEffect } from "react";
import DataTable from "../Components/Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { ReactComponent as Right } from "../icons/Right.svg";
import { ReactComponent as Circle } from "../icons/Circle.svg";
import "../Components/Common/DataTable/index.css";
import { BsBoxArrowUpRight, BsCheckCircle, BsCircle } from "react-icons/bs";
import { TETooltip } from "tw-elements-react";
import {
  formatDateTime,
  formatDurationFromUnixTimestamp,
} from "../utils/functions";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../App";
import { MENU_PERMISSIONS } from "../Constant/permissionConstant";
import { convertTimestampToFormattedDate } from "../utils/other";
const EmergencyRecent = ({ data, type }) => {
  const columnHelper = createColumnHelper();

  const Navigate = useNavigate();
  const hasViewAccess = usePermission(MENU_PERMISSIONS?.EMS?.Emergency?.View); // Check if user has access to the element
  const hasViewAccessMock = usePermission(
    MENU_PERMISSIONS?.EMS?.EmergencyMockDrill?.View
  ); // Check if user has access to the element

  const viewAccess =
    type === "WithoutMockDrill" ? hasViewAccess : hasViewAccessMock;
  const columns = [
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-black bg-gray-100 px-2 py-1 rounded-md text-md font-medium">
            {info.getValue()}
          </span>
        </div>
      ),
      header: () => <span>Booking ID</span>,
    }),
    columnHelper.accessor((row) => row.codetype, {
      id: "codetype",
      cell: (info) => {
        const color = info.getValue().toLowerCase();
        return (
          <div className="flex justify-center items-center">
            <span
              style={{
                backgroundColor:
                  color === "blue (adult)" || color === "blue (peadiatric)"
                    ? "#0000ff"
                    : color === "hazmat"
                    ? "#008000"
                    : color,
              }}
              className={`text-white py-1 my-3 w-[120px] rounded-full text-md font-medium`}
            >
              {info.getValue()}
            </span>
          </div>
        );
      },
      header: () => <span>Code Type</span>,
    }),
    columnHelper.accessor((row) => row.activationDateTime, {
      id: "activationDateTime",
      cell: (info) => (
        <span>
          {info.getValue()
            ? convertTimestampToFormattedDate(info.getValue())
            : ""}
        </span>
      ),
      header: () => <span>Code Activation Date & Time</span>,
    }),
    columnHelper.accessor((row) => row.reportedByName, {
      id: "reportedByName",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Reported By </span>,
    }),
    columnHelper.accessor((row) => row.locationName, {
      id: "locationName",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Location</span>,
    }),
    columnHelper.accessor((row) => row.deactivationDateTime, {
      id: "deactivationDateTime",
      cell: (info) => (
        <span>
          {info.getValue()
            ? convertTimestampToFormattedDate(info.getValue())
            : ""}
        </span>
      ),
      header: () => <span>Code Deactivation Date & Time</span>,
    }),
    columnHelper.accessor((row) => row.timeofCompletion, {
      id: "timeofCompletion",
      cell: (info) => (
        <span>
          {info.getValue() > 0
            ? formatDurationFromUnixTimestamp(info.getValue())
            : info.getValue()}
        </span>
      ),
      header: () => <span>Time of Completion</span>,
    }),
    columnHelper.accessor((row) => row.deactivationStatus, {
      id: "deactivationStatus",
      cell: (info) => (
        <div className="flex justify-center items-center">
          {" "}
          {info.getValue() ? (
            <BsCheckCircle className="text-2xl text-green-600" />
          ) : (
            <BsCircle className="text-2xl text-gray-400" />
          )}
        </div>
      ),
      header: () => <span>Deactivation Status</span>,
    }),
    columnHelper.accessor((row) => row.isPostEventAnalysis, {
      id: "isPostEventAnalysis",
      cell: (info) => (
        <div className="flex justify-center items-center">
          {" "}
          {info.getValue() ? (
            <BsCheckCircle className="text-2xl text-green-600" />
          ) : (
            <BsCircle className="text-2xl text-gray-400" />
          )}
        </div>
      ),
      header: () => <span>Post Event Analysis</span>,
    }),
    columnHelper.accessor((row) => row.isVerification, {
      id: "isVerification",
      cell: (info) => (
        <div className="flex justify-center items-center">
          {" "}
          {info.getValue() ? (
            <BsCheckCircle className="text-2xl text-green-600" />
          ) : (
            <BsCircle className="text-2xl text-gray-400" />
          )}
        </div>
      ),
      header: () => <span>Verification</span>,
    }),
    columnHelper.accessor((row) => row.isActionItemsClosed, {
      id: "isActionItemsClosed",
      cell: (info) => (
        <div className="flex justify-center items-center">
          {" "}
          {info.getValue() ? (
            <BsCheckCircle className="text-2xl text-green-600" />
          ) : (
            <BsCircle className="text-2xl text-gray-400" />
          )}
        </div>
      ),
      header: () => <span>Action Item Closure</span>,
    }),
    columnHelper.accessor((row) => row.action, {
      id: "action",
      cell: (info) => (
        <>
          {viewAccess ? (
            <button
              type="button"
              className="mr-3"
              onClick={() => {
                // handle the click event
                if (info?.row?.original?.id && viewAccess) {
                  Navigate(
                    `/print-emergency-details/${info?.row?.original?.id}/${info?.row?.original?.codetype}`
                  );
                }
              }}
            >
              <TETooltip tag={"span"} title="View Emergency">
                <BsBoxArrowUpRight className="text-xl" />
              </TETooltip>
            </button>
          ) : (
            ""
          )}
        </>
      ),
      header: () => <span>Action</span>,
      enableSorting: false, // Disable sorting for this column
    }),
  ];

  return (
    <div className="overflow-auto">
      <DataTable
        columns={columns}
        defaultData={data}
        isPaginated={false}
        showDelete={false}
        entriesPerPage={false}

      />
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow underline"
        onClick={() =>
          type === "WithOutMockDrill"
            ? Navigate("/emergency-list")
            : Navigate("/emergency-list-mock")
        }
      >
        View All
      </button>
    </div>
  );
};

export default EmergencyRecent;
