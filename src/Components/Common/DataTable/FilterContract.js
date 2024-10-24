import React, { useContext, useEffect, useRef, useState } from "react";
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
  convertFromUnix,
} from "../../../utils/functions";
import { fetchDepartments } from "../../../Services/external";
import { Controller, useForm } from "react-hook-form";
import { fetchContractList } from "../../../Services/contractTypeMastersServices";
import UserContext from "../../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

const FilterContract = ({
  type,
  setFilters,
  handleFilterClick,
  contractType,
  showContractStatus = false,
}) => {
  const Navigate = useNavigate();
  const location = useLocation();
  const {
    watch,
    setValue,
    control,
  } = useForm({ defaultValues: "" });

  const [dateFromVal, setDateFrom] = useState(null);
  const [dateToVal, setDateTo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryType, setCategoryType] = useState([]);
  const [mouDateType, setMouDateType] = useState([]);
  const [contractDateType, setContractDateType] = useState([]);

  const [mouStatus, setMouStatus] = useState([]);
  const [contractSegment, setContractSegment] = useState([]);
  const [addendumVal, setAddendumVal] = useState([]);
  const [renewedVal, setRenewedVal] = useState([]);
  const [locationVal, setLocation] = useState([]);
  const [triggerVal, setTriggerVal] = useState([]);
  const [contractDept, setContractDept] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [contractTypeOptions, setContractTypeOptions] = useState([]);
  const [contractTypeVal, setContractTypeVal] = useState(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const contractTypeValue = watch("contractType");
  // const isAdmin = fetchIsAdmin();
  const { isAdmin } = useContext(UserContext);

  const mouDateTypeData = [
    {
      value: "1",
      label: "MOU Created Date",
    },
    {
      value: "2",
      label: "MOU Start Date",
    },
    {
      value: "3",
      label: "MOU Expiry Date",
    },
  ];
  const contractDateTypeData = [
    {
      value: "1",
      label: "Contract Created Date",
    },
    {
      value: "2",
      label: "Contract Start Date",
    },
    {
      value: "3",
      label: "Contract Expiry Date",
    },
  ];

  const mouStatusOption = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Rejected",
      label: "Rejected",
    },
    {
      value: "Pending Approval",
      label: "Pending Approval",
    },
    {
      value: "Terminated",
      label: "Terminated",
    },
    {
      value: "Expired",
      label: "Expired",
    },
  ];

  const contractSegmentOption = [
    {
      value: "OP",
      label: "OP",
    },
    {
      value: "IP",
      label: "IP",
    },
    {
      value: "HC",
      label: "HC",
    },
    {
      value: "Netralaya",
      label: "Netralaya",
    },
  ];

  const addendumOption = [
    {
      value: "Yes",
      label: "Yes",
    },
    {
      value: "No",
      label: "No",
    },
  ];

  const renewedOption = [
    {
      value: "Yes",
      label: "Yes",
    },
    {
      value: "No",
      label: "No",
    },
  ];

  // const locationOption = [
  //   {
  //     value: "Thane",
  //     label: "Thane",
  //   },
  //   {
  //     value: "Pune",
  //     label: "Pune",
  //   },
  //   {
  //     value: "Indore",
  //     label: "Indore",
  //   },
  // ];

  const transformLogin = (data) => {
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };

  let locations = localStorage.getItem("loginOptions");
  const locationOption = locations ? transformLogin(JSON.parse(locations)) : [];

  const categoryOption = [
    {
      value: "TPA",
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

  const triggerOption = [
    {
      value: "1",
      label: "< 30 Days",
    },
    {
      value: "2",
      label: "< 45 Days",
    },
    {
      value: "3",
      label: "< 60 Days",
    },
    {
      value: "4",
      label: "< 75 Days",
    },
    {
      value: "5",
      label: "< 90 Days",
    },
  ];



  const fetchData = async () => {
    try {
      const response = await fetchDepartments();
      const data = response.success;

      const departmentResult = data.map((item) => ({
        label: item.name,
        value: item.code,
      }));
      setDepartmentOptions(departmentResult);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const datePickerRefFrom = useRef(null);
  const datePickerRefTo = useRef(null);

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

  const handleFilterClickFn = () => {
    const categoryValues = contractTypeValue ? contractTypeValue?.value : "";
    // const categoryValues = categoryVal
    //   ? categoryVal?.map((item) => item.value)
    //   : [];

    const triggerValValues = triggerVal
      ? triggerVal?.map((item) => item.value)
      : [];

    const mouStatusValues = mouStatus
      ? mouStatus?.map((item) => item.value)
      : [];
    const contractSegmentValues = contractSegment
      ? contractSegment?.map((item) => item.value)
      : [];

    const locationValValues = locationVal
      ? locationVal?.map((item) => item.value)
      : [];

    const contractDeptValues = contractDept
      ? contractDept?.map((item) => item.value)
      : [];

    // const addendumValValues = addendumVal
    // ? addendumVal?.map((item) => item.value)
    // : [];
    // const renewedValValues = renewedVal
    // ? renewedVal?.map((item) => item.value ) : [];

    const contractOptionId =
      contractType === "Contract" || contractType === "Classified"
        ? contractDateType
          ? contractDateType?.value
          : null
        : mouDateType
        ? mouDateType?.value
        : null;
    const dateFrom = dateFromVal ? unixTimestamp(dateFromVal) : "";
    const dateTo = dateToVal ? unixTimestamp(dateToVal) : "";
    const contractTypeId = categoryValues;
    // const contractTypeId = categoryValues.join(",");
    const triggerValRes = triggerValValues.join(",");
    const mouStatusRes = mouStatusValues.join(",");
    const contractSegmentRes = contractSegmentValues.join(",");
    const locationValRes = locationValValues.join(",");
    const departmentId = contractDeptValues.join(",");
    const mouCategoryType = categoryType.map((item) => item?.value).join(",");
    // const addendumValRes = addendumValValues.join(",");
    // const  renewedValRes =  renewedValValues.join(",")

    setFilters({
      contractOptionId,
      dateFrom,
      dateTo,
      searchText,
      contractTypeId,
      triggerValRes,
      mouStatusRes,
      contractSegmentRes,
      locationValRes,
      departmentId,
      addendumVal,
      renewedVal,
    });
    handleFilterClick({
      contractOptionId,
      categoryType: mouCategoryType,
      departmentId,
      dateFrom,
      dateTo,
      searchText,
      contractTypeId: contractTypeId,
      RenewedDue: triggerValRes,
      status: mouStatusRes,
      contractSegment: contractSegmentRes,
      hasAddendum:
        addendumVal?.value == "Yes"
          ? true
          : addendumVal?.value == "No"
          ? false
          : "",
      locationId: locationValRes,
      // locationName     don't know wether it is used or not backend really f***k my mind.
      isRenewed:
        renewedVal?.value == "Yes"
          ? true
          : renewedVal?.value == "No"
          ? false
          : "",
    });
  };

  const handleResetClick = () => {
    setDateFrom(null);
    setDateTo(null);
    setSearchText("");
    setCategoryType([]);
    setMouDateType([]);
    setContractDateType([]);
    setMouStatus([]);
    setContractSegment([]);
    setAddendumVal([]);
    setRenewedVal([]);
    setLocation([]);
    setTriggerVal([]);
    handleFilterClick({});
    setContractDept([]);
    Navigate(location?.pathname);
  };

  useEffect(() => {
    if (searchText) {
      handleFilterClickFn();
    }
  }, [searchText]);

  // useEffect(() => {
  //   if (dateFromVal) {
  //     console.log("::::::::::dateFromVal::::::::::", dateFromVal);
  //     setDateTo(null);
  //   }
  // }, [dateFromVal]);

  useEffect(() => {
    if (location?.state?.dateFrom || location?.state?.dateTo) {
      setDateFrom(convertFromUnix(location?.state?.dateFrom));
      setDateTo(convertFromUnix(location?.state?.dateTo));
    }
  }, [location]);


  const handleSelectChange = (selectedOption) => {
    setContractTypeVal(selectedOption);
    if (selectedOption?.value === `${contractTypeOptions.length + 1}`) {
      setIsOtherSelected(true);
      setValue("contractType", {
        value: `${contractTypeOptions.length + 1}`,
        label: otherValue || "Other",
      });
    } else {
      setIsOtherSelected(false);
      setOtherValue("");
      setValue("contractType", selectedOption);
    }
  };

  const fetchContractTypeData = async () => {
    try {
      const response = await fetchContractList();
      const data = response?.data;

      const result = data.map((item) => ({
        label: item.contractType,
        value: item.id,
      }));
      setContractTypeOptions(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

 

  useEffect(() => {
    fetchContractTypeData();
  }, []);

  const findObjectByValue = (value) => {
    return contractDateTypeData.find((item) => item.value == value);
  };
  const findObjectByValueMou = (value) => {
    return mouDateTypeData.find((item) => item.value == value);
  };

  const findObjectByValueStatus = (value) => {
    return mouStatusOption.find((item) => item.value == value);
  };

  useEffect(() => {
    if (location?.state?.contractOptionId) {
      const result = findObjectByValue(location?.state?.contractOptionId);
      const resultMou = findObjectByValueMou(location?.state?.contractOptionId);
      const resultStatus = findObjectByValueStatus(location?.state?.status);
      contractType === "Contract" || contractType === "Classified"
        ? setContractDateType(result)
        : setMouDateType(resultMou);
      if (
        contractType === "Classified" &&
        location?.state?.cameFrom == "dashboard"
      ) {
        setMouStatus(resultStatus);
      }
    }
  }, [location]);

  return (
    <>
      <div className="grid grid-cols-12 gap-3 md:gap-5">
        {
          <>
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              <Select
                options={
                  contractType === "Contract" || contractType === "Classified"
                    ? contractDateTypeData
                    : mouDateTypeData
                }
                className="select-control"
                classNamePrefix="react-select"
                placeholder="Select"
                onChange={
                  contractType === "Contract" || contractType === "Classified"
                    ? setContractDateType
                    : setMouDateType
                }
                value={
                  contractType === "Contract" || contractType === "Classified"
                    ? contractDateType
                    : mouDateType
                }
                isClearable={true}
                isDisabled={location?.state?.contractOptionId ? true : false}
              />
            </div>
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              <div className="form-field relative">
                <DatePicker
                  ref={datePickerRefFrom}
                  selected={dateFromVal}
                  onChange={setDateFrom}
                  disabled={location?.state?.dateFrom ? true : false}
                  className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                  placeholderText="From"
                  dateFormat="dd/MM/yyyy" // Set the date format
                  maxDate={
                    contractDateType?.value === "1" ||
                    mouDateType?.value === "1"
                      ? new Date()
                      : ""
                  }
                />
                <div
                  onClick={handleCalendarToggleFrom}
                  style={{ cursor: "pointer" }}
                >
                  <BsCalendar className="absolute bottom-[12px] right-4 mt-0.5" />
                </div>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              <div className="form-field relative">
                <DatePicker
                  ref={datePickerRefTo}
                  selected={dateToVal}
                  onChange={setDateTo}
                  disabled={location?.state?.dateTo ? true : false}
                  className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                  placeholderText="To"
                  dateFormat="dd/MM/yyyy" // Set the date format
                  maxDate={
                    contractDateType?.value === "1" ||
                    mouDateType?.value === "1"
                      ? new Date()
                      : ""
                  }
                  minDate={dateFromVal ? dateFromVal : ""}
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
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              {contractType == "Contract" || contractType == "Classified" ? (
                <>
                  <Controller
                    name={`contractType`}
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        cacheOptions
                        classNamePrefix="react-select"
                        // options={contractTypeOptions}
                        options={[
                          ...contractTypeOptions,
                          {
                            // value: `${contractTypeOptions.length + 1}`,
                            value: "0",
                            label: "Other",
                          },
                        ]}
                        // defaultValue={contractTypeVal}
                        // value={contractTypeVal}
                        onChange={(contractTypeVal) => {
                          handleSelectChange(contractTypeVal);
                          // setContractTypeVal(contractTypeVal);
                          field.onChange(contractTypeVal);
                        }}
                        isClearable={true}
                        placeholder="Contract type"
                        // styles={customStyles}
                        isRequired={true}
                      />
                    )}
                  />
                  {/* {isOtherSelected && (
                    <input
                      type="text"
                      value={otherValue}
                      required
                      className="mt-4 rounded border border-darkgrey w-full"
                      onChange={handleOtherInputChange}
                      placeholder="Enter other contract type"
                    />
                  )} */}
                </>
              ) : (
                <Select
                  isMulti
                  options={categoryOption}
                  className="select-control w-full"
                  classNamePrefix="react-select"
                  placeholder={`${
                    contractType == "Contract"
                      ? "Contract Type"
                      : "MOU Category"
                  }`}
                  onChange={setCategoryType}
                  value={categoryType}
                  isClearable={true}
                />
              )}
            </div>
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              <Select
                isMulti
                options={triggerOption}
                className="select-control"
                classNamePrefix="react-select"
                placeholder="Renewal Due in"
                onChange={setTriggerVal}
                value={triggerVal}
                isClearable={true}
              />
            </div>
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
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

            {showContractStatus && (
              <div className="col-span-6 md:col-span-4 lg:col-span-3">
                <Select
                  isMulti
                  options={mouStatusOption}
                  className="select-control"
                  classNamePrefix="react-select"
                  placeholder="Status"
                  onChange={setMouStatus}
                  value={mouStatus}
                  isClearable={true}
                  isDisabled={
                    contractType === "Classified" &&
                    location?.state?.cameFrom == "dashboard"
                      ? true
                      : false
                  }
                />
              </div>
            )}

            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              {contractType === "Contract" || contractType === "Classified" ? (
                <Select
                  isMulti
                  options={departmentOptions}
                  className="select-control"
                  classNamePrefix="react-select"
                  placeholder="Department"
                  onChange={setContractDept}
                  value={contractDept}
                  isClearable={true}
                />
              ) : (
                <Select
                  isMulti
                  options={contractSegmentOption}
                  className="select-control"
                  classNamePrefix="react-select"
                  placeholder="Contract Segment"
                  onChange={setContractSegment}
                  value={contractSegment}
                  isClearable={true}
                />
              )}
            </div>
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              <Select
                options={addendumOption}
                className="select-control"
                classNamePrefix="react-select"
                placeholder="Has Addendum"
                onChange={setAddendumVal}
                value={addendumVal}
                isClearable={true}
              />
            </div>
            {
              // contractType !== "Classified" &&
              <div className="col-span-6 md:col-span-4 lg:col-span-3">
                <Select
                  options={renewedOption}
                  className="select-control"
                  classNamePrefix="react-select"
                  placeholder="Renewed"
                  onChange={setRenewedVal}
                  value={renewedVal}
                  isClearable={true}
                />
              </div>
            }
            <div className="col-span-6 md:col-span-4 lg:col-span-3">
              {isAdmin && (
                <Select
                  isMulti
                  options={locationOption}
                  className="select-control"
                  classNamePrefix="react-select"
                  placeholder="Location"
                  onChange={setLocation}
                  value={locationVal}
                  isClearable={true}
                />
              )}
            </div>
          </>
        }

        <div
          className={`col-span-12 md:col-span-4 lg:col-span-3 flex items-start justify-start`}
        >
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
            className="px-3 py-2 text-md rounded font-medium flex items-center gap-2 text-black bg-gray-200 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 ml-3"
          >
            <BsArrowClockwise size={"16px"} /> Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterContract;
