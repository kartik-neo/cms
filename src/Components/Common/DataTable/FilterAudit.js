import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
// import "react-select/dist/react-select.css";
import "./index.css";

import {
  BsArrowClockwise,
  BsCalendar,
  BsFunnel,
  BsSearch,
} from "react-icons/bs";

import {
  unixTimestamp,
  getUnitId,
  fetchAuditLogEmpNameOptions
} from "../../../utils/functions";
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";

const FilterAudit = ({ type, setFilters, handleFilterClick }) => {
  const [actionTrigger, setActiontriggerdays] = useState([]);
  const [employeeByVal, setEmpId] = useState();
  const [custodianNameOption, setCustodianNameOption] = useState(null);


  const [FromdateVal, setFromdate] = useState(null);
  const [todateVal, settodate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const unitId = getUnitId();
  const [unit, setUnit] = useState(unitId);
  const [codeTypeOption, setCodeTypeOption] = useState([]);
  const [reportedByOption, setReportedByOption] = useState([]);
  const datePickerRefFrom = useRef(null);
  const datePickerRefTo = useRef(null);
  const {
    customStyles,
    control,
   
  } = useForm({});

  const handleCalendarToggleFrom = () => {
    if (datePickerRefFrom.current) {
      datePickerRefFrom.current.setFocus();
    }
  };
  const handleCalendarToggleTo = () => {
    if (datePickerRefTo.current) {
      datePickerRefTo.current.setFocus();
    }
  };

  const getAllCodeMaster = async (unit) => {
    try {
      // const codeMasters = await fetchAllCodeMaster({ unit: unit });
      // const transformedData = codeMasters?.data?.map((item) => ({
      //   value: item.id,
      //   label: item.name,
      // }));
      const transformedData = [
        {
          value: "30",
          label: "< 30 Days",
        },
        {
          value: "45",
          label: "< 45 Days",
        },
        {
          value: "60",
          label: "< 60 Days",
        },
        {
          value: "75",
          label: "< 75 Days",
        },
        {
          value: "90",
          label: "< 90 Days",
        },
      ];

      setCodeTypeOption(transformedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getAllReportedBy = async () => {
    try {
      // const reportedByList = await fetchReportedUser();
      // const transformedData = reportedByList?.data
      //   ?.filter((item) => item.userId !== null && item.userName !== null)
      //   .map((item) => ({
      //     value: item.userId,
      //     label: item.userName,
      //   }));
      const transformedData = [
        {
          value: "TPA111",
          label: "TPA",
        },
        {
          value: "Corporate",
          label: "Corporate",
        },
        {
          value: "Aggregator",
          label: "Aggregator",
        },
      ];

      setReportedByOption(transformedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getAllCodeMaster(unit);
    getAllReportedBy();
  }, [unit]);





  const handleFilterClickFn = () => {
    const codevalues = actionTrigger ? actionTrigger?.map((item) => item.value) : [];
    const coderesult = codevalues.join(",");
    
    const EmpId = custodianNameOption?.value;
    const Actiontriggerdays = actionTrigger && coderesult;
    const Fromdate = FromdateVal ? unixTimestamp(FromdateVal) : "";
    const todate = todateVal ? unixTimestamp(todateVal) : "";
   


    setFilters({
      Actiontriggerdays,
      EmpId,
      Fromdate,
      todate,
      searchText,
    });
    handleFilterClick({
      Actiontriggerdays,
      EmpId,
      Fromdate,
      todate,
      searchText
    });
  };
  const handleResetClick = () => {
    setEmpId(null);
    setActiontriggerdays(null);
    setFromdate(null);
    settodate(null);
    setSearchText("");
    handleFilterClick({});
  };

  useEffect(() => {
    handleFilterClickFn();
  }, [searchText]);


  useEffect(() => {
    if (FromdateVal) {
      settodate(null);
    }
  }, [FromdateVal]);

 

  // const renderMonthContent = (month, shortMonth, longMonth, day) => {
  //   const fullYear = new Date(day).getFullYear();
  //   const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

  //   return <span title={tooltipText}>{shortMonth}</span>;
  // };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {type !== "report" && type !== "survival-report" && (
          <>
            <div className="col-span w-full">
            <Controller
                  name={`custodianName`}
                  control={control}
                  // rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <AsyncSelect
                      {...field}
                      // cacheOptions
                      loadOptions={fetchAuditLogEmpNameOptions}
                      // defaultValue={custodianNameOption}
                      // value={custodianNameOption}
                      onChange={(custodianNameOption) => {
                        setCustodianNameOption(custodianNameOption);
                        field.onChange(custodianNameOption);
                      }}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      // isDisabled={view}
                      // isClearable={true}
                      placeholder="Select Employee"
                      styles={customStyles}
                      isRequired={true}
                      isClearable={true}
                    />
                  )}
                />
              {/* <Select
                isMulti
                options={reportedByOption}
                className="select-control"
                classNamePrefix="react-select"
                placeholder="Select Employee"
                onChange={setContractType}
                value={employeeByVal}
                isClearable={true}
              /> */}
            </div>
            <div className="col-span w-full">
              <Select
                isMulti
                options={codeTypeOption}
                className="select-control"
                classNamePrefix="react-select"
                placeholder="Select Action trigger"
                onChange={setActiontriggerdays}
                value={actionTrigger}
                isClearable={true}
              />
            </div>
            <div className="col-span w-full">
              <div className="form-field relative">
              <BsSearch className="absolute bottom-[12px] right-4 mt-0.5" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                  placeholder="Search..."
                />
                
              </div>
            </div>
          </>
        )}
          <>
            <div className="col-span w-full">
              <div className="form-field relative">
                <DatePicker
                  ref={datePickerRefFrom}
                  selected={FromdateVal}
                  onChange={setFromdate}
                  className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                  placeholderText="From"
                  dateFormat="dd/MM/yyyy" // Set the date format
                  maxDate={new Date()}
                />
                <div
                  onClick={handleCalendarToggleFrom}
                  style={{ cursor: "pointer" }}
                >
                  <BsCalendar className="absolute bottom-[12px] right-4 mt-0.5" />
                </div>
              </div>
            </div>
            <div className="col-span w-full">
              <div className="form-field relative">
                <DatePicker
                  ref={datePickerRefTo}
                  selected={todateVal}
                  onChange={settodate}
                  className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                  placeholderText="To"
                  dateFormat="dd/MM/yyyy" // Set the date format
                  maxDate={new Date()}
                  minDate={FromdateVal ? FromdateVal : ""}
                />
                <div
                  onClick={handleCalendarToggleTo}
                  style={{ cursor: "pointer" }}
                >
                  <BsCalendar className="absolute bottom-[12px] right-4 mt-0.5" />
                </div>
                {/* <BsCalendar className="absolute bottom-[12px] right-4 mt-0.5" /> */}
              </div>
            </div>
          </>
        <div className={`col-span flex items-center justify-start`}>
          <button
            onClick={handleFilterClickFn}
            className={`border border-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded text-md px-3 py-2 focus:outline-none flex items-center gap-2 ${
              type === "survival-report" ? "mt-8" : ""
            }`}
          >
            <BsFunnel size={"16px"} /> Filter
          </button>
          <button
            onClick={handleResetClick}
            className="px-3 py-2 text-md rounded font-medium flex items-center gap-2 self-end text-black bg-gray-200 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 ml-3"
          >
            <BsArrowClockwise size={"16px"} /> Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterAudit;