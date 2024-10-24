import React, { useEffect, useState } from "react";
import { monthOptions, yearOptions } from "../../utils/commonOptions";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import { BsDownload, BsFunnel } from "react-icons/bs";
import { SlRefresh } from "react-icons/sl";
import { TETooltip } from "tw-elements-react";

const DateRangeSelector = ({
  data,
  handleDateRangeChange,
  type,
  displayNameObj = {},
  name,
}) => {
  const [fromMonth, setFromMonth] = useState(null);
  const [fromYear, setFromYear] = useState(null);
  const [toMonth, setToMonth] = useState(null);
  const [toYear, setToYear] = useState(null);
  let isDisabled = !fromMonth || !fromYear || !toMonth || !toYear;
  function handleFilterClick() {
    handleDateRangeChange(
      {
        fromMonth: fromMonth,
        fromYear: fromYear,
        toMonth: toMonth,
        toYear: toYear,
      },
      type
    );
  }
  function handleFilterReset() {
    handleDateRangeChange(null, type);
  }

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new(); // New workbook
    const ws_data = [];

    // Extract parameters from the data, assume all objects have the same structure
    const parameters = Object.keys(data[0]).filter((key) => key !== "label");

    // Add header
    const header = ["Parameters", ...data.map((monthData) => monthData.label)];
    ws_data.push(header);

    // Add data
    parameters.forEach((parameter) => {
      const row = [
        displayNameObj[parameter],
        ...data.map((monthData) => monthData[parameter]),
      ];
      ws_data.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "CPR Analysis");

    // Write workbook and trigger download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }

    // Save to file
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      `${name}.xlsx`
    );
  };

  const max = yearOptions.reduce(function (prev, current) {
    return prev && prev.value > current.value ? prev : current;
  });

  const [monthOptionsForTo, setMonthOptionsForTo] = useState(monthOptions);
  const [yearOptionsForTo, setYearOptionsForTo] = useState();

  useEffect(() => {
    if (fromMonth?.value <= toMonth?.value) {
      setYearOptionsForTo(
        yearOptions.filter((val) => val.value >= fromYear?.value)
      );
    } else {
      setYearOptionsForTo(
        yearOptions.filter((val) => val.value > fromYear?.value)
      );
    }
  }, [toMonth]);

  useEffect(() => {
    if (toYear) {
      if (fromYear?.value == toYear?.value) {
        setMonthOptionsForTo(
          monthOptions.filter((val) => val.value >= fromMonth?.value)
        );
      } else if (fromYear?.value > toYear?.value) {
        setMonthOptionsForTo([]);
      } else if (fromYear?.value < toYear?.value) {
        setMonthOptionsForTo(monthOptions);
      }
    }
  }, [toYear]);

  useEffect(() => {
    setYearOptionsForTo(
      yearOptions.filter((val) => val.value >= fromYear?.value)
    );

    if (fromYear && fromMonth && max) {
      if (fromYear?.value == max?.value) {
        setMonthOptionsForTo(
          monthOptions.filter((val) => val.value >= fromMonth?.value)
        );
      }
    }
  }, [fromYear]);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-4">
        <div className="block">
          <p className="mb-2 font-medium">From</p>
        </div>
        <div className="flex items-start gap-5">
          <Select
            options={monthOptions}
            className="select-control w-full" // Make sure the Select component itself takes up 100% of the div's width
            classNamePrefix="react-select"
            placeholder={"Select Month"}
            onChange={setFromMonth}
            value={fromMonth}
            isClearable
            maxMenuHeight={"200px"}
          />
          <Select
            options={yearOptions}
            className="select-control w-full" // Make sure the Select component itself takes up 100% of the div's width
            classNamePrefix="react-select"
            placeholder={"Select Year"}
            onChange={setFromYear}
            value={fromYear}
            isClearable
            maxMenuHeight={"200px"}
          />
        </div>
      </div>
      <div className="col-span-5">
        <div className="block">
          <p className="mb-2 font-medium">To</p>
        </div>
        <div className="flex items-start gap-5">
          <Select
            options={monthOptionsForTo}
            className="select-control w-full" // Make sure the Select component itself takes up 100% of the div's width
            classNamePrefix="react-select"
            placeholder={"Select Month"}
            onChange={setToMonth}
            value={toMonth}
            isClearable
            maxMenuHeight={"200px"}
          />
          <Select
            options={yearOptionsForTo}
            className="select-control w-full" // Make sure the Select component itself takes up 100% of the div's width
            classNamePrefix="react-select"
            placeholder={"Select Year"}
            onChange={setToYear}
            value={toYear}
            isClearable
            maxMenuHeight={"200px"}
          />
        </div>
      </div>
      <div className="col-span-3 self-end">
        <div className="flex items-start gap-4">
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleFilterClick}
            className={`px-3 py-2 text-md rounded font-medium flex items-center gap-2 self-end text-black ${
              isDisabled
                ? "bg-gray-200 border border-gray-200 cursor-not-allowed"
                : "bg-white border border-blue-600 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <BsFunnel /> Filter
          </button>
          <button
            type="button"
            //disabled={isDisabled}
            onClick={handleFilterReset}
            className={`px-3 py-2 text-md rounded font-medium flex items-center gap-2 self-end text-black ${"bg-white border border-blue-600 hover:bg-blue-700 hover:text-white"}`}
          >
            <SlRefresh />
            Reset
          </button>
          <button onClick={() => exportToExcel()}>
            <TETooltip
              tag="button"
              title="Download"
              //wrapperProps={{ href: '#' }}
              onClick={exportToExcel}
              className="border border-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded text-md px-3 py-2 focus:outline-none flex items-center gap-2"
            >
              <BsDownload className="text-lg" /> Download
            </TETooltip>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;
