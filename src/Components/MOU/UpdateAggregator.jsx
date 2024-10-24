import { Select } from '@headlessui/react';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { generateYearOptions } from '../../utils/other';
import { fetchApproveDocument, fetchEmpNameOptions, fetchMaterialServices } from '../../utils/functions';
import AsyncSelect from "react-select/async";
import UploadMediaCMS from '../Common/UploadMediaCMS';
import { fetchCreditCompanies, fetchFileLocations, fetchInsuranceCompanies, fetchTariffs } from '../../Services/external';
import LatestModalPopUp from '../Common/LatestModalPopUp';
import { CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const UpdateAggregator = () => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
      } = useForm({
        defaultValues: {
          aggregator: {},
        },
      });
    const renewal = watch(`renewal`);
  const validityFrom = watch(`validityFrom`);
  const validityTo = watch(`validityTo`);
  const coPaymentPercent = watch(`coPaymentInPercent`);
  const opCoPayment = watch(`opCoPayment`);
  const hcCoPayment = watch(`hcCoPayment`);
  const ipCoPayment = watch(`ipCoPayment`);
  const netralayaCoPayment = watch(`netralayaCoPayment`);
  const patientDeposit = watch(`patientDeposit`);
  const opWatch = watch(`op`);
 
  const ipWatch = watch(`ip`);
  const hcWatch = watch(`hc`);
  const netralayaWatch = watch(`netralaya`);

  const [custodianNameOption, setCustodianNameOption] = useState(null);
  const demoWatchEmp = watch(`ipCoPaymentEmployee`);
  const demoWatchDep = watch(`ipCoPaymentDependant`);
  const opCoPaymentEmployee = watch(`opCoPaymentEmployee`);
  const opCoPaymentDependant = watch(
    `opCoPaymentDependant`
  );
  const hcCoPaymentEmployee = watch(`hcCoPaymentEmployee`);
  const hcCoPaymentDependant = watch(
    `hcCoPaymentDependant`
  );
  const netralayaCoPaymentEmployee = watch(
    `netralayaCoPaymentEmployee`
  );
  const netralayaCoPaymentDependant = watch(
    `netralayaCoPaymentDependant`
  );
  const renewalDateFrom = watch(`renewalFrom`);
  const nonAdmissableService = watch(
    `nonAdmissableService`
  );

    const [approveDocument, setApproveDocument] = useState(null);
    const [alert, setAlert] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [contractName, setContractName] = useState();
    const [creditCompanies, setCreditCompanies] = useState(null);
    const [insuranceCompanies, setInsuranceCompanies] = useState(null);
    const [tariffList, setTariffList] = useState(null);
    const [fileLocationList, setFileLocationList] = useState(null);
    const [globalObjectId, setGlobalObjectId] = useState(null);


  
    const navigate = useNavigate();
    const fetchCreditCompany = async () => {
        try {
          const response = await fetchCreditCompanies();
    
          const data = response?.success;
    
          const result = data?.map((item) => ({
            value: item?.code,
            label: `${item.name}`,
          }));
    
          setCreditCompanies(result);
        } catch (error) {
          console.error("Error fetching data:", error);
          return [];
        }
      };
      const fetchInsuranceCompany = async () => {
        try {
          const response = await fetchInsuranceCompanies();
    
          const data = response?.success;
    
          const result = data?.map((item) => ({
            value: item?.code,
            label: `${item.name}`,
          }));
    
          setInsuranceCompanies(result);
        } catch (error) {
          console.error("Error fetching data:", error);
          return [];
        }
      };
    
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
    
      const fetchTariffList = async () => {
        try {
          const response = await fetchTariffs();
    
          const data = response?.success;
    
          const result = data?.map((item) => ({
            value: item?.code,
            label: `${item.name}`,
          }));
    
          setTariffList(result);
        } catch (error) {
          console.error("Error fetching data:", error);
          return [];
        }
      };
    
      useEffect(() => {
        fetchCreditCompany();
        fetchInsuranceCompany();
        fetchFileLocation();
        fetchTariffList();
      }, []);
    useEffect(() => {
        if (opWatch == true) {
          setValue(`opCoPayment`, true);
        }
        if (opWatch == false) {
          setValue(`opCoPayment`, false);
        }
    
        if (ipWatch == true) {
          setValue(`ipCoPayment`, true);
        }
        if (ipWatch == false) {
          setValue(`ipCoPayment`, false);
        }
        if (hcWatch == true) {
          setValue(`hcCoPayment`, true);
        }
        if (hcWatch == false) {
          setValue(`hcCoPayment`, false);
        }
        if (netralayaWatch == true) {
          setValue(`netralayaCoPayment`, true);
        }
        if (netralayaWatch == false) {
          setValue(`netralayaCoPayment`, false);
        }
    
      }, [opWatch, ipWatch, hcWatch, netralayaWatch, setValue]);
    
    return (
        <>
          {/* <form onSubmit={handleSubmit(onSubmit)} className="bg-white  "> */}
          <div className="bg-white shadow relative rounded mb-5">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12">
                <p className="text-xl font-semibold p-4 bg-blue-600 text-white rounded flex justify-between items-center">
                  <span>Aggregator</span>
                  {/* <BsTrash
                    onClick={() => remove(index)}
                    title="Remove Aggregator"
                    className="cursor-pointer text-lg font-semibold"
                  /> */}
                </p>
              </div>
            </div>
    
            <div className="grid grid-cols-12 px-4 pt-4 mb-8 mt-2">
              <div className="col-span-6">
                <label
                  htmlFor="insuranceCompany"
                  className="inline-block font-medium text-xl mb-4"
                >
                  Insurance Company <span className="ml-1 text-red-400">*</span>
                </label>
                <Controller
                  name={`insuranceCompany`}
                  control={control}
                  // defaultValue={[]}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={insuranceCompanies}
                      // isMulti
                      isClearable={true}
                    //   isDisabled={view}
                      classNamePrefix="react-select"
                      placeholder="Select insurance company"
                    />
                  )}
                />
                {errors?.insuranceCompany && (
                    <span className="text-red-500 mt-1">
                      This field is required
                    </span>
                  )}
              </div>
            </div>
    
            {/* Validity */}
            <div className="grid grid-cols-12 gap-5 px-4 pt-4">
              <div className="col-span-6">
                <div className="flex items-center">
                  <p className="text-xl font-semibold">Validity</p>
                  <div className="inline-flex items-center ml-8">
                    <input
                      type="checkbox"
                      id={`renewal`}
                      className={`mr-2 cursor-pointer
                       w-5 h-5 border-gray-400 rounded `}
                      {...register(`renewal`)}
                    //   disabled={view}
                    />
                    <label htmlFor={`renewal`}>Renewal Opted</label>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-5 mt-4">
                  <div className="col-span-6">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      From<span className="ml-2 text-red-400">*</span>
                    </label>
                    <Controller
                      name={`validityFrom`} // Adjusted field name
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <DatePicker
                          className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                        "bg-gray-100"
                          }`}
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          placeholderText="Select from date"
                          dateFormat="dd/MM/yyyy"
                        //   disabled={view}
                        />
                      )}
                    />
                    {
                      errors?.validityFrom && (
                        <p className="text-red-500 mt-1">
                          {errors?.validityFrom?.message}
                        </p>
                      )}
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      To<span className="ml-2 text-red-400">*</span>
                    </label>
                    <Controller
                      name={`avalidityTo`}
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <DatePicker
                          className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                            "bg-gray-100"
                          }`}
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          placeholderText="Select to date"
                          minDate={validityFrom}
                          dateFormat="dd/MM/yyyy"
                        //   disabled={view}
                        />
                      )}
                    />
                    {
                      errors?.validityTo && (
                        <p className="text-red-500 mt-1">
                          {errors?.validityTo?.message}
                        </p>
                      )}
                  </div>
                </div>
              </div>
    
              {renewal && (
                <div className="col-span-6">
                  <p className="text-xl font-semibold">Renewal Dates </p>
                  <div className="grid grid-cols-12 gap-x-5 mt-4">
                    <div className="col-span-6">
                      <label
                        htmlFor=""
                        className="inline-block text-gray-500 font-medium mb-2"
                      >
                        From{" "}
                        {renewal && <span className="ml-2 text-red-400">*</span>}
                      </label>
                      <Controller
                        name={`renewalFrom`}
                        control={control}
                        rules={{
                          required:  "This field is required",
                        }}
                        render={({ field }) => (
                          <DatePicker
                            className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                              "bg-gray-100"
                            }`}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            placeholderText="Select renewal from date"
                            // required
                            // disabled={view}
                            minDate={validityTo}
                            dateFormat="dd/MM/yyyy" // Set the date format
                          />
                        )}
                      />
                      {
                        errors?.renewalFrom && (
                          <p className="text-red-500 mt-1">
                            {errors?.renewalFrom?.message}
                          </p>
                        )}
                    </div>
                    <div className="col-span-6">
                      <label
                        htmlFor=""
                        className="inline-block text-gray-500 font-medium mb-2"
                      >
                        To {renewal && <span className="ml-2 text-red-400">*</span>}
                      </label>
                      <Controller
                        name={`renewalTo`}
                        control={control}
                        rules={{
                          required:"This field is required",
                        }}
                        render={({ field }) => (
                          <DatePicker
                            className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            placeholderText="Select renewal to date"
                            // required
                            // disabled={view}
                            minDate={renewalDateFrom}
                            dateFormat="dd/MM/yyyy" // Set the date format
                          />
                        )}
                      />
                      {
                        errors?.renewalTo && (
                          <p className="text-red-500 mt-1">
                            {errors?.renewalTo?.message}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
    
            <hr className="my-8 mx-4" />
    
            {/* contract segment */}
            <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <p className="text-xl font-semibold">
                  Contract Segment <span className="ml-2 text-red-400">*</span>{" "}
                </p>
              </div>
              <div className="col-span-2">
                <div className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="op"
                    className={`mr-2 ${
                      "cursor-pointer"
                    } w-5 h-5 border-gray-400 rounded`}
                    // value={true}
                    // disabled={view}
                    {...register(`op`, {
                      validate: (value) => {
                        const values = getValues(`aggregator`);
                        if (
                          values?.op ||
                          values?.ip ||
                          values?.hc ||
                          values?.netralaya
                        ) {
                          // console.log("..");
                        } else {
                          return "At least one segment must be selected.";
                        }
                      },
                    })}
                  />
                  <label htmlFor="op">OP</label>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="ip"
                    // disabled={view}
                    className={`mr-2 ${
                      "cursor-pointer"
                    } w-5 h-5 border-gray-400 rounded`}
                    {...register(`ip`)}
                  />
                  <label htmlFor="ip">IP</label>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="hc"
                    // disabled={view}
                    className={`mr-2 ${
                      "cursor-pointer"
                    } w-5 h-5 border-gray-400 rounded`}
                    {...register(`hc`)}
                  />
                  <label htmlFor="hc">HC</label>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="netralaya"
                    // disabled={view}
                    className={`mr-2 ${
                      "cursor-pointer"
                    } w-5 h-5 border-gray-400 rounded`}
                    {...register(`netralaya`)}
                  />
                  <label htmlFor="netralaya">Netralaya</label>
                </div>
              </div>
    
              {errors?.op && (
                <p className="text-red-500  col-span-12">
                  {errors?.op?.message}
                </p>
              )}
            </div>
    
            <hr className="my-8 mx-4" />
    
            {/* co-payment percentage */}
            <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <div className="flex items-center">
                  <p className="text-xl font-semibold">
                    Co-Payment in % <span className="ml-2 text-red-400">*</span>
                  </p>
                  <div className="flex gap-4 items-center ml-8">
                    <input
                      type="radio"
                      id="coPaymentInPercentYes"
                      className={`${
                     "cursor-pointer"
                      } border-gray-400 w-5 h-5`}
                      value="yes"
                    //   disabled={view}
                      name={`coPaymentInPercent`}
                      {...register(`coPaymentInPercent`, {
                        required: "This field is required",
                      })}
                    />
                    <label htmlFor="coPaymentInPercentYes">Yes</label>
    
                    <input
                      type="radio"
                      id="coPaymentInPercentNo"
                      className={`${
                        "cursor-pointer"
                      } border-gray-400 w-5 h-5`}
                      value="no"
                    //   disabled={view}
                      name={`coPaymentInPercent`}
                      {...register(`coPaymentInPercent`)}
                    />
                    <label htmlFor="coPaymentInPercentNo">No</label>
                  </div>
                </div>
                {
                  errors?.coPaymentInPercent && (
                    <p className="text-red-500 mt-1 ">
                      {errors?.coPaymentInPercent?.message}
                    </p>
                  )}
              </div>
              {coPaymentPercent == "yes" && (
                <div className="col-span-7 relative overflow-x-auto">
                  <table className="w-full text-left border-0">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-blue-600 w-[140px] border-0"></th>
                        <th className="px-6 py-3 bg-blue-600 text-white w-full border-0 flex gap-2">
                          <p className="font-semibold flex-1 flex justify-center">
                            Employee
                          </p>
                          <p className="font-semibold flex-1 flex justify-center">
                            Dependant
                          </p>
                        </th>
                        {/* <th className="px-6 py-3 bg-blue-600 text-white w-[300px] border-0">
                          <p className="font-semibold">Dependant</p>
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-3 align-middle">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                              id="opCoPayment"
                              disabled={true}
                              // disabled={hcWatch || ipWatch || netralayaWatch}
                              className={`mr-2 ${
                                "cursor-pointer"
                              } w-5 h-5 border-gray-400 rounded`}
                              {...register(`opCoPayment`)}
                            />
                            <label htmlFor="opCoPayment">OP</label>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {opCoPayment && (
                            <div className="w-full">
                              <div className="flex w-full justify-between gap-2">
                                <div className="relative flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                       "bg-gray-100"
                                    }`}
                                    {...register(
                                      `opCoPaymentEmployee`,
                                      {
                                        required:
                                          opCoPayment && "This field is required",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full">
                                    {
                                    errors?.opCoPaymentEmployee
                                      ? errors?.opCoPaymentEmployee?.message
                                      : ""}
                                  </p>
                                </div>
                                <div className="relative flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                   "bg-gray-100"
                                    }`}
                                    {...register(
                                      `opCoPaymentDependant`,
                                      {
                                        required:
                                          opCoPayment && "This field is required",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500  absolute mt-1 top-full  ">
                                    {
                                    errors?.opCoPaymentDependant
                                      ? errors?.opCoPaymentDependant?.message
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <p className="flex w-full justify-center text-red-500 mt-1">
                                {opCoPaymentEmployee &&
                                opCoPaymentDependant &&
                                +opCoPaymentEmployee + +opCoPaymentDependant != 100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-3 align-middle">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                            //   disabled={view}
                              id="hcCoPayment"
                              className="mr-2 cursor-pointer w-5 h-5 border-gray-400 rounded"
                              {...register(`hcCoPayment`)}
                            />
                            <label htmlFor="hcCoPayment">HC</label>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {hcCoPayment && (
                            <div className="w-full">
                              <div className="flex w-full justify-between gap-2">
                                <div className="relative flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                       "bg-gray-100"
                                    }`}
                                    {...register(
                                      `hcCoPaymentEmployee`,
                                      {
                                        required:
                                          hcCoPayment && "This field is required",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full">
                                    {
                                    errors?.hcCoPaymentEmployee
                                      ? errors?.hcCoPaymentEmployee?.message
                                      : ""}
                                  </p>
                                </div>
                                <div className="relative flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    "bg-gray-100"
                                    }`}
                                    {...register(
                                      `hcCoPaymentDependant`,
                                      {
                                        required:
                                          hcCoPayment && "This field is required",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full">
                                    {
                                    errors?.hcCoPaymentDependant
                                      ? errors?.hcCoPaymentDependant?.message
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <p className="flex w-full justify-center text-red-500 mt-1">
                                {hcCoPaymentEmployee &&
                                hcCoPaymentDependant &&
                                +hcCoPaymentEmployee + +hcCoPaymentDependant != 100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-3 align-middle">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                            //   disabled={view}
                              id="ipCoPayment"
                              className="mr-2 cursor-pointer w-5 h-5 border-gray-400 rounded"
                              {...register(`ipCoPayment`)}
                            />
                            <label htmlFor="ipCoPayment">IP</label>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {ipCoPayment && (
                            <div className="w-full">
                              <div className="flex w-full justify-between gap-2">
                                <div className="relative  flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                      "bg-gray-100"
                                    }`}
                                    {...register(
                                      `ipCoPaymentEmployee`,
                                      {
                                        required:
                                          ipCoPayment && "This Field is reuired.",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full  ">
                                    {
                                    errors?.ipCoPaymentEmployee
                                      ? errors?.ipCoPaymentEmployee?.message
                                      : ""}
                                  </p>
                                </div>
                                <div className="relative  flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    "bg-gray-100"
                                    }`}
                                    {...register(
                                      `ipCoPaymentDependant`,
                                      {
                                        required:
                                          ipCoPayment && "This Field is reuired.",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full  ">
                                    {
                                    errors?.ipCoPaymentDependant
                                      ? errors?.ipCoPaymentDependant?.message
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <p className="flex w-full justify-center text-red-500 mt-1">
                                {demoWatchEmp &&
                                demoWatchDep &&
                                +demoWatchEmp + +demoWatchDep != 100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-3 align-middle">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                            //   disabled={view}
                              // disabled={opWatch || ipWatch || hcWatch }
                              id="netralayaCoPayment"
                              className="mr-2 cursor-pointer w-5 h-5 border-gray-400 rounded"
                              {...register(
                                `netralayaCoPayment`
                              )}
                            />
                            <label htmlFor="netralayaCoPayment">Netralaya</label>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {netralayaCoPayment && (
                            <div className="w-full">
                              <div className="flex w-full justify-between gap-2">
                                <div className="relative flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                       "bg-gray-100"
                                    }`}
                                    {...register(
                                      `netralayaCoPaymentEmployee`,
                                      {
                                        required:
                                          netralayaCoPayment &&
                                          "This field is required",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full  ">
                                    {errors?.netralayaCoPaymentEmployee
                                      ? errors?.netralayaCoPaymentEmployee?.message
                                      : ""}
                                  </p>
                                </div>
                                <div className="relative flex-1 flex justify-center">
                                  <input
                                    type="number"
                                    // disabled={view}
                                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    "bg-gray-100"
                                    }`}
                                    {...register(
                                      `netralayaCoPaymentDependant`,
                                      {
                                        required:
                                          netralayaCoPayment &&
                                          "This field is required",
                                        pattern: {
                                          value: /^[0-9]*$/,
                                          message:
                                            "Only numeric values are allowed",
                                        },
                                        max: {
                                          value: 100,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Percentage value must be between 0 to 100",
                                        },
                                      }
                                    )}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full  ">
                                    {
                                    errors?.netralayaCoPaymentDependant
                                      ? errors?.netralayaCoPaymentDependant?.message
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <p className="flex w-full justify-center text-red-500 mt-1">
                                {netralayaCoPaymentEmployee &&
                                netralayaCoPaymentDependant &&
                                +netralayaCoPaymentEmployee +
                                  +netralayaCoPaymentDependant !=
                                  100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
    
            <hr className="my-8 mx-4" />
    
            {/* discount on Tariff */}
            <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <p className="text-xl font-semibold">Discount on Tariff</p>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-x-5">
                  <div className="col-span-4">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      Tariff <span className="ml-1 text-red-400">*</span>
                    </label>
                    {/* <select
                      disabled={view}
                      className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                      {...register(`aggregator.${index}.discountTariff`, {
                        required: !view && "This field is required",
                      })}
                    >
                      <option value="">Selelct tariff</option>
                      <option value={"1"}>1</option>
                      <option value={"2"}>2</option>
                      <option value={"3"}>3</option>
                    </select> */}
    
                    <Controller
                      name={`discountTariff`}
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={tariffList}
                          isClearable={true}
                        //   isDisabled={view}
                          classNamePrefix="react-select"
                          placeholder="Select tariff"
                        />
                      )}
                    />
                    {
                      errors?.iscountTariff && (
                        <p className="text-red-500 mt-1">
                          {errors?.discountTariff?.message}
                        </p>
                      )}
                  </div>
                  <div className="col-span-4">
                    <label
                      htmlFor="creditCompany"
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      Transaction Year <span className="ml-1 text-red-400">*</span>
                    </label>
                    <select
                    //   disabled={view}
                      className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                         "bg-gray-100"
                      }`}
                      {...register(`discountTransactionYear`, {
                        required: "This field is required",
                      })}
                    >
                      <option value="">Select transaction year</option>
                      {generateYearOptions()?.map((option, index) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {
                      errors?.discountTransactionYear && (
                        <p className="text-red-500 mt-1">
                          {
                            errors?.discountTransactionYear
                              ?.message
                          }
                        </p>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-x-5">
                  <div className="col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      OP<span className="ml-1 text-red-400">*</span>
                    </label>
                    <div className="inline-flex items-center">
                      <input
                        type="number"
                        // disabled={view}
                        placeholder="Enter op percentage"
                        className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                          "bg-gray-100"
                        }`}
                        {...register(`opDiscount`, {
                          required:  "This field is required",
                          max: {
                            value: 100,
                            message: "Percentage value must be between 0 to 100",
                          },
                          min: {
                            value: 0,
                            message: "Percentage value must be between 0 to 100",
                          },
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Only numeric values are allowed",
                          },
                        })}
                      />
                      <span className="ml-2">%</span>
                    </div>
                    {
                      errors?.opDiscount && (
                        <span className="text-red-500">
                          {errors?.opDiscount?.message}
                        </span>
                      )}
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      IP<span className="ml-1 text-red-400">*</span>
                    </label>
                    <div className="inline-flex items-center">
                      <input
                        // disabled={view}
                        type="number"
                        placeholder="Enter ip percentage"
                        className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                          "bg-gray-100"
                        }`}
                        {...register(`ipDiscount`, {
                          required:"This field is required",
                          max: {
                            value: 100,
                            message: "Percentage value must be between 0 to 100",
                          },
                          min: {
                            value: 0,
                            message: "Percentage value must be between 0 to 100",
                          },
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Only numeric values are allowed",
                          },
                        })}
                      />
                      <span className="ml-2">%</span>
                    </div>
                    {
                      errors?.ipDiscount && (
                        <span className="text-red-500">
                          {errors?.ipDiscount?.message}
                        </span>
                      )}
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      HC<span className="ml-1 text-red-400">*</span>
                    </label>
                    <div className="inline-flex items-center">
                      <input
                        // disabled={view}
                        type="number"
                        placeholder="Enter hc percentage"
                        className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                          "bg-gray-100"
                        }`}
                        {...register(`hcDiscount`, {
                          required:  "This field is required",
                          max: {
                            value: 100,
                            message: "Percentage value must be between 0 to 100",
                          },
                          min: {
                            value: 0,
                            message: "Percentage value must be between 0 to 100",
                          },
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Only numeric values are allowed",
                          },
                        })}
                      />
                      <span className="ml-2">%</span>
                    </div>
                    {
                      errors?.hcDiscount && (
                        <span className="text-red-500">
                          {errors?.hcDiscount?.message}
                        </span>
                      )}
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      Netralaya<span className="ml-1 text-red-400">*</span>
                    </label>
                    <div className="inline-flex items-center">
                      <input
                        type="number"
                        // disabled={view}
                        placeholder="Enter netralaya percentage"
                        className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                           "bg-gray-100"
                        } `}
                        {...register(`netralayaDiscount`, {
                          required: "This field is required",
                          max: {
                            value: 100,
                            message: "Percentage value must be between 0 to 100",
                          },
                          min: {
                            value: 0,
                            message: "Percentage value must be between 0 to 100",
                          },
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Only numeric values are allowed",
                          },
                        })}
                      />
                      <span className="ml-2">%</span>
                    </div>
                    {
                      errors?.ipDiscount && (
                        <span className="text-red-500">
                          {errors?.ipDiscount?.message}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
    
            <hr className="my-8 mx-4" />
    
            {/* approval documents */}
            <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <p className="text-xl font-semibold">
                  Approval Documents <span className="text-danger">*</span>
                </p>
              </div>
              <div className="col-span-6">
                <Controller
                  name={`approvalDocuments`}
                  control={control}
                  // defaultValue={[]}
                  rules={{ required:  true }}
                  render={({ field }) => (
                    <AsyncSelect
                      {...field}
                      isMulti={true}
                      cacheOptions
                      loadOptions={fetchApproveDocument}
                      // defaultValue={approveDocument}
                      // value={approveDocument}
                      onChange={(approveDocument) => {
                        setApproveDocument(approveDocument);
                        field.onChange(approveDocument);
                      }}
                      isClearable={true}
                      placeholder="Select approval documents"
                    //   styles={customStyles}
                      isRequired={true}
                    //   isDisabled={view}
                    />
                  )}
                />
                {
                  errors?.approvalDocuments && (
                    <span className="text-red-500 mt-1">
                      This field is required
                    </span>
                  )}
              </div>
            </div>
    
            <hr className="my-8 mx-4" />
    
            {/* upload MOU */}
            {/* <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <p className="text-xl font-semibold">
                  Upload MOU 
                </p>
              </div>
              <div className="col-span-6">
                <input
                  type="file"
                  disabled={view}
                  className="block w-full border border-gray-300 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-200 file:border-0 file:me-4 file:py-3 file:px-4 cursor-pointer"
                  {...register(`aggregator.${index}.uploadMou`, {
                  })}
                />
              
              </div>
            </div> */}
            <div className="w-full px-4">
              <UploadMediaCMS
                register={register}
                handleSubmit={handleSubmit}
                globalObjectId={globalObjectId}
                // disabled={view}
                errors={errors}
                name="Upload MOU"
                mandate={true}
                uploadFor={"MOU Document"}
              />
            </div>
            <hr className="my-8 mx-4" />
    
            {/* patient deposit */}
            <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <div className="flex items-center">
                  <p className="text-xl font-semibold">
                    Patient Deposit <span className="text-danger">*</span>
                  </p>
                  <div className="flex gap-3 items-center ml-8">
                    <input
                      type="radio"
                      id="patientDepositYes"
                      className={`${
                        "cursor-pointer"
                      } border-gray-400 w-5 h-5`}
                      value="yes"
                    //   disabled={view}
                      name={`patientDeposit`}
                      {...register(`patientDeposit`, {
                        required:  "This field is required",
                      })}
                    />
                    <label htmlFor="patientDepositYes">Yes</label>
    
                    <input
                      type="radio"
                      id="patientDepositNo"
                      className={`${
                        "cursor-pointer"
                      } border-gray-400 w-5 h-5`}
                      value="no"
                    //   disabled={view}
                      name={`patientDeposit`}
                      {...register(`patientDeposit`)}
                    />
                    <label htmlFor="patientDepositNo">No</label>
                  </div>
                </div>
                <p className="text-red-500  mt-1  ">
                  {
                    errors?.patientDeposit &&
                    "This field is required"}
                </p>
              </div>
              {patientDeposit == "yes" ? (
                <div className="col-span-4">
                  <input
                    type="number"
                    // disabled={view}
                    placeholder="In Rupees"
                    className={`${
                    "bg-gray-100"
                    } form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full`}
                    {...register(`patientDepositInRupees`, {
                      required:
                        patientDeposit == "yes"
                          ? "This field is required"
                          : "",
                      pattern: {
                        value: /^[0-9]*\.?[0-9]*$/,
                        message: "Please enter valid amount",
                      },
                    })}
                  />
                  {
                    errors?.aggregatorpatientDepositInRupees && (
                      <p className="text-red-500 ml-6   mt-1">
                        {errors?.patientDepositInRupees?.message}
                      </p>
                    )}
                </div>
              ) : (
                ""
              )}
            </div>
    
            <hr className="my-8 mx-4" />
    
            {/* Non Admissable Material */}
            <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <div className="flex items-center">
                  <p className="text-xl font-semibold">
                    Non Admissable Material / Service{" "}
                    <span className="text-danger">*</span>
                  </p>
                  <div className="flex gap-4 items-center ml-8">
                    <input
                      type="radio"
                    //   disabled={view}
                      id="nonAdmissableServiceYes"
                      className={`${
                      "cursor-pointer"
                      } border-gray-400 w-5 h-5`}
                      value="yes"
                      name={`nonAdmissableService`}
                      {...register(`nonAdmissableService`, {
                        required: "This field is required",
                      })}
                    />
                    <label htmlFor="nonAdmissableServiceYes">Yes</label>
    
                    <input
                      type="radio"
                    //   disabled={view}
                      id="nonAdmissableServiceNo"
                      className={`${
                        "cursor-pointer"
                      } border-gray-400 w-5 h-5`}
                      value="no"
                      name={`nonAdmissableService`}
                      {...register(`nonAdmissableService`)}
                    />
                    <label htmlFor="nonAdmissableServiceNo">No</label>
                  </div>
                </div>
                <p className="text-red-500 mt-1">
                  {
                    errors?.nonAdmissableService &&
                    "This field is required"}
                </p>
              </div>
            </div>
    
            {nonAdmissableService == "yes" && (
              <div className="grid grid-cols-12 gap-5 mt-6">
                <div className="col-span-6 pl-4">
                  <Controller
                    name={`naMaterialService`}
                    control={control}
                    // defaultValue={[]}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <AsyncSelect
                        isMulti={true}
                        {...field}
                        cacheOptions
                        loadOptions={fetchMaterialServices}
                        // defaultValue={approveDocument}
                        // value={approveDocument}
                        onChange={(approveDocument) => {
                          //  setApproveDocument(approveDocument);
                          field.onChange(approveDocument);
                        }}
                        isClearable={true}
                        placeholder="Selecte material / service"
                        // isDisabled={view}
                        // styles={customStyles}
                        isRequired={true}
                      />
                    )}
                  />
                  {errors?.naMaterialService && (
                    <span className="text-red-500 mt-1">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
            )}
    
            <hr className="my-8 mx-4" />
    
            {/* payment Terms */}
            <div className="grid grid-cols-12 gap-5 px-4">
              <div className="col-span-12">
                <p className="text-xl font-semibold">
                  Payment Terms <span className="text-danger">*</span>
                </p>
              </div>
              <div className="col-span-6">
                <div className="flex items-center">
                  <input
                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                     "bg-gray-100"
                    }`}
                    type="text"
                    placeholder="Enter payment terms"
                    // disabled={view}
                    {...register(`paymentTerms`, {
                      required:  "This field is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter valid input",
                      },
                    })}
                  />
                  <p className="ml-3 shrink-0">
                    <span className="text-lg font-medium">Days</span>
                    <span className="text-sm ml-2">
                      (From days of Bill Submission)
                    </span>
                  </p>
                </div>
                { errors?.paymentTerms && (
                  <p className="text-red-500   mt-1 ">
                    {errors?.paymentTerms?.message}
                  </p>
                )}
              </div>
            </div>
    
            <hr className="my-8 mx-4" />
    
            {/* Custodian Details */}
            <div className="grid grid-cols-12 gap-5 px-4 pb-4">
              <div className="col-span-12">
                <p className="text-xl font-semibold">Custodian Details</p>
              </div>
              <div className="col-span-4">
                <label for="" class="inline-block text-gray-500 font-medium mb-2">
                  Custodian Name <span class="ml-1 text-red-400">*</span>
                </label>
                <Controller
                  name={`custodianName`}
                  control={control}
                  defaultValue={[]}
                  rules={{ required:  true }}
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
                      placeholder="Select custodian"
                    //   styles={customStyles}
                      isRequired={true}
                    //   isDisabled={view}
                    />
                  )}
                />
                {errors?.custodianName && (
                  <span className="text-red-500 mt-1">This field is required</span>
                )}
              </div>
              <div className="col-span-4">
                <label for="" class="inline-block text-gray-500 font-medium mb-2">
                  File Location <span class="ml-1 text-red-400">*</span>
                </label>
                <Controller
                  name={`fileLocation`}
                  control={control}
                  defaultValue={[]}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={fileLocationList}
                      // isMulti
                    //   isDisabled={view}
                      isClearable={true}
                      classNamePrefix="react-select"
                      placeholder="Select file location"
                    />
                  )}
                />
                { errors?.fileLocation && (
                  <span className="text-red-500 mt-1">This field is required</span>
                )}
              </div>
              <div className="col-span-4">
                <label for="" class="inline-block text-gray-500 font-medium mb-2">
                  Add Details
                </label>
                <input
                  type="text"
                  placeholder="Enter add details"
                //   disabled={view}
                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                     "bg-gray-100"
                  }`}
                  {...register(`addDetails`, {
                    // required: !view && "This field is required",
                    maxLength: {
                      value: 100,
                      message: "Maximum length is 100 characters",
                    },
                    minLength: {
                      value: 2,
                      message: "Minimum length is 2 character",
                    },
                  })}
                />
    
                { errors?.addDetails && (
                  <p className="text-red-500   mt-1 ">
                    {errors?.addDetails?.message}
                  </p>
                )}
              </div>
            </div>
    
            {/* {view && (
            <div className="flex justify-start items-center gap-4 mb-8 py-8 px-4">
              <button
                type="button"
                onClick={() => setAlert(true)}
                className="py-2.5 px-8 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsArrowClockwise size={'18px'} className="mr-2" />
                Renew
              </button>
              <button
                type="button"
                onClick={() => setTerminationNotice(true)}
                className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsXCircle size={'18px'} className="mr-2" />
                Post Termination Notice
              </button>
              <button
                type="button"
                className="py-2.5 px-8 text-md font-medium text-blue-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsPlusCircle size={'18px'} className="mr-2" />
                Add Addendum
              </button>
              <button
                type="button"
                className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
              >
                <BsPrinter size={'18px'} className="mr-2" />
                Print
              </button>
            </div>
          )} */}
          </div>
    
          {alert && (
            <LatestModalPopUp
              open={alert}
              title={`Renew MOU ${contractName}`}
              setOpen={setAlert}
              icon={
                <ExclamationTriangleIcon
                  className="h-10 w-10 text-red-600"
                  aria-hidden="true"
                />
              }
              buttons={[
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  onClick={() => setConfirm(true)}
                >
                  Renew
                </button>,
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setAlert(false)}
                  data-autofocus
                >
                  Cancel
                </button>,
              ]}
            />
          )}
    
          {confirm && (
            <LatestModalPopUp
              open={confirm}
              title={`You will be able to modify details for ${contractName}`}
              setOpen={setConfirm}
              icon={
                <CheckBadgeIcon
                  className="h-10 w-10 text-green-600"
                  aria-hidden="true"
                />
              }
              buttons={[
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  onClick={() => navigate("/mou-new")}
                >
                  Ok
                </button>,
              ]}
            />
          )}
    
          {/* {terminationNotice && (
            <PostTerminationNotice
              open={terminationNotice}
              setOpen={setTerminationNotice}
            />
          )} */}
        </>
      );
}

export default UpdateAggregator