import { Link } from "react-router-dom";
import { AiOutlineAlert } from "react-icons/ai";
import React from "react";
import { MdOutlineAccessTime } from "react-icons/md";
import moment from "moment";
import { daysDifference } from "../../utils/functions";

const PageTitle = ({
  title = "",
  breadCrumbData = [],
  status = "",
  edit,
  bg = false,
  terminationData,
  cameFromTerminationData,
  // terminationDetails,
}) => {
  // const terminationData = terminationDetails?.filter((item) => item?.type === "Terminated")[0]
  return (
    // <div className="text-3xl font-bold mt-14 ml-5">{title}</div>
    <div
      className={`flex ${
        cameFromTerminationData == "Aggregator"
          ? "justify-start"
          : "justify-between"
      } gap-4 items-center mb-4`}
    >
      <div className="inline-flex flex-col">
        <div
          className={`${
            bg ? "" : "bg-white"
          } -mt-6 -ml-8 -mr-[16px] md:-mr-8 mb-1 h-[50px] px-8 flex items-center justify-between`}
        >
          <span>
            <span className="text-2xl font-medium tracking-tight text-gray-900">
              {title}
            </span>
          </span>
          {/* {enableButton ? (
          <Link
            to={targetUrl}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-0 font-medium rounded text-md px-4 py-2.5 flex items-center"
          >
            <AiOutlineAlert className="mr-2" /> <span>{buttonTitle}</span>
          </Link>
        ) : (
          ""
        )} */}
        </div>
        {!status && !edit && cameFromTerminationData != "Aggregator" && (
          <nav className="w-full mb-6">
            <ol
              className="list-reset flex font-medium"
              style={{ listStyleType: "none" }}
            >
              <li>
                <Link
                  to="/dashboard"
                  className="transition duration-150 ease-in-out text-blue-600"
                >
                  Dashboard
                </Link>
              </li>

              {/* {breadCrumbData &&
              breadCrumbData?.length > 0 &&
              breadCrumbData.map((breadCrumb) => (
                <>
                  <li>
                    <span className="mx-2 text-gray-400">/</span>
                  </li>
                  <li className="text-gray-500">
                    <Link
                      to={`${breadCrumb?.route}`}
                      className="transition duration-150 ease-in-out text-blue-600"
                    >
                      {breadCrumb?.name}
                    </Link>
                  </li>
                </>
              ))} */}

              {breadCrumbData &&
                breadCrumbData?.length > 0 &&
                breadCrumbData.map((breadCrumb, index) => (
                  <React.Fragment key={index}>
                    <li>
                      <span className="mx-2 text-gray-400">/</span>
                    </li>
                    <li className="text-gray-500">
                      {breadCrumb?.route ? (
                        <Link
                          to={breadCrumb?.route}
                          className="transition duration-150 ease-in-out text-blue-600"
                        >
                          {breadCrumb?.name}
                        </Link>
                      ) : (
                        <span className="transition duration-150 ease-in-out text-blue-600">
                          {breadCrumb?.name}
                        </span>
                      )}
                    </li>
                  </React.Fragment>
                ))}
            </ol>
          </nav>
        )}
      </div>
      {terminationData && (
        <div className="flex gap-4 items-center border border-red-600 rounded-md p-3 bg-white">
          <div className="text-5xl text-red-600">
            <MdOutlineAccessTime />
          </div>
          <div className="flex flex-col">
            <span className="">
              Termination Start Date : {terminationData?.startDate ? moment.unix(terminationData?.startDate).format("DD/MM/YYYY") : ""} 
              
            </span>
            <span className="">
              Termination End Date :{" "}
              {terminationData?.endsDate ? moment.unix(terminationData?.endsDate).format("DD/MM/YYYY") : ""}
            </span>
            {/* <span className="">No. of days: {moment.unix(terminationData?.endsDate).diff(moment(),"days") + 2}</span> */}
            <span className="">
              No. of days remaining :{" "}
              {terminationData?.endsDate
                ? daysDifference(terminationData?.endsDate)
                : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTitle;
