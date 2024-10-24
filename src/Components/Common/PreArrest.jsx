import React from "react";
import "../Layout/test.css";

function PreArrest({ register, handleSubmit, errors, watch }) {
  
  const systolicValue = watch("bpSystolic"); // Get the value of the systolic input field

  return (
    <>
      <h3 class="text-xl font-semibold flex items-center mb-3 mt-8">
        Pre-arrest Status
      </h3>
      <div className="border px-8 py-8 rounded-lg bg-white shadow relative">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  Time Patient Last Assessed{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="lastAssessed"
                  {...register("lastAssessed", { required: true })}
                  className={`form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full `}
                  // ${errors.lastAssessed ? "border-red-500" : ""}
                />
                {errors.lastAssessed && (
                  <span className="text-red-500 mt-1">
                    This field is required
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  Pars Score <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="score"
                  id="score"
                  {...register("score", {
                    required: "This field is required",
                    min: { value: 0, message: "The valid input is 0-14" },
                    max: { value: 14, message: "The valid input is 0-14" },
                  })}
                  className={`form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full 
                `}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
                  }}
                  //   ${errors.score ? "border-red-500" : "" }
                />
                {errors.score && (
                  <span className="text-red-500 mt-1">
                    {errors.score.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  Temperature <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    {...register("temperature", {
                      required: "This field is required",
                      min: { value: 10, message: "The valid input is 10-50 C" },
                      max: { value: 50, message: "The valid input is 10-50 C" },
                    })}
                    className={`form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full mr-2            
                    `}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
                    }}
                    // ${errors.temperature ? "border-red-500" : ""}
                  />
                  <span>C</span>
                </div>
                {errors.temperature && (
                  <span className="text-red-500 mt-1">
                    {errors.temperature.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  Pulse <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="pulse"
                    name="pulse"
                    {...register("pulse", {
                      required: "This field is required",
                      min: {
                        value: 0,
                        message: "The valid input is 0-500 bpm",
                      },
                      max: {
                        value: 500,
                        message: "The valid input is 0-500 bpm",
                      },
                    })}
                    // {...register("pulse", { required: true })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
                    }}
                    className="form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full mr-2"
                  />
                  <span>bpm</span>
                </div>
                {errors.pulse && (
                  <span className="text-red-500 mt-1">
                    {errors.pulse.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  R<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="r"
                    name="r"
                    {...register("r", {
                      required: "This field is required",
                      min: {
                        value: 0,
                        message: "The valid input is 0-500 bpm",
                      },
                      max: {
                        value: 500,
                        message: "The valid input is 0-500 bpm",
                      },
                    })}
                    //{...register("r", { required: true })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
                    }}
                    className="form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full mr-2"
                  />
                  <span>bpm</span>
                </div>
                {errors.r && (
                  <span className="text-red-500 mt-1">{errors.r.message}</span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label
                  for=""
                  className="mb-2 inline-block text-gray-500 flex justify-between"
                >
                  <span>
                    BP <span className="text-red-500">*</span>
                  </span>
                  <span>mmHg</span>
                </label>
                <div className="flex justify-between gap-2">
                  <div className="inline-flex flex-col max-width-[50%]">
                    <div className="inline-flex items-center">
                      <label className="mr-2">Systolic</label>
                      <input
                        id="systolic"
                        type="number"
                        name="bpSystolic"
                        className="form-input px-0 py-3 border-gray-300 shadow-sm rounded-md w-16 text-center"
                        {...register("bpSystolic", {
                          required: "This field is required",
                          min: {
                            value: 0,
                            message: "The valid range for systolic is 0 to 300",
                          },
                          max: {
                            value: 300,
                            message: "The valid range for systolic is 0 to 300",
                          },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9.-]/g,
                            ""
                          );
                        }}
                      />
                    </div>
                    {errors.bpSystolic && (
                      <span className="text-red-500 mt-1">
                        {errors.bpSystolic.message}
                      </span>
                    )}
                  </div>
                  <p className="mt-3">/</p>
                  <div className="inline-flex flex-col max-width-[50%]">
                    <div className="inline-flex items-center">
                      <label className="mr-2">Diastolic</label>
                      <input
                        id="diastolic"
                        type="number"
                        name="bpDiastolic"
                        className="form-input px-0 py-3 border-gray-300 shadow-sm rounded-md w-16 text-center"
                        {...register("bpDiastolic", {
                          required: "This field is required",
                          min: {
                            value: 0,
                            message:
                              "The valid range for diastolic is 0 to 200",
                          },
                          max: {
                            value: 200,
                            message:
                              "The valid range for diastolic is 0 to 200",
                          },
                          validate: (value) => {
                            const systolic = parseInt(systolicValue, 10);
                            const diastolic = parseInt(value, 10);
                            return (
                              systolic >= diastolic ||
                              "Diastolic value pressure cannot be greater than Systolic value"
                            );
                          },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9.-]/g,
                            ""
                          );
                        }}
                      />
                    </div>
                    {errors.bpDiastolic && (
                      <span className="text-red-500 mt-1">
                        {errors.bpDiastolic.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  SPO2 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="spO2"
                    name="spO2"
                    //{...register("spO2", { required: true })}
                    {...register("spO2", {
                      required: "This field is required",
                      min: { value: 0, message: "The valid input is 0-100 %" },
                      max: { value: 100, message: "The valid input is 0-100 %" }
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
                    }}
                    className="form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full mr-2"
                  />
                  <span>%</span>
                </div>
                {errors.spO2 && (
                  <span className="text-red-500 mt-1">
                     {errors.spO2.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  HGT <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="hgt"
                    name="hgt"
                  //  {...register("hgt", { required: true })}
                    {...register("hgt", {
                      required: "This field is required",
                      min: { value: 0, message: "The valid input is 0-500 %" },
                      max: { value: 500, message: "The valid input is 0-500 %" }
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
                    }}
                    className="form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full mr-2"
                  />
                  <span>mg/dl</span>
                </div>
                {errors.hgt && (
                  <span className="text-red-500 mt-1">
                    {errors.hgt.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="form-field">
                <label for="" className="mb-2 inline-block text-gray-500">
                  GCS <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="gcs"
                    name="gcs"
                    //{...register("gcs", { required: true })}
                    {...register("gcs", {
                      required: "This field is required",
                      min: { value: 3, message: "The valid input is 3-15" },
                      max: { value: 15, message: "The valid input is 3-15" }
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
                    }}
                    className="form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full mr-2"
                  />
                  <span>mg/dl</span>
                </div>
                {errors.gcs && (
                  <span className="text-red-500 mt-1">
                     {errors.gcs.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default PreArrest;