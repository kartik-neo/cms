import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addCompany,
  updateCompany,
  fetchCompanyById,
} from "../../../Services/createCompanyService";
// import async from "react-select/dist/declarations/src/async";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import PageTitle from "../../Common/PageTitle";
import Modal from "../../Modal";
import { getUnitId } from "../../../utils/functions";
import {
  fetchCountryDataValue,
  fetchStateDataValue,
  fetchCityDataValue,
} from "../../../Services/external";
import UploadMediaCMS from "../../Common/UploadMediaCMS";
import SuccessModal from "../../Common/ModalPopups/SuccessModal";

export const AddCompany = () => {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [companyDetails, setcompanyDetails] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [statusOptionsVal, setStatusOptionsVal] = useState(null);

  const [countryOption, setCountryOption] = useState(null);
  const [stateVal, setStateVal] = useState(null);
  const [cityVal, setCityVal] = useState(null);
  const [countryVal, setCountryVal] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [data, setData] = useState();
  const [globalObjectId, setGlobalObjectId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
  } = useForm();

  const statusOptions = [
    {
      value: true,
      label: "Active",
    },
    {
      value: false,
      label: "Inactive",
    },
  ];
  const countryValue = watch("countryName");
  const statesValue = watch("stateName");

  const fetchCountryOptions = async () => {
    try {
      const response = await fetchCountryDataValue();

      const data = response?.success;

      const countryData = data?.map((item) => ({
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

      const stateData = data?.map((item) => ({
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

      const cityData = data?.map((item) => ({
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
    if (statesValue) {
      fetchCityOptions(statesValue);
    }
  }, [statesValue]);

  useEffect(() => {
    fetchCountryOptions();
  }, []);

  useEffect(() => {
    if (countryValue) {
      fetchStateOptions(countryValue);
    }
  }, [countryValue]);

  const getCompanyDetails = async (id) => {
    try {
      const companyDetails = await fetchCompanyById({ id: id });
      if (companyDetails?.data?.length && companyDetails?.success) {
        setcompanyDetails(companyDetails?.data[0]);
        setGlobalObjectId(companyDetails?.data[0]?.globalObjectId);
      
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getCompanyDetails(id);
  }, [id]);

  const handleConfirm = async () => {
    const unitId = getUnitId();
    const LocationName = localStorage.getItem("unitName");
    const dataToAdd = {
      location: LocationName,
      locationId: unitId,
     
      // countryName: data.cou
      // stateId: 0,
      // isActive: formData.isActive === "true" ? true : false,
      name: data?.name,
      code: "1",
      address1: data?.address1,
      address2: data?.address2,
      address3: data?.address3,
      pinCode: data?.pinCode,
      websiteURL: data?.websiteURL,
      pocContactNo: data?.pocContactNo,
      countryId: data?.countryName?.value.toString(),
      countryName: data.countryName.label,
      stateId: data?.stateName?.value.toString(),
      stateName: data?.stateName?.label,
      city: data?.city?.label,
      cityId: data?.city?.value.toString(),
      phone: data?.phone,
      email: data?.email,
      
      pocName: data?.pocName,
     
      pocEmailID: data?.pocEmailID,
      bankName: data?.bankName,
      bankACNo: data?.bankACNo,
      ifscCode: data?.ifscCode,
      gstNo: data?.gstNo,

      msmeRegNo: data?.msmeRegNo,

      panNo: data?.panNo,
      isActive: statusOptionsVal,
      //  isActive: true
    };
    if (id) {
      dataToAdd.id = id;
    }
    try {
      setGlobalObjectId();
      if (id) {
        
        const companyAdd = await updateCompany({ data: dataToAdd });
        if (companyAdd?.success) {
          setGlobalObjectId(companyAdd?.data);
          setShowSuccessModal(true);
          // Navigate(`/master-management/company-master`);
        }
      } else {
        const companyAdd = await addCompany({ data: dataToAdd });
        if (companyAdd?.success) {
          setGlobalObjectId(companyAdd?.data);
          setShowSuccessModal(true);
          // Navigate(`/master-management/company-master`);
          // reset();
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setModalOpen(false);
  };

  const onSubmit = (data) => {
    setData(data);
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (companyDetails && id && Object.keys(companyDetails).length > 0) {
      // reset({

      setValue("address1", companyDetails?.address1);
      setValue("address2", companyDetails?.address2);
      setValue("address3", companyDetails?.address3);
      setValue("city", {
        value: companyDetails?.cityId,
        label: companyDetails?.city,
      });
      setValue("countryName", {
        value: companyDetails?.countryId,
        label: companyDetails?.countryName,
      });
      setValue("stateName", {
        value: companyDetails?.stateId,
        label: companyDetails?.stateName,
      });

      setValue("name", companyDetails?.name);
      setValue("email", companyDetails?.email);
      setValue("bankName", companyDetails?.bankName);
      setValue("bankACNo", companyDetails?.bankACNo);
      setValue("websiteURL", companyDetails?.websiteURL);
      setValue("phone", companyDetails?.phone);
      setValue("ifscCode", companyDetails?.ifscCode);
      setValue("msmeRegNo", companyDetails?.msmeRegNo);
      setValue("pocContactNo", companyDetails?.pocContactNo);
      setValue("pocEmailID", companyDetails?.pocEmailID);
      setValue("pocName", companyDetails?.pocName);
      setValue("isActive", companyDetails?.isActive);
      setValue("gstNo", companyDetails?.gstNo);
      setValue("pinCode", companyDetails?.pinCode);
      setValue("panNo", companyDetails?.panNo);
      setValue("isActive", {
        value: companyDetails?.isActive,
        label: companyDetails?.isActive ? "Active" : "Inactive",
      });
      // });
    }
    setStatusOptionsVal(companyDetails?.isActive);
  }, [companyDetails, id]);

  const location = useLocation();
  const titleForBreadCrumb = location?.pathname?.includes("edit-company")
    ? "Edit"
    : location?.pathname?.includes("add-company")
    ? "Add"
    : "";
  const title = `Company Master `;

  let breadCrumbData;
  if (location?.pathname?.includes("add-company")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/company-master",
        name: "Company Master",
      },
      { route: "", name: `${titleForBreadCrumb} Company` },
    ];
  } else {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/company-master",
        name: "Company Master",
      },
      { route: "", name: `${titleForBreadCrumb} Company` },
    ];
  }

  const handleSuccess = () => {
    if (id) {
      Navigate(`/master-management/company-master`);
    } else {
      Navigate(`/master-management/company-master`);
      reset();
    }
  };

  return (
    <>
      <ToastContainer />
      <PageTitle title={title} breadCrumbData={breadCrumbData} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content-wrapper">
          <h3 className="flex items-center mb-3 text-xl font-semibold">
            {titleForBreadCrumb} Company
          </h3>
          <div className="px-8 py-8 bg-white border rounded-lg shadow">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Name <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    {...register("name", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Name should contain only letters and spaces",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.name && (
                    <p className="text-sm text-red-400">
                      {errors?.name?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    POC Name<span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="pocName"
                    {...register("pocName", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Name should contain only letters and spaces",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                    })}
                    className={` form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.pocName && (
                    <p className="text-sm text-red-400">
                      {errors?.pocName?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    POC Contact Number{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="pocContactNo"
                    {...register("pocContactNo", {
                      required: {
                        value: true,
                        message: "This field is  required",
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Invalid contact number",
                      },
                      maxLength: {
                        value: 10,
                        message: "mobile number must not be more than 10 digit",
                      },
                      // minLength: {
                      //   value: 10,
                      //   message: "mobile number must not be less than 10 digit",
                      // },
                    })}
                    className={`form-input 
                    px-4 py-3 border-gray-300 shadow-sm 
                    rounded-md w-full`}
                  />
                  {errors?.pocContactNo && (
                    <p className="text-sm text-red-400">
                      {errors?.pocContactNo?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Status <span className="ml-1 text-red-400">*</span>
                  </label>
                  <Controller
                    name="isActive"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={statusOptions}
                        placeholder="Select status"
                        // classNamePrefix="react-select"
                        onChange={(selectedOption) => {
                          setStatusOptionsVal(selectedOption?.value ?? null);
                          field.onChange(selectedOption);
                        }}
                        isClearable
                      />
                    )}
                  />
                  {/* <select
                    name="isActive"
                    {...register("isActive", {
                      required: {
                        value: true,
                        message: "This field is  required",
                      },
                    })}
                    className={`form-select 
                      block w-full rounded-md border-gray-300 
                      shadow-sm focus:border-indigo-300 focus:ring
                       focus:ring-indigo-200 focus:ring-opacity-50 py-3`}
                  >
                    {/* <option value="">-Select status-</option> */}
                  {/* <option value="true">Active</option>
                    <option value="false">Inactive</option> */}
                  {/* </select>  */}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    POC Email ID <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="pocEmailID"
                    {...register("pocEmailID", {
                      required: "This field is  required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format.",
                      },
                    })}
                    className={` form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.pocEmailID && (
                    <p className="text-sm text-red-400">
                      {errors?.pocEmailID?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <br />
            <h3 className="flex items-center mb-3 text-xl font-semibold">
              Company Contact Details
            </h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Address Line 1{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="address1"
                    {...register("address1", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Za-z0-9\s,.-]+$/,
                        message:
                          "Address should contain only letters, numbers, spaces, and ,.-",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                    })}
                    className={` form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.address1 && (
                    <p className="text-sm text-red-400">
                      {errors?.address1?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Address Line 2{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="address1"
                    {...register("address2", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Za-z0-9\s,.-]+$/,
                        message:
                          "Address should contain only letters, numbers, spaces, and ,.-",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                    })}
                    className={` form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.address2 && (
                    <p className="text-sm text-red-400">
                      {errors?.address2?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Address Line 3{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="address3"
                    {...register("address3", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Za-z0-9\s,.-]+$/,
                        message:
                          "Address should contain only letters, numbers, spaces, and ,.-",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.address3 && (
                    <p className="text-sm text-red-400">
                      {errors?.address3?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Pin code / Zip Code{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    {...register("pinCode", {
                      required: "This field is required",
                      pattern: {
                        value: /^[0-9\s,.-]+$/,
                        message: "Allowed minimum digits are 5 and maximum 6",
                      },
                      maxLength: {
                        value: 6,
                        message: "Allowed minimum digits are 5 and maximum 6",
                      },
                      minLength: {
                        value: 5,
                        message: "Allowed minimum digits are 5 and maximum 6",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.pinCode && (
                    <p className="text-sm text-red-400">
                      {errors?.pinCode?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company contact number{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    {...register("phone", {
                      required: "This field is required",
                      pattern: {
                        value: /^[0-9\s,.-]+$/,
                        message: "Invalid contact number",
                      },
                      maxLength: {
                        value: 10,
                        message: "Allowed maximum 10 digit",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.phone && (
                    <p className="text-sm text-red-400">
                      {errors?.phone?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Country <span className="ml-1 text-red-400">*</span>
                  </label>
                  <Controller
                    name={`countryName`}
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        cacheOptions
                        options={countryOption}
                        onChange={(val) => {
                          setCountryVal(val);
                          fetchStateOptions(val);
                          setValue("stateName", null);
                          setValue("city", null);
                          field.onChange(val);
                        }}
                        isClearable={true}
                        placeholder="Enter here..."
                        //styles={customStyles}
                        isRequired={true}
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                  {errors?.countryName && (
                    <p className="text-sm text-red-400">
                      {errors?.countryName?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    State <span className="ml-1 text-red-400">*</span>
                  </label>
                  <Controller
                    name={`stateName`}
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        cacheOptions
                        options={stateOptions}
                        onChange={(val) => {
                          setStateVal(val);
                          fetchCityOptions(val);
                          field.onChange(val);
                        }}
                        isClearable={true}
                        placeholder="Enter here..."
                        //styles={customStyles}
                        isRequired={true}
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                  {errors?.stateName && (
                    <p className="text-sm text-red-400">
                      {errors?.stateName?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
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

                  {errors?.city && (
                    <p className="text-sm text-red-400">
                      {errors?.city?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Email ID{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format.",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-400">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Website URL
                  </label>
                  <input
                    type="text"
                    name="websiteURL"
                    {...register("websiteURL", {
                      // pattern: {
                      //   value:
                      //     /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                      //   message: "Invalid website url",
                      // },
                      maxLength: {
                        value: 100,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.websiteURL && (
                    <p className="text-sm text-red-400">
                      {errors?.websiteURL?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <br />
            <h3 className="flex items-center mb-3 text-xl font-semibold">
              Company Bank / Other Details
            </h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Bank Name{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    {...register("bankName", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Za-z0-9\s,.-]+$/,
                        message: "Name should contain only letters and spaces",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                      minLength: {
                        value: 2,
                        message:
                          "Allowed minimum characters are 2 and maximum 100",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.bankName && (
                    <p className="text-sm text-red-400">
                      {errors?.bankName?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Company Bank A/C No.{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankACNo"
                    {...register("bankACNo", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Allowed number only",
                      },
                      maxLength: {
                        value: 20,
                        message: "Allowed minimum digits are 5 and maximum 20",
                      },
                      minLength: {
                        value: 5,
                        message: "Allowed minimum digits are 5 and maximum 20",
                      },
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.bankACNo && (
                    <p className="text-sm text-red-400">
                      {errors?.bankACNo?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    GST NO.<span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstNo"
                    {...register("gstNo", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z1-9]{1}Z[0-9A-Z]{1}$/,
                        message: "Invalid GST No",
                      }
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.gstNo && (
                    <p className="text-sm text-red-400">
                      {errors?.gstNo?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <UploadMediaCMS
                    register={register}
                    handleSubmit={handleSubmit}
                    globalObjectId={globalObjectId}
                    disabled={false}
                    name="GST Document"
                    mandate={false}
                    errors={errors}
                    uploadFor={"GST Document"}
                    id={1}
                    uuidVal={`company_${1}`}
                  />
                </div>
              </div>

              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    MSME Registration No.
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="msmeRegNo"
                    {...register("msmeRegNo", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Z0-9]{19}$/,
                        message: "Invalid MSME Registration No",
                      }
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.msmeRegNo && (
                    <p className="text-sm text-red-400">
                      {errors?.msmeRegNo?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <UploadMediaCMS
                    register={register}
                    handleSubmit={handleSubmit}
                    globalObjectId={globalObjectId}
                    disabled={false}
                    name="MSME Document"
                    mandate={false}
                    errors={errors}
                    uploadFor={"MSME Document"}
                    id={2}
                    uuidVal={`company_${2}`}
                  />
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    PAN NO <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="panNo"
                    {...register("panNo", {
                      required: "This field is required",
                      pattern: {
                        value:  /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ ,
                        message: "Invalid PAN No",
                      }
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.panNo && (
                    <p className="text-sm text-red-400">
                      {errors?.panNo?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-5">
                <div className="form-field">
                  <UploadMediaCMS
                    register={register}
                    handleSubmit={handleSubmit}
                    globalObjectId={globalObjectId}
                    disabled={false}
                    name="PAN Document"
                    mandate={false}
                    errors={errors}
                    uploadFor={"PAN Document"}
                    id={3}
                    uuidVal={`company_${3}`}
                  />
                </div>
              </div>

              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    IFSC Code<span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    {...register("ifscCode", {
                      required: "This field is  required",
                      pattern: {
                        value: /^[A-Z]{4}0[0-9A-Z]{6}$/,
                        message: "Invalid IFSC Code",
                      }
                    })}
                    className={`form-input px-4 py-3
                     border-gray-300 shadow-sm rounded-md
                      w-full`}
                  />
                  {errors?.ifscCode && (
                    <p className="text-sm text-red-400">
                      {errors?.ifscCode?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 action-buttons text-end">
            <>
              <button
                type="button"
                onClick={() => Navigate(-1)}
                className="py-2.5 px-8 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-8 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Save
              </button>
            </>
          </div>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        title={"Company"}
        description={"Are you sure you want to save company details?"}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
      {showSuccessModal && (
        <SuccessModal
          title={`Company ${id ? "updated" : "added"} successfully`}
          showSuccessModal={showSuccessModal}
          setShowSuccessModal={(data) => setShowSuccessModal(data)}
          handleResponse={() => handleSuccess()}
        />
      )}
    </>
  );
};
