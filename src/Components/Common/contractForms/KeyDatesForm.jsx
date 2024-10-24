import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const KeyDatesForm = ({
  errors,
  watch,
  control,
  getValues,
  setValue,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setValue("renewalEffectiveDate", "");
    setValue("renewalExpiryDate", "");
  };

  const effectiveDate = watch("effectiveDate");
  const expiryDate = watch("expiryDate");
  const renewalEffectiveDate = watch("renewalEffectiveDate");
  const renewalExpiryDate = watch("renewalExpiryDate");
 useEffect(()=>{
  getValues("minEffectiveDate")
 },[])
  useEffect(() => {
    if (renewalExpiryDate || renewalEffectiveDate) {
      setIsChecked(true);
    }
  }, [renewalEffectiveDate, renewalExpiryDate]);

  return (
    <>
      <div className="form-two">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center">
              <p class="text-xl font-semibold">
                Key Dates <span className="text-red-600 font-medium">*</span>
              </p>
              <div className="inline-flex items-center ml-8">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer w-5 h-5 border-gray-400 rounded"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="">Renewal Opted</label>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-5 mt-4">
              <div className="col-span-6">
                <label
                  htmlFor=""
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  Effective Date
                </label>
                <Controller
                  name="effectiveDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <DatePicker
                      placeholderText="Select a date"
                      onChange={(date) => {
                        field.onChange(date);
                        setValue("expiryDate", null);
                      }}
                      minDate={getValues("minEffectiveDate")}
                      selected={field.value}
                      dateFormat="dd/MM/yyyy"
                      className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                      // minDate={new Date()}
                    />
                  )}
                />
                {errors.effectiveDate && (
                  <p className="text-red-500 mt-1">
                    {errors.effectiveDate.message}
                  </p>
                )}
              </div>
              <div className="col-span-6">
                <label
                  htmlFor=""
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  Expiry Date
                </label>
                <Controller
                  name="expiryDate"
                  control={control}
                  // defaultValue={null}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <DatePicker
                      placeholderText="Select a date"
                      onChange={(date) => {
                        field.onChange(date);
                        setValue("renewalEffectiveDate", null);
                      }}
                      excludeDates={effectiveDate ? [effectiveDate] : ""}
                      minDate={effectiveDate}
                      selected={field.value}
                      dateFormat="dd/MM/yyyy"
                      className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                    />
                  )}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 mt-1">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {isChecked && (
            <div className="col-span-12 md:col-span-6">
              <p class="text-xl font-semibold">Renewal Dates</p>

              <div className="grid grid-cols-12 gap-x-5 mt-4">
                <div className="col-span-6">
                  <label
                    htmlFor=""
                    className="inline-block text-gray-500 font-medium mb-2"
                  >
                    Effective Date
                  </label>
                  <Controller
                    name="renewalEffectiveDate"
                    control={control}
                    // defaultValue={null}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select a date"
                        onChange={(date) => {
                          field.onChange(date);
                          setValue("renewalExpiryDate", null);
                        }}
                        selected={field.value}
                        dateFormat="dd/MM/yyyy"
                        className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                        minDate={expiryDate}
                        excludeDates={expiryDate ? [expiryDate] : ""}
                      />
                    )}
                  />
                  {errors.renewalEffectiveDate && (
                    <p className="text-red-500 mt-1">
                      {errors.renewalEffectiveDate.message}
                    </p>
                  )}
                </div>
                <div className="col-span-6">
                  <label
                    htmlFor=""
                    className="inline-block text-gray-500 font-medium mb-2"
                  >
                    Expiry Date
                  </label>
                  <Controller
                    name="renewalExpiryDate"
                    control={control}
                    // defaultValue={null}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select a date"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        dateFormat="dd/MM/yyyy"
                        className="form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
                        minDate={renewalEffectiveDate}
                        excludeDates={
                          renewalEffectiveDate ? [renewalEffectiveDate] : ""
                        }
                      />
                    )}
                  />
                  {errors.renewalExpiryDate && (
                    <p className="text-red-500 mt-1">
                      {errors.renewalExpiryDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <hr className="my-8" />

        {/* 
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <p class="text-xl font-semibold">Upload Contract</p>
           
          </div>
          <div className="col-span-6">
            <input
                type="file"
                className="block w-full border border-gray-300 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-200 file:border-0 file:me-4 file:py-3 file:px-4 cursor-pointer"
                //disabled={view}
            />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default KeyDatesForm;
