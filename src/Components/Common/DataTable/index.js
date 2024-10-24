import * as React from "react";
import "./index.css";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  FiChevronRight,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronsLeft,
} from "react-icons/fi";
import { handleDownloadCSV } from "../../../utils/functions";
import { BsDownload } from "react-icons/bs";

const DataTable = ({
  columns,
  defaultData,
  isPaginated,
  minWidth,
  showDownload,
  tableName,
  downloadData,
  entriesPerPage,
  pageSize = 10
  //   handleDownloadCSV,
}) => {
  const [data, setData] = React.useState(() => [...defaultData]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
  });

  const downloadTableData = () => {
    handleDownloadCSV(downloadData, tableName);
  };

  return (
    <div className="p-0 m-0">
      <div className="mb-3 flex justify-between items-center">
        <div className="inline-flex items-center flex-wrap gap-4">
          {entriesPerPage === false ? (
            ""
          ) : (
            <div className="mr-3">
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md mr-3"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              Entries Per Page |
            </div>
          )}
          
          {entriesPerPage ? (
          <p className="ml-3">
            Total Entries:{" "}
            <strong>{table.getRowCount().toLocaleString()}</strong>
          </p>
          ):("")}
        </div>

        <div>
          {showDownload && (
            <button
              className="px-3 py-2 text-md rounded font-medium flex items-center gap-2 self-end text-black bg-gray-200 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 ml-3"
              onClick={downloadTableData}
              disabled={downloadData?.length <1}
            >
              <BsDownload className="text-lg" /> Download
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto table-container">
        <table className="table-borderless table-auto table-striped w-full">
          <thead className="bg-blue-600 text-white text-center leading-normal">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`py-2 ${minWidth} text-center ${
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span>
                          {header.column.getIsSorted() === "asc" && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-300 text-center">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4">
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50 transition duration-200 ease-in-out"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-2 whitespace-nowrap text-base font-medium border-b"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="table-pagination mt-5 mb-3">
        {isPaginated && (
          <>
            <div className="grid grid-cols-12 gap-5">
              <div className="md:col-span-8 col-span-12 ">
                <div className="flex justify-start items-center gap-2 flex-wrap">
                  <p>
                    Page{" "}
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount().toLocaleString()}
                    </strong>
                  </p>
                  <p>
                    | Go to page:
                    <input
                      type="text"
                      min="1"
                      max={table.getPageCount().toLocaleString()}
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        table.setPageIndex(page);
                      }}
                      className="form-input h-10 border-gray-300 shadow-sm rounded-md w-10 p-0 text-center ml-3"
                    />
                  </p>
                  |
                  <p>
                    Total Entries:{" "}
                    <strong>{table.getRowCount().toLocaleString()}</strong>
                  </p>
                </div>
              </div>
              <div className="md:col-span-4 col-span-12 ">
                <div className="flex lg:justify-end items-center gap-2 justify-center">
                  <button
                    className="bg-white rounded border border-gray-300 shadow-sm w-10 h-10 text-gray-500 hover:bg-gray-200"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <FiChevronsLeft className="mx-auto text-[18px]" />
                  </button>
                  <button
                    className="bg-white rounded border border-gray-300 shadow-sm w-10 h-10 text-gray-500 hover:bg-gray-200"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <FiChevronLeft className="mx-auto text-[18px]" />
                  </button>
                  <button
                    className="bg-white rounded border border-gray-300 shadow-sm w-10 h-10 text-gray-500 hover:bg-gray-200"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <FiChevronRight className="mx-auto text-[18px]" />
                  </button>
                  <button
                    className="bg-white rounded border border-gray-300 shadow-sm w-10 h-10 text-gray-500 hover:bg-gray-200"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <FiChevronsRight className="mx-auto text-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataTable;
