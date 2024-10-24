import React, { useEffect, useState } from "react";
import TextEditor from "../TextEditor";
import AsyncSelect from "react-select/async";
import {
  fetchDepartments,
} from "../../../Services/contractServices";
import Select from "react-select";
import { fetchCompanyList } from "../../../Services/createCompanyService";
import { Controller } from "react-hook-form";
import { fetchContractList } from "../../../Services/contractTypeMastersServices";
import { fetchApostilleList } from "../../../Services/apostilleMasterservice";
import { retainerOptionData } from "../../../Constant/apiConstant";

const DepartmentForm = ({
  register,
  errors,
  watch,
  control,
  getCompanyDetails,
  setValue,
  inciDetails,
  disableValue,
  locationId
}) => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [contractTypeOptions, setContractTypeOptions] = useState([]);
  const [departmentVal, setdepartmentVal] = useState(null);
  const [retainerVal, setRetainerVal] = useState(null);
  const [contractTypeVal, setContractTypeVal] = useState(null);
  const [apostilleTypeVal, setApostilleTypeVal] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [retainerOption, setRetainerOption] = useState(retainerOptionData);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const contractWithValue = watch("contractWith")?.value;
  const apostilleTypeValue = watch("apostilleType")?.value;

  const fetchContractWithOptions = async (inputValue) => {
    // if (!inputValue) return [];
    try {
      const response = await fetchCompanyList({
        name: inputValue,
        onlyActive: true,
        locationId
      });
      const data = response?.data;

     
      return data
        .filter((item) => item.isActive)
        .map((item) => ({
          label: item.name,
          value: item.id,
        }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchDepartments();
      const data = response.success;

      const departmentResult = data.map((item) => ({
        label: `${item.code} - ${item.name}`,
        value: item.code,
        valueToUse: item.name,
      }));
      setDepartmentOptions(departmentResult);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchContractTypeData = async () => {
    try {
      const response = await fetchContractList();
      const data = response?.data;
      // const data = [
      //   { label: "TPA", value: "01" },
      //   { label: "Corporate", value: "02" },
      //   { label: "Aggregator", value: "03" },
      //   // { value: "Other", label: "Other" },
      // ];

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

  const handleSelectChange = (selectedOption) => {
    setContractTypeVal(selectedOption);
    if (selectedOption?.value === 0) {
      setIsOtherSelected(true);
      setValue("contractType", {
        value: `${contractTypeOptions.length + 1}`,
        label: otherValue || "Other",
        valueToUse: otherValue || "Other",
      });
    } else {
      setIsOtherSelected(false);
      setOtherValue("");
      setValue("contractType", selectedOption);
    }
  };

  const handleOtherInputChange = (event) => {
    const value = event.target.value;
    setOtherValue(value);
    setValue("contractType", {
      value: 0,
      label: value,
      valueToUse: value,
    });
  };

  const fetchApostilleTypeData = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await fetchApostilleList(inputValue,null,locationId);
      const data = response?.data;

      return data.map((item) => ({
        label: `${item.id} - ${item.name}`,
        value: item.id,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchData();
    fetchContractTypeData();
  }, []);

  const fetchOptionById = async (id) => {
    if (!id) return null;

    try {
      const options = await fetchContractWithOptions("");
      return options.find((option) => option.value === id) || null;
    } catch (error) {
      console.error("Error fetching option by ID:", error);
      return null;
    }
  };

  const fetchAppostilleById = async (arr) => {
    if (!arr) return null;

    try {
      const options = await fetchApostilleList("",null,locationId);
      const result = options?.data;
      const filteredData = result?.filter((item) => {
        const itemIds = arr.flatMap((id) => id.split(", ").map(Number));
        return itemIds.includes(item.id);
      });
      const filteredDataInDesiredFormat = filteredData.map((item) => ({
        label: `${item.id} - ${item.name}`,
        value: item.id,
      }));
      return filteredDataInDesiredFormat;
    } catch (error) {
      console.error("Error fetching option by ID:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadOption = async () => {
      if (contractWithValue != undefined) {
        const option = await fetchOptionById(contractWithValue);
        setValue("contractWith", option);
        setSelectedOption(option);
      }
    };
    loadOption();
  }, [contractWithValue]);

  useEffect(() => {
    const loadOption = async () => {
      if (apostilleTypeValue) {
        const array = [apostilleTypeValue?.replace(",", " , ")];
        const option = await fetchAppostilleById(array);
        setValue("apostilleType", option);
        setApostilleTypeVal(option);
      }
    };

    loadOption();
  }, [apostilleTypeValue]);

  const validateTermsConditions = (value) => {
    // Remove HTML tags
    const strippedValue = value?.replace(/<\/?[^>]+(>|$)/g, "").trim();
    if (!strippedValue) {
      return "This field is required";
    }
    return true;
  };

  // useEffect(() => {
  //   const value = getValues("termsConditions");
  //   const validationError = validateTermsConditions(value);
  //   if (validationError === "This field is required") {
  //     setError("termsConditions", {
  //       type: "manual",
  //       message: validationError,
  //     });
  //   } else {
  //     clearErrors("termsConditions");
  //   }
  // }, [getValues, setError, clearErrors]);

  return (
    <>
      <div className="form-one">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Department <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`department`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  cacheOptions
                  classNamePrefix="react-select"
                  options={departmentOptions}
                  // value={departmentVal}
                  onChange={(departmentVal) => {
                    setdepartmentVal(departmentVal);
                    field.onChange(departmentVal);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  // styles={customStyles}
                  isRequired={true}
                />
              )}
            />
            {errors.department && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Contract Type <span className="ml-1 text-red-400">*</span>
            </label>
            <div>
              <Controller
                name={`contractType`}
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => {
                 
                  return (
                    <Select
                      {...field}
                      cacheOptions
                      classNamePrefix="react-select"
                      // options={contractTypeOptions}
                      options={[
                        ...contractTypeOptions,
                        {
                          label: "Other",
                          value: 0,
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
                      placeholder="Search"
                      // styles={customStyles}
                      isRequired={true}
                    />
                  );
                }}
              />
              {isOtherSelected && (
                <input
                  type="text"
                  value={otherValue}
                  required
                  className="mt-4 rounded border border-darkgrey w-full"
                  onChange={handleOtherInputChange}
                  placeholder="Enter other contract type"
                />
              )}
            </div>

            {errors.contractType && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Contract With <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`contractWith`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  cacheOptions
                  loadOptions={fetchContractWithOptions}
                  // defaultValue={selectedOption}
                  // value={selectedOption}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    setSelectedOption(selectedOption);
                    getCompanyDetails(selectedOption?.value);
                    // selectedID(selectedOption?.value);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  isDisabled={disableValue}
                  // styles={customStyles}
                  isRequired={true}
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Company not found"}
                />
              )}
            />
            {errors.contractWith && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Ref No <span className="ml-1 text-red-400">*</span>
            </label>
            <input
              type="text"
              name="refNo"
              id="refNo"
              placeholder="Enter here"
              {...register("refNo", {
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
              //disabled={cprNeeded != "yes"}
            />
            {errors.refNo && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Apostille Type <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`apostilleType`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  cacheOptions
                  isMulti
                  classNamePrefix="react-select"
                  loadOptions={fetchApostilleTypeData}
                  // defaultValue={apostilleTypeVal}
                  // value={apostilleTypeVal}
                  onChange={(apostilleTypeVal) => {
                    setApostilleTypeVal(apostilleTypeVal);
                    field.onChange(apostilleTypeVal);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  // styles={customStyles}
                  isRequired={true}
                />
              )}
            />
            {errors.apostilleType && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Retainer Contract
            </label>
            <Controller
              name={`retainerContract`}
              control={control}
              // rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  cacheOptions
                  options={retainerOption}
                  // defaultValue={selectedOption}
                  // value={retainerVal}
                  onChange={(retainerVal) => {
                    setRetainerVal(retainerVal);
                    field.onChange(retainerVal);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  // styles={customStyles}
                  isRequired={true}
                  classNamePrefix="react-select"
                />
              )}
            />
            {/* {errors.retainerContract && (
              <span className="text-red-500 mt-1">This field is required</span>
            )} */}
          </div>

          <div className="col-span-12">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Terms & Conditions <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name="termsConditions"
              control={control}
              defaultValue={inciDetails ? inciDetails : ""}
              // rules={{ required: "This field is required" }}
              rules={{ validate: validateTermsConditions }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextEditor
                  disabled={false}
                  mandate={true}
                  editorDefaultData={value}
                  onEditorChange={(data) => {
                    // Strip HTML tags before updating the form value
                    const strippedData = data
                      // .replace(/<\/?[^>]+(>|$)/g, "")
                      .trim();
                    onChange(strippedData);
                  }}
                  onBlur={onBlur}
                  // onEditorChange={(data) => {
                  //   const trimmedData = data?.trim();
                  //   if (!trimmedData) {
                  //     setError("termsConditions", {
                  //       type: "manual",
                  //       message: "This field is required",
                  //     });
                  //   } else {
                  //     clearErrors("termsConditions");
                  //   }
                  //   onChange(trimmedData);
                  // }}
                />
              )}
            />
            {errors.termsConditions && (
              <p className="text-red-500 mt-1">
                {errors.termsConditions.message}
              </p>
            )}
            {/* const trimmedData = data.replace(/<[^>]*>/g, "")?.trim(); */}

            {/*  <TextEditor
              // title="Incident Description"
              disabled={false}
              mandate={true}
              editorDefaultData={inciDetails ? inciDetails : ""}
              // editorDefaultData={incidentDetails ? incidentDetails : ""}
              onEditorChange={(data) => {
                // setError({ ...error, incidentDetailsError: "" });
                const trimmedData = data.trim();
                setEmergencyError({
                  ...emergencyError,
                  incidentDetails: "",
                });
                setIncidentDetails(trimmedData);
                setInciDetails(trimmedData);
              }}
            />

            {errorMessage && (
              <p className="text-red-400">"This field is required</p>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentForm;
