import React from "react";
import DateRangeSelector from "./DateRangeSelector";

const AnalysisTable = ({
  data,
  displayNameObj,
  handleDateRangeChange,
  type,
  name,
}) => {
  const parameters =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "label")
      : [];
  return (
    <div>
      <DateRangeSelector
        data={data}
        handleDateRangeChange={handleDateRangeChange}
        type={type}
        displayNameObj={displayNameObj}
        name={name}
      />
      {data.length > 0 ?
      <table className="min-w-full table-auto border-collapse border table-borderless table-striped mt-5">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 min-w-36 text-left">Parameters</th>
            {data.map((monthData) => (
              <th key={monthData.label} className="px-4 py-3 min-w-32">
                {monthData.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parameters.map((paramKey) => {
            // Use the display name from the mapping object
            const displayName =
              (displayNameObj && displayNameObj[paramKey]) || paramKey;
            return (
              <tr
                key={paramKey}
                className="hover:bg-blue-50 transition duration-200 ease-in-out"
              >
                <td className="border-b px-4 py-3 text-black font-bold text-lg ">
                  {displayName}
                </td>
                {data.map((monthData, index) => (
                  <td
                    key={index}
                    className="border-b px-4 py-3 text-center text-lg"
                  >
                    {monthData[paramKey]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table> 
      : <div className="mt-3">No Data Available</div>}
    </div>
  );
};

export default AnalysisTable;
