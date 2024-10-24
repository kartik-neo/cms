import React from "react";

const SimpleTableSection = ({ data, columns }) => {
  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full table-auto border-collapse border table-borderless table-striped">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns?.map((column) => (
              <th key={column.id} className="px-4 py-3 text-left">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-blue-50 transition duration-200 ease-in-out"
            >
              {columns?.map((column) => (
                <td key={column.id} className="border-b px-4 py-3 text-black">
                  {row[column.id] == "/" || row[column.id] == ""
                    ? "-"
                    : row[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTableSection;
