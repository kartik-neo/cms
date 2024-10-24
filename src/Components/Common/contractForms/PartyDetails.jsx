import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import {
  fetchCityDataValue,
  fetchCountryDataValue,
  fetchEmpId,
  fetchStateDataValue,
} from "../../../Services/external";
import Select from "react-select";

const PartyDetails = ({
  register,
  errors,
  watch,
  control,
  companyDetails,
  employeeDetails,
  setValue,
  getEmployeeDetails,
}) => {
  const [empNameOption, setEmpNameOption] = useState(null);
  const [countryOption, setCountryOption] = useState(null);
  const [stateVal, setStateVal] = useState(null);
  const [cityVal, setCityVal] = useState(null);
  const [countryVal, setCountryVal] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const countryValue = watch("country");
  const statesValue = watch("states");

  const fetchEmpNameOptions = async (inputValue) => {
    
    if (!inputValue) return [];

    try {
      const response = await fetchEmpId({ id: inputValue });

      // const data = response?.success;
      const data = response?.success.splice(0, 50);

      return data.map((item) => ({
        value: item.empcode,
        label: `${item.empcode} - ${item.empname}`,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchCountryOptions = async () => {
    try {
      const response = await fetchCountryDataValue();

      const data = response?.success;

      const countryData = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCountryOption(countryData);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchStateOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const response = await fetchStateDataValue(inputValue?.value);

      const data = response?.success;

      const stateData = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setStateOptions(stateData);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchCityOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const response = await fetchCityDataValue(inputValue?.value);

      const data = response?.success;

      const cityData = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCityOptions(cityData);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchCountryOptions();
  }, []);

  useEffect(() => {
    if (companyDetails && Object.keys(companyDetails).length > 0) {
      setValue("companyName", companyDetails?.name);
      setValue("companyContactNo", companyDetails?.contectNo);
      setValue("CompanyEmailId", companyDetails?.email);
      setValue("companyAddressLineOne", companyDetails?.address1);
      setValue("companyAddressLineTwo", companyDetails?.address2);
      setValue("companyAddressLineThree", companyDetails?.address3);
      setValue("pinCode", companyDetails?.pinCode);
      setValue("companyContactNo", companyDetails?.phone);
      setValue("city", companyDetails?.cityId);
      setValue("country", companyDetails?.countryId);
      setValue("states", companyDetails?.stateId);
      setValue("pocName", companyDetails?.pocName);
      setValue("pocContactNo", companyDetails?.pocContactNo);
      setValue("pocEmailId", companyDetails?.pocEmailID);
      setValue("city", {
        label: companyDetails?.city,
        value: companyDetails?.cityId,
      });
      setValue("country", {
        label: companyDetails?.countryName,
        value: companyDetails?.countryId,
      });
      setValue("states", {
        label: companyDetails?.stateName,
        value: companyDetails?.stateId,
      });
    }
  }, [companyDetails]);

  useEffect(() => {
    let result =
      employeeDetails &&
      employeeDetails?.length > 0 &&
      employeeDetails?.filter((item) => item?.empcode == empNameOption?.value);
    if (result) {
      setValue("empCode", result[0]?.empcode);
      setValue("contactNo", result[0]?.cellphone);
      setValue("emailId", result[0]?.email);
      setValue("designation", result[0]?.desgname);
      setValue("empDepartment", result[0]?.department);
      setValue("location", result[0]?.address1);
    }
  }, [employeeDetails]);

  useEffect(() => {
    if (countryValue) {
      fetchStateOptions(countryValue);
    }
  }, [countryValue]);

  useEffect(() => {
    if (statesValue) {
      fetchCityOptions(statesValue);
    }
  }, [statesValue]);

  return (
    <>
      <div className="form-three">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <p class="text-xl font-semibold text-blue-600">Jupiter</p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Emp Name <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`empName`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  cacheOptions
                  loadOptions={fetchEmpNameOptions}
                  // defaultValue={empNameOption}
                  // value={empNameOption}
                  onChange={(val) => {
                    setEmpNameOption(val);
                    getEmployeeDetails(val?.value);
                    // employeeID(empNameOption?.value);
                    field.onChange(val);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  //styles={customStyles}
                  isRequired={true}
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.empName && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Emp Code <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="empCode"
              disabled
              {...register("empCode", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.empCode && (
              <span className="text-red-500 mt-1">
                {errors.empCode.message}
              </span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Contact No <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="number"
              disabled
              placeholder="Enter here"
              name="contactNo"
              {...register("contactNo", {
                required: "This field is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid Contact Number",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.contactNo && (
              <span className="text-red-500 mt-1">
                {errors.contactNo.message}
              </span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Email ID <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="email"
              disabled
              placeholder="Enter here"
              name="emailId"
              {...register("emailId", { required: true })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.emailId && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Designation <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              disabled
              placeholder="Enter here"
              name="designation"
              {...register("designation", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.designation && (
              <span className="text-red-500 mt-1">
                {errors.designation.message}
              </span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Department <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="empDepartment"
              {...register("empDepartment", {
                required: "This field is required",
                minLength: {
                  value: 2,
                  message: "Allowed minimum characters are 2 and maximum 100",
                },
                maxLength: {
                  value: 100,
                  message: "Allowed minimum characters are 2 and maximum 100",
                },
                pattern: {
                  value: /^[a-zA-Z0-9 ]*$/,
                  message:
                    "Special Characters will not be allowed E.g. (!@#$%^&*)",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.empDepartment && (
              <span className="text-red-500 mt-1">
                {errors.empDepartment.message}
              </span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Location <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              disabled
              name="location"
              {...register("location", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.location && (
              <span className="text-red-500 mt-1">
                {errors.location.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mt-8">
          <div className="col-span-12">
            <p class="text-xl font-semibold text-blue-600">2nd Party Details</p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Company Name <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="companyName"
              {...register("companyName", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.companyName && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Company Contact No <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter here"
              name="companyContactNo"
              {...register("companyContactNo", { required: true })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.companyContactNo && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Company Email Id <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter here"
              name="CompanyEmailId"
              {...register("CompanyEmailId", { required: true })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.CompanyEmailId && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Company Address Line 1{" "}
              <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="companyAddressLineOne"
              {...register("companyAddressLineOne", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.companyAddressLineOne && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Company Address Line 2{" "}
              <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="companyAddressLineTwo"
              {...register("companyAddressLineTwo", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.companyAddressLineTwo && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Company Address Line 3{" "}
              <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="companyAddressLineThree"
              {...register("companyAddressLineThree", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.companyAddressLineThree && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Pin Code / Zip Code <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter here"
              name="pinCode"
              {...register("pinCode", { required: true })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.pinCode && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Country <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`country`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  cacheOptions
                  options={countryOption}
                  // defaultValue={empNameOption}
                  // value={countryVal}
                  onChange={(val) => {
                    setCountryVal(val);
                    fetchStateOptions(val);
                    setValue("states", null);
                    setValue("city", null);
                    // getEmployeeDetails(val?.value);
                    // employeeID(empNameOption?.value);
                    field.onChange(val);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  //styles={customStyles}
                  isRequired={true}
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.country && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              State <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`states`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  cacheOptions
                  options={stateOptions}
                  // defaultValue={empNameOption}
                  // value={stateVal}
                  onChange={(val) => {
                    setStateVal(val);
                    fetchCityOptions(val);
                    // getEmployeeDetails(val?.value);
                    // employeeID(empNameOption?.value);
                    field.onChange(val);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  //styles={customStyles}
                  isRequired={true}
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.states && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              City <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`city`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  cacheOptions
                  classNamePrefix="react-select"
                  options={cityOptions}
                  // value={cityVal}
                  onChange={(cityVal) => {
                    setCityVal(cityVal);
                    field.onChange(cityVal);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  // styles={customStyles}
                  isRequired={true}
                />
              )}
            />
            {errors.city && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              POC Name <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="pocName"
              {...register("pocName", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.pocName && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              POC Contact No <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter here"
              name="pocContactNo"
              {...register("pocContactNo", { required: true })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.pocContactNo && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              POC Email Id <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter here"
              name="pocEmailId"
              {...register("pocEmailId", { required: true })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            {errors.pocEmailId && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PartyDetails;
