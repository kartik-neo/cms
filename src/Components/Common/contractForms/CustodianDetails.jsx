import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { fetchEmpId, fetchFileLocations, locationId } from "../../../Services/external";
import Select from "react-select";

const CustodianDetails = ({
  register,
  errors,
  watch,
  control,
}) => {
  const [custodianNameOption, setCustodianNameOption] = useState(null);
  const [fileLocationList, setFileLocationList] = useState(null);

  const addDetails = watch("details")

  const fetchEmpNameOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const response = await fetchEmpId({ id: inputValue });

      const data = response?.success.splice(0, 15);

      return data.map((item) => ({
        value: item.empcode,
        label: `${item.empcode} - ${item.empname}`,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  // const fetchFileLocationOptions = async (inputValue) => {
  //   if (!inputValue) return [];

  //   try {
  //     const response = await locationId({ id: inputValue });

  //     const data = response?.success;

  //     return data.map((item) => ({
  //       value: item.locationID,
  //       label: item.locationName,
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return [];
  //   }
  // };

  const fetchFileLocation = async () => {
    try {
      const response = await fetchFileLocations();

      const data = response?.success;

      const result = data.map((item) => ({
        value: item?.locationID,
        label: `${item.locationName}`,
      }));

      setFileLocationList(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
   
    fetchFileLocation();
   
  }, []);

  return (
    <>
      <div className="form-four">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <p class="text-xl font-semibold">Custodian Details</p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Custodian Name <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`custodianName`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  cacheOptions
                  loadOptions={fetchEmpNameOptions}
                  // defaultValue={custodianNameOption}
                  // value={custodianNameOption}
                  onChange={(custodianNameOption) => {
                    setCustodianNameOption(custodianNameOption);
                    field.onChange(custodianNameOption);
                  }}
                  isClearable={true}
                  placeholder="Search"
                  //styles={customStyles}
                  isRequired={true}
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.custodianName && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              File Location <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`fileLocation`}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                // <AsyncSelect
                //   {...field}
                //   cacheOptions
                //   loadOptions={fetchFileLocationOptions}  
                //   onChange={(fileLocationOption) => {
                //     setFileLocationOption(fileLocationOption);
                //     field.onChange(fileLocationOption);
                //   }}
                //   isClearable={true}
                //   placeholder="Search"
                //   isRequired={true}
                //   classNamePrefix="react-select"
                // />
                <Select
                {...field}
                options={fileLocationList}
                // isMulti
                // isDisabled={!aggregatorDisable}
                isClearable={true}
                classNamePrefix="react-select"
                placeholder="Select file location"
              />
              )}
            />
            {errors.fileLocation && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor=""
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Add Details
            </label>
            <input
              type="text"
              placeholder="Enter here"
              name="details"
              maxLength={150}
              minLength={2}
              // onChange={() => setAddDetailsCount(prevState => prevState + 1)}
              {...register("details", {
                maxLength: {
                  value: 150,
                  message: "Maximum length is 150 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
              className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
            />
            <span
              className="inline-block text-right w-full text-gray-500 mb-2"
            >
              {`${addDetails ? addDetails?.length : 0} of 150 Characters`}
            </span>  
            {/* {errors.details && (
              <span className="text-red-500 mt-1">This field is required</span>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustodianDetails;
