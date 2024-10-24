import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { FaComment, FaHeart } from "react-icons/fa";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast, ToastContainer } from "react-toastify";
import {
  createAddendumRenewalAggregator,
  createMouTpa,
  fetchMOUList,
  getAggregatorById,
  getMouById,
  updateMouTpa,
} from "../../Services/mouServices";
// import AuditLogs from "../Common/AuditLogs";
import SuccessModal from "../../Components/Common/ModalPopups/SuccessModal";
import {
  fetchEmpId,
  documentApproval,
  fetchCreditCompanies,
  fetchInsuranceCompanies,
  fetchTariffs,
  fetchMaterialList,
  fetchServicesList,
  fetchFileLocations,
} from "../../Services/external";
import {
  convertFromUnix1,
  convertToDateString,
  convertToDateStringg,
  generateYearOptions,
  makeItProperObject,
  mouContractSegment,
  mouContractSegmentUnits,
} from "../../utils/other";
import LatestModalPopUp from "../../Components//Common/LatestModalPopUp";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import PageTitle from "../../Components//Common/PageTitle";
import {
  convertFromUnix,
  convertIntoUnix,
  fetchAddendumTo,
  fetchApproveDocument,
  fetchCreditCompany,
  fetchEmpNameOptions,
  fetchInsuranceCompany,
  fetchMaterialServices,
  getUnitId,
} from "../../utils/functions";
import UploadMediaCMS from "../../Components//Common/UploadMediaCMS";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import MOUContext from "../../context/MOUContext";
import ViewAttachmentsCMS from "../../Components//Common/ViewAttachmentsCMS";
import { BsCheck, BsChevronRight } from "react-icons/bs";
import moment from "moment";
import { logDOM } from "@testing-library/react";

const initial = {};
const AddendumRenewalAggregator = ({
  id,
  AggregatorId,
  openPreviewName,
  status,
  setOpenAddendumRenew,
  contractType,
  globalObjectIdVal,
  view = false,
  renewal,
  renewalSuccess,
  setRenewalId,
  index,
  currentUnitId,
}) => {
  const Navigate = useNavigate();
  const { mouId } = useParams();
  const location = useLocation();
  const { addendum, renew, text } = location.state || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const edit = true;
  //   const edit = searchParams.get("edit");
  const unitId = getUnitId();
  // const location = useLocation();
  // const { edit } = location.state || {};
  const { MOUDetails, setMOUDetails } = useContext(MOUContext);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    customStyles,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  // } = useForm({ defaultValues: view || edit ? MOUDetails : {} });

  const coPaymentPercent = watch("coPaymentInPercent");
  const opCoPayment = watch("opCoPayment");
  const hcCoPayment = watch("hcCoPayment");
  const ipCoPayment = watch("ipCoPayment");
  const netralayaCoPayment = watch("netralayaCoPayment");
  const validityDateFrom = watch("validityDateFrom");
  const isValidityRenewal = watch("isValidityRenewal");
  const patientDeposit = watch("patientDeposit");
  const opCoPaymentEmployee = watch("opCoPaymentEmployee");
  const opCoPaymentDependant = watch("opCoPaymentDependant");
  const hcCoPaymentEmployee = watch("hcCoPaymentEmployee");
  const hcCoPaymentDependant = watch("hcCoPaymentDependant");
  const ipCoPaymentEmployee = watch("ipCoPaymentEmployee");
  const ipCoPaymentDependant = watch("ipCoPaymentDependant");
  const netralayaCoPaymentEmployee = watch("netralayaCoPaymentEmployee");
  const netralayaCoPaymentDependant = watch("netralayaCoPaymentDependant");
  const nonAdmissableService = watch("nonAdmissableService");
  const checkboxes = watch(["op", "ip", "hc", "netralaya"]);
  const validityDateTo = watch("validityDateTo");
  const addendumTo = watch("addendumTo");
  const aggregatorReference = watch("aggregatorReference");

  const renewalDateFrom = watch("renewalFrom");
  const renewalDateTo = watch("renewalTo");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(null);
  const [custodianNameOption, setCustodianNameOption] = useState(null);
  const [approveDocument, setApproveDocument] = useState(null);
  const [dataToSave, setDataToSave] = useState();
  const [isOpen, setIsOpen] = useState();
  const [globalObjectId, setGlobalObjectId] = useState(
    globalObjectIdVal ?? null
  );
  const [creditCompanies, setCreditCompanies] = useState(null);
  const [insuranceCompanies, setInsuranceCompanies] = useState(null);
  const [tariffList, setTariffList] = useState(null);
  const [fileLocationList, setFileLocationList] = useState(null);
  const [insurenceCompanyName, setInsurenceCompanyName] = useState("");
  const [renewalMinDate, setRenewalMinDate] = useState(null);

  //  const [addendumTo,setAddendumTo] = useState({label:"",value:""})
  //  const [addendumToOptions,setAddendumToOptions] = useState()
  const [addendumAggregatorId, setAddendumAggregatorId] =
    useState(AggregatorId);

  const opWatch = watch("op");
  const ipWatch = watch(`ip`);
  const hcWatch = watch(`hc`);
  const netralayaWatch = watch(`netralaya`);

  useEffect(() => {
    if (opWatch == true) {
      setValue(`opCoPayment`, true);
      // setValue(`opDiscount`, true);
    }
    if (opWatch == false) {
      setValue(`opCoPayment`, false);
      // setValue(`opDiscount`, false);
    }
    if (ipWatch == true) {
      setValue(`ipCoPayment`, true);
      // setValue(`ipDiscount`, true);
    }
    if (ipWatch == false) {
      setValue(`ipCoPayment`, false);
      // setValue(`ipDiscount`, false);
    }
    if (hcWatch == true) {
      setValue(`hcCoPayment`, true);
      // setValue(`hcDiscount`, true);
    }
    if (hcWatch == false) {
      setValue(`hcCoPayment`, false);
      // setValue(`hcDiscount`, false);
    }
    if (netralayaWatch == true) {
      setValue(`netralayaCoPayment`, true);
      // setValue(`netralayaDiscount`, true);
    }
    if (netralayaWatch == false) {
      setValue(`netralayaCoPayment`, false);
      // setValue(`netralayaDiscount`, false);
    }
  }, [opWatch, ipWatch, hcWatch, netralayaWatch, setValue]);

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

  const fetchFileLocation = async () => {
    try {
      const response = await fetchFileLocations();

      const data = response?.success;

      const result = data?.map((item) => ({
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
    fetchCreditCompany();
    fetchInsuranceCompany();
    fetchTariffList();
    fetchFileLocation();
  }, []);

  useEffect(() => {
    if (renewal) {
      const data = getValues();
      submitAggregator(data);
    }
  }, [renewal]);

  useEffect(() => {
    if (id && AggregatorId) {
      getAggregatorDetails(id, AggregatorId);
    }
  }, [id, AggregatorId]);

  const getAggregatorDetails = async (id) => {
    try {
      const mouDetail = await getAggregatorById({
        id: id,
        AggregatorId: AggregatorId,
      });
      if (mouDetail?.success) {
        const response = mouDetail?.data?.length ? mouDetail?.data[0] : {};
        // const data = response?.terminationDetails;
        if (response?.categoryTypeName == "Aggregator") {
          const defaultValue = makeItProperObject(response, 3, openPreviewName);
          setGlobalObjectId(defaultValue?.aggregators[0]?.globalObjectId);
          reset(defaultValue?.aggregators[0]);
          setRenewalMinDate(
            response?.mouAggregatorDetail[0]?.validityDateFrom
              ? convertFromUnix(
                  response?.mouAggregatorDetail[0]?.validityDateFrom
                )
              : ""
          );
        }
      }
    } catch (error) {
      toast.error(
        error.message ?? "Error while fetching mou contract details",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };
  // useEffect(()=>{
  //   if(addendumTo?.label && !addendum?.value){
  //     getAddendumToOptions(addendumTo?.label)
  //   }
  // },[addendumTo?.label])

  const submitAggregator = (renewalData) => {
    const data = renewal ? renewalData : dataToSave;

    let payload = {
      // ...MOUDetails,
      contractStatusType: openPreviewName == "Add Renew" ? 2 : 3,
      aggregatorReference: AggregatorId.toString(),
      aggregatorId: 0,
      mouId: id,
      contractName: MOUDetails?.contractName,
      mouContractId: MOUDetails?.mouContractId,
      globalObjectId: MOUDetails?.globalObjectId,
      //...MOUDetails,
      categoryTypeEnum: 3,
      categoryTypeName: "Aggregator",
      unitId: currentUnitId || unitId,
      // creditCompanyId: data?.creditCompany?.value,
      // creditCompany: data?.creditCompany?.label,
      insuranceCompanyId: data?.insuranceCompany?.value,
      insuranceCompany: data?.insuranceCompany?.label,
      contractSegment: mouContractSegmentUnits(
        data?.op,
        data?.ip,
        data?.hc,
        data?.netralaya
      ),
      isCoPayment:
        data?.coPaymentInPercent == "yes"
          ? true
          : data?.coPaymentInPercent == "no"
          ? false
          : "",
      validityDateFrom: data?.validityDateFrom
        ? convertIntoUnix(data?.validityDateFrom)
        : "",
      validityDateTo: data?.validityDateTo
        ? convertIntoUnix(data?.validityDateTo)
        : "",
      isValidityRenewal: data?.isValidityRenewal,
      renewalDateFrom: data?.renewalFrom
        ? convertIntoUnix(data?.renewalFrom)
        : "",
      renewalDateTo: data?.renewalTo ? convertIntoUnix(data?.renewalTo) : "",
      approvalDocument: data?.approvalDocuments?.map((item) => {
        return {
          label: item?.label,
          value: "" + item?.value,
          aggregatorNumber: 0,
        };
      }),
      isNAMaterialService:
        data?.nonAdmissableService == "yes"
          ? true
          : data?.nonAdmissableService == "no"
          ? false
          : "",
      materialService:
        data?.naMaterialService?.length > 0
          ? data?.naMaterialService?.map((item) => {
              return {
                ...item,
                value: item?.value,
                aggregatorNumber: 0,
              };
            })
          : null,
      // naMaterialServiceId: ["string"],
      // naMaterialServiceName: ["string"],
      isPatientDeposit:
        data?.patientDeposit == "yes"
          ? true
          : data?.patientDeposit == "no"
          ? false
          : "",
      patientDepositAmount:
        data?.patientDeposit == "yes" ? data?.patientDepositInRupees : null,
      paymentTermsDays: data?.paymentTerms,
      status: 1,
      // mouReference: null,
      // previousMouNumber: null,
      mouContractSegmentDetails:
        data?.coPaymentInPercent == "yes"
          ? mouContractSegment(
              data?.ipCoPayment,
              data?.opCoPayment,
              data?.hcCoPayment,
              data?.netralayaCoPayment,
              data,
              0,
              false
            )
          : null,
      contractDiscountOnTariff: {
        aggregatorId: 0,
        dotTariffId: data?.discountTariff?.value,
        dotTariffName: data?.discountTariff?.label,
        dotTransactionYear: data?.discountTransactionYear,
        dotop: data?.opDiscount,
        dotip: data?.ipDiscount,
        dothc: data?.hcDiscount,
        dotNetralaya: data?.netralayaDiscount,

        // dotop: data?.opDiscount == false ? 0 : data?.opDiscount,
        // dotip: data?.ipDiscount == false ? 0 : data?.ipDiscount,
        // dothc: data?.hcDiscount == false ? 0 : data?.hcDiscount,
        // dotNetralaya:
        //   data?.netralayaDiscount == false ? 0 : data?.netralayaDiscount,
      },

      contractCustodianDetails: {
        aggregatorNumber: 0,
        custodianName: data?.custodianName?.label,
        custodianFileLocation: data?.fileLocation?.label,
        CustodianFileName: "File 1",
        CustodianFilePath: "C-Folder",
        custodianDetails: data?.addDetails,
        custodianEmpCode: data?.custodianName?.value,
      },
    };

    const createAddednumRenew = async () => {
      setGlobalObjectId();
      try {
        let result = await createAddendumRenewalAggregator({ data: payload });
        if (result?.success) {
          setGlobalObjectId(result?.data[0]?.globalObjectId);
          setAddendumAggregatorId(result?.data[0]?.aggregatorId);
          setShowSuccessModal(true);
        } else {
          toast.error("Error while creating TPA", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        toast.error(error.message ?? "Error while creating TPA", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } finally {
        setIsOpen(false);
      }
    };
    createAddednumRenew();
  };
  const onSubmit = (data) => {
    setIsOpen(true);
    setDataToSave(data);
    const companyName = data?.insuranceCompany?.label;
    setInsurenceCompanyName(companyName);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <div className="bg-white shadow relative p-4 rounded-b mb-5">
          <p className="text-xl font-semibold mb-4">{` MOU ID - ${mouId}`}</p>
          <p className="text-xl font-semibold mb-4">{`${openPreviewName} Aggregator Id - ${AggregatorId}`}</p>
          {addendum && !edit ? (
            <>
              <div className="grid grid-cols-12 mb-4">
                <div className="col-span-8"></div>
                <div className="col-span-4 gap-5">
                  <label
                    htmlFor="addendumTo"
                    className="inline-block text-gray-500 font-medium mb-2"
                  >
                    Add Addendum To
                  </label>
                  <Controller
                    name={`addendumTo`}
                    control={control}
                    // rules={{ required: true }}
                    render={({ field }) => (
                      <AsyncSelect
                        // isMulti={true}
                        {...field}
                        cacheOptions
                        loadOptions={fetchAddendumTo}
                        // defaultValue={approveDocument}
                        // value={approveDocument}
                        onChange={(approveDocument) => {
                          // setApproveDocument(approveDocument);
                          field.onChange(approveDocument);
                        }}
                        isClearable={true}
                        placeholder="MOU ID"
                        isDisabled={view}
                        styles={customStyles}
                        // isRequired={true}
                      />
                    )}
                  />
                </div>
              </div>
              <hr className="my-8" />
            </>
          ) : (
            ""
          )}
          <div className="bg-white shadow relative p-4 rounded-b mb-5">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-4">
                <label
                  htmlFor="creditCompany"
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  Credit Company
                </label>
                <p className="text-lg font-medium">
                  {MOUDetails?.contractName}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {/* <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <label
                htmlFor="creditCompany"
                className="inline-block text-gray-500 font-medium mb-2"
              >
                Credit Company <span className="ml-1 text-red-400">*</span>
              </label>
              <Controller
                name={`creditCompany`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={creditCompanies}
                    isClearable={true}
                    isDisabled={view || renew || addendum}
                    classNamePrefix="react-select"
                    placeholder="Select credit company"
                  />
                )}
              />
              {errors?.creditCompany && (
                <span className="text-red-500 mt-1">
                  This field is required
                </span>
              )}
            </div> */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <label
                htmlFor="creditCompany"
                className="inline-block text-gray-500 font-medium mb-2"
              >
                Insurance Company <span className="ml-1 text-red-400">*</span>
              </label>
              <Controller
                name={`insuranceCompany`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  //   <AsyncSelect
                  //   {...field}
                  //   loadOptions={fetchInsuranceCompany}
                  //   onChange={(insuranceCompany) => {
                  //     field.onChange(insuranceCompany);
                  //   }}
                  //   isDisabled={view}
                  //   isClearable={true}
                  //   placeholder="Select insurance company"
                  //   styles={customStyles}
                  //   isRequired={true}
                  // />
                  <Select
                    {...field}
                    options={insuranceCompanies}
                    isClearable={true}
                    isDisabled={view}
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

          <hr className="my-8" />

          {/* contract segment */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">
                Contract Segment <span className="ml-2 text-red-400">*</span>
              </p>
            </div>
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center ">
                <input
                  type="checkbox"
                  id="op"
                  className={`mr-2 ${
                    !view && "cursor-pointer"
                  } w-5 h-5 border-gray-400 rounded`}
                  // value={true}
                  {...register("op", {
                    validate: (value) => {
                      const values = getValues();
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
                  disabled={view}
                />
                <label htmlFor="op">OP</label>
              </div>
            </div>
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="ip"
                  className={`mr-2 ${
                    !view && "cursor-pointer"
                  } w-5 h-5 border-gray-400 rounded`}
                  {...register("ip")}
                  disabled={view}
                />
                <label htmlFor="ip">IP</label>
              </div>
            </div>
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="hc"
                  className={`mr-2 ${
                    !view && "cursor-pointer"
                  } w-5 h-5 border-gray-400 rounded`}
                  {...register("hc")}
                  disabled={view}
                />
                <label htmlFor="hc">HC</label>
              </div>
            </div>
            <div className="col-span-3 md:col-span-2">
              <div className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="netralaya"
                  className={`mr-2 ${
                    !view && "cursor-pointer"
                  } w-5 h-5 border-gray-400 rounded`}
                  {...register("netralaya")}
                  disabled={view}
                />
                <label htmlFor="netralaya">Netralaya</label>
              </div>
            </div>

            {errors.op && (
              <p className="text-red-500  col-span-12">{errors?.op?.message}</p>
            )}
          </div>

          <hr className="my-8" />

          {/* co-payment percentage */}
          <div className="grid grid-cols-12 gap-5">
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
                      !view && "cursor-pointer"
                    } border-gray-400 w-5 h-5`}
                    value="yes"
                    name="coPaymentInPercent"
                    disabled={view}
                    {...register("coPaymentInPercent", { required: true })}
                  />
                  <label htmlFor="coPaymentInPercentYes">Yes</label>

                  <input
                    type="radio"
                    id="coPaymentInPercentNo"
                    className={`${
                      !view && "cursor-pointer"
                    } border-gray-400 w-5 h-5`}
                    value="no"
                    name="coPaymentInPercent"
                    disabled={view}
                    {...register("coPaymentInPercent", {
                      required: "This field is required",
                    })}
                  />
                  <label htmlFor="coPaymentInPercentNo">No</label>
                </div>
              </div>
              <p className="text-red-500   mt-1 ">
                {errors?.coPaymentInPercent?.message}
              </p>
            </div>
            {coPaymentPercent == "yes" && (
              <div className="col-span-12 md:col-span-7 relative overflow-x-auto">
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
                            disabled={true}
                            id="isCoPayment"
                            className={`mr-2 ${
                              !view && "cursor-pointer"
                            } w-5 h-5 border-gray-400 rounded`}
                            {...register("opCoPayment")}
                          />
                          <label htmlFor="isCoPayment">OP</label>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {opCoPayment && (
                          <div className="w-full">
                            <div className="flex w-full justify-between gap-2">
                              <div className="relative flex-1 flex justify-center">
                                <input
                                  disabled={view}
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  {...register("opCoPaymentEmployee", {
                                    required:
                                      opCoPayment && "This field is required",
                                    pattern: {
                                      value: /^[0-9]*$/,
                                      message:
                                        "Only numeric values are allowed",
                                    },
                                    max: {
                                      value: 100,
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />

                                <p className="text-red-500 absolute mt-1 top-full ">
                                  {errors?.opCoPaymentEmployee &&
                                    errors?.opCoPaymentEmployee?.message}
                                </p>
                              </div>
                              <div className="relative flex-1 flex justify-center">
                                <input
                                  disabled={view}
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  type="number"
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  {...register("opCoPaymentDependant", {
                                    required:
                                      opCoPayment && "This field is required",
                                    pattern: {
                                      value: /^[0-9]*$/,
                                      message:
                                        "Only numeric values are allowed",
                                    },
                                    max: {
                                      value: 100,
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />
                                <p className="text-red-500  absolute mt-1 top-full  ">
                                  {errors?.opCoPaymentDependant &&
                                    errors?.opCoPaymentDependant?.message}
                                </p>
                              </div>
                            </div>
                            {/* <p className="flex w-full justify-center text-red-500 mt-1">
                                {opCoPaymentEmployee &&
                                opCoPaymentDependant &&
                                +opCoPaymentEmployee + +opCoPaymentDependant !=
                                  100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p> */}
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-3 align-middle">
                        <div className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="hcCoPayment"
                            disabled={true}
                            className={`mr-2 ${
                              !view && "cursor-pointer"
                            } w-5 h-5 border-gray-400 rounded`}
                            {...register("hcCoPayment")}
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
                                  disabled={view}
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  type="number"
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  {...register("hcCoPaymentEmployee", {
                                    required:
                                      hcCoPayment && "This field is required",
                                    pattern: {
                                      value: /^[0-9]*$/,
                                      message:
                                        "Only numeric values are allowed",
                                    },
                                    max: {
                                      value: 100,
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />
                                <p className="text-red-500  absolute mt-1 top-full  ">
                                  {errors?.hcCoPaymentEmployee &&
                                    errors?.hcCoPaymentEmployee?.message}
                                </p>
                              </div>
                              <div className="relative flex-1 flex justify-center">
                                <input
                                  disabled={view}
                                  type="number"
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  {...register("hcCoPaymentDependant", {
                                    required:
                                      hcCoPayment && "This field is required",
                                    pattern: {
                                      value: /^[0-9]*$/,
                                      message:
                                        "Only numeric values are allowed",
                                    },
                                    max: {
                                      value: 100,
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />
                                <p className="text-red-500 absolute mt-1 top-full  ">
                                  {errors?.hcCoPaymentDependant &&
                                    errors?.hcCoPaymentDependant?.message}
                                </p>
                              </div>
                            </div>
                            {/* <p className="flex w-full justify-center text-red-500 mt-1">
                                {hcCoPaymentEmployee &&
                                hcCoPaymentDependant &&
                                +hcCoPaymentEmployee + +hcCoPaymentDependant !=
                                  100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p> */}
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-3 align-middle">
                        <div className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="ipCoPayment"
                            disabled={true}
                            className={`mr-2 ${
                              !view && "cursor-pointer"
                            } w-5 h-5 border-gray-400 rounded`}
                            {...register("ipCoPayment")}
                          />
                          <label htmlFor="ipCoPayment">IP</label>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {ipCoPayment && (
                          <div className="w-full">
                            <div className="flex w-full justify-between gap-2">
                              <div className="relative flex-1 flex justify-center">
                                <input
                                  disabled={view}
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  type="number"
                                  {...register("ipCoPaymentEmployee", {
                                    required:
                                      ipCoPayment && "This field is required",
                                    pattern: {
                                      value: /^[0-9]*$/,
                                      message:
                                        "Only numeric values are allowed",
                                    },
                                    max: {
                                      value: 100,
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />
                                <p className="text-red-500 absolute mt-1 top-full ">
                                  {errors?.ipCoPaymentEmployee
                                    ? errors?.ipCoPaymentEmployee?.message
                                    : ""}
                                </p>
                              </div>
                              <div className="relative flex-1 flex justify-center">
                                <input
                                  disabled={view}
                                  type="number"
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  {...register("ipCoPaymentDependant", {
                                    required:
                                      ipCoPayment && "This field is required",
                                    pattern: {
                                      value: /^[0-9]*$/,
                                      message:
                                        "Only numeric values are allowed",
                                    },
                                    max: {
                                      value: 100,
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />
                                <p className="text-red-500 absolute mt-1 top-full   ">
                                  {errors?.ipCoPaymentDependant &&
                                    errors?.ipCoPaymentDependant?.message}
                                </p>
                              </div>
                            </div>
                            {/* <p className="flex w-full justify-center text-red-500 mt-1">
                                {ipCoPaymentEmployee &&
                                ipCoPaymentDependant &&
                                +ipCoPaymentEmployee + +ipCoPaymentDependant !=
                                  100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p> */}
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-3 align-middle">
                        <div className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="netralayaCoPayment"
                            disabled={true}
                            className={`mr-2 ${
                              !view && "cursor-pointer"
                            } w-5 h-5 border-gray-400 rounded`}
                            {...register("netralayaCoPayment")}
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
                                  disabled={view}
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  type="number"
                                  {...register("netralayaCoPaymentEmployee", {
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
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />
                                <p className="text-red-500 absolute mt-1 top-full   ">
                                  {errors?.netralayaCoPaymentEmployee &&
                                    errors?.netralayaCoPaymentEmployee?.message}
                                </p>
                              </div>
                              <div className="relative flex-1 flex justify-center">
                                <input
                                  disabled={view}
                                  type="number"
                                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                    view && "bg-gray-100"
                                  }`}
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    if (value < 0) {
                                      e.target.value = 0;
                                    } else if (value > 100) {
                                      e.target.value = 100;
                                    }
                                  }}
                                  {...register("netralayaCoPaymentDependant", {
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
                                      message: "Value must be between 0 to 100",
                                    },
                                    min: {
                                      value: 0,
                                      message: "Value must be between 0 to 100",
                                    },
                                  })}
                                />
                                <p className="text-red-500 absolute mt-1 top-full   ">
                                  {errors?.netralayaCoPaymentDependant &&
                                    errors?.netralayaCoPaymentDependant
                                      ?.message}
                                </p>
                              </div>
                            </div>
                            {/* <p className="flex w-full justify-center text-red-500 mt-1">
                                {netralayaCoPaymentEmployee &&
                                netralayaCoPaymentDependant &&
                                +netralayaCoPaymentEmployee +
                                  +netralayaCoPaymentDependant !=
                                  100
                                  ? "Total % should match 100%"
                                  : ""}
                              </p> */}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <hr className="my-8" />

          {/* Validity */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-6">
              <div className="flex items-center">
                <p className="text-xl font-semibold">Validity</p>
                <div className="inline-flex items-center ml-8">
                  <input
                    type="checkbox"
                    id="isValidityRenewal"
                    className={`mr-2 ${
                      !view && "cursor-pointer"
                    } w-5 h-5 border-gray-400 rounded `}
                    disabled={view}
                    {...register("isValidityRenewal")}
                  />
                  <label htmlFor="isValidityRenewal">Renewal Opted</label>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-5 mt-4">
                <div className="col-span-6">
                  <label
                    htmlFor=""
                    className="inline-block text-gray-500 font-medium mb-2"
                  >
                    From <span className="ml-1 text-red-400">*</span>
                  </label>
                  <Controller
                    name="validityDateFrom"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <DatePicker
                        className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                          view && "bg-gray-100"
                        }`}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholderText="Select from date"
                        // required
                        disabled={view}
                        minDate={
                          openPreviewName == "Add Renew" ? renewalMinDate : ""
                        }
                        excludeDates={[
                          openPreviewName == "Add Renew" ? renewalMinDate : "",
                        ]}
                        dateFormat="dd/MM/yyyy" // Set the date format
                      />
                    )}
                  />
                  {errors.validityDateFrom && (
                    <p className="text-red-500  mt-1">
                      {errors?.validityDateFrom?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-6">
                  <label
                    htmlFor=""
                    className="inline-block text-gray-500 font-medium mb-2"
                  >
                    To <span className="ml-1 text-red-400">*</span>
                  </label>
                  <Controller
                    name="validityDateTo"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <DatePicker
                        className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                          view && "bg-gray-100"
                        }`}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholderText="Select to date"
                        // required
                        disabled={view}
                        minDate={validityDateFrom}
                        excludeDates={[validityDateFrom]}
                        dateFormat="dd/MM/yyyy" // Set the date format
                      />
                    )}
                  />
                  {errors.validityDateTo && (
                    <p className="text-red-500  mt-1">
                      {errors?.validityDateTo?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isValidityRenewal && (
              <div className="col-span-12 md:col-span-6">
                <p className="text-xl font-semibold">Renewal Dates</p>
                <div className="grid grid-cols-12 gap-x-5 mt-4">
                  <div className="col-span-6">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      From{" "}
                      {isValidityRenewal && (
                        <span className="ml-2 text-red-400">*</span>
                      )}
                    </label>
                    <Controller
                      name="renewalFrom"
                      control={control}
                      rules={{
                        required: isValidityRenewal && "This field is required",
                      }}
                      render={({ field }) => (
                        <DatePicker
                          className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                            view && "bg-gray-100"
                          }`}
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          placeholderText="Select renewal from date"
                          // required
                          disabled={view}
                          minDate={validityDateTo}
                          excludeDates={[validityDateTo]}
                          dateFormat="dd/MM/yyyy" // Set the date format
                        />
                      )}
                    />
                    {errors?.renewalFrom && (
                      <p className="text-red-500  mt-1">
                        {errors?.renewalFrom?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      To{" "}
                      {isValidityRenewal && (
                        <span className="ml-2 text-red-400">*</span>
                      )}
                    </label>
                    <Controller
                      name="renewalTo"
                      control={control}
                      rules={{
                        required: isValidityRenewal && "This field is required",
                      }}
                      render={({ field }) => (
                        <DatePicker
                          className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                            view && "bg-gray-100"
                          }`}
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          placeholderText="Select renewal to date"
                          // required
                          disabled={view}
                          minDate={renewalDateFrom}
                          excludeDates={[renewalDateFrom]}
                          dateFormat="dd/MM/yyyy" // Set the date format
                        />
                      )}
                    />
                    {errors?.renewalTo && (
                      <p className="text-red-500  mt-1">
                        {errors?.renewalTo?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="my-8" />

          {/* discount on Tariff */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Discount on Tariff</p>
            </div>
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 md:col-span-4">
                  <label
                    htmlFor="tariff"
                    className="inline-block text-gray-500 font-medium mb-2"
                  >
                    Tariff <span className="ml-1 text-red-400">*</span>
                  </label>

                  <Controller
                    name={`discountTariff`}
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={tariffList}
                        isClearable={true}
                        isDisabled={view}
                        classNamePrefix="react-select"
                        placeholder="Select tariff"
                      />
                    )}
                  />
                  {errors?.discountTariff && (
                    <p className="text-red-500  mt-1">
                      {errors?.discountTariff?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label
                    htmlFor="creditCompany"
                    className="inline-block text-gray-500 font-medium mb-2"
                  >
                    Transaction Year{" "}
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <select
                    className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                      view && "bg-gray-100"
                    }`}
                    {...register("discountTransactionYear", {
                      required: "This field is required",
                    })}
                    disabled={view}
                  >
                    <option value="">Select year</option>
                    {generateYearOptions()?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors?.discountTransactionYear && (
                    <p className="text-red-500  mt-1">
                      {errors?.discountTransactionYear?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-3 flex flex-col">
                  <label htmlFor="" className=" text-gray-500 font-medium mb-2">
                    OP {opWatch && <span className="ml-1 text-red-400">*</span>}
                  </label>
                  <div className="inline-flex items-center">
                    <input
                      type="number"
                      // defaultValue={opCoPayment && 0}
                      placeholder="Enter op percentage"
                      className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                        view && "bg-gray-100"
                      }`}
                      onInput={(e) => {
                        const value = e.target.value;
                        if (value < 0) {
                          e.target.value = 0;
                        } else if (value > 100) {
                          e.target.value = 100;
                        }
                      }}
                      {...register("opDiscount", {
                        required: opWatch && "This field is required",
                        max: {
                          value: 100,
                          message: "Value must be between 0 to 100",
                        },
                        min: {
                          value: 0,
                          message: "Value must be between 0 to 100",
                        },
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Only numeric values are allowed",
                        },
                      })}
                      disabled={view || !opWatch}
                    />
                    <span className="ml-2">%</span>
                  </div>
                  {errors?.opDiscount && (
                    <span className="text-red-500 mt-1">
                      {errors.opDiscount?.message}
                    </span>
                  )}
                </div>
                <div className="col-span-3 flex flex-col">
                  <label htmlFor="" className=" text-gray-500 font-medium mb-2">
                    IP {ipWatch && <span className="ml-1 text-red-400">*</span>}
                  </label>
                  <div className="inline-flex items-center">
                    <input
                      type="number"
                      // defaultValue={!ipCoPayment && 0}
                      placeholder="Enter ip percentage"
                      className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                        view && "bg-gray-100"
                      }`}
                      {...register("ipDiscount", {
                        required: ipWatch && "This field is required",
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Only numeric values are allowed",
                        },
                        max: {
                          value: 100,
                          message: "Value must be between 0 to 100",
                        },
                        min: {
                          value: 0,
                          message: "Value must be between 0 to 100",
                        },
                      })}
                      disabled={view || !ipWatch}
                    />
                    <span className="ml-2">%</span>
                  </div>
                  {errors?.ipDiscount && (
                    <span className="text-red-500 mt-1">
                      {errors?.ipDiscount?.message}
                    </span>
                  )}
                </div>
                <div className="col-span-3 flex flex-col">
                  <label htmlFor="" className=" text-gray-500 font-medium mb-2">
                    HC {hcWatch && <span className="ml-1 text-red-400">*</span>}
                  </label>
                  <div className="inline-flex items-center">
                    <input
                      type="number"
                      placeholder="Enter hc percentage"
                      className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                        view && "bg-gray-100"
                      }`}
                      {...register("hcDiscount", {
                        required: hcWatch && "This field is required",
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Only numeric values are allowed",
                        },
                        max: {
                          value: 100,
                          message: "Value must be between 0 to 100",
                        },
                        min: {
                          value: 0,
                          message: "Value must be between 0 to 100",
                        },
                      })}
                      disabled={view || !hcWatch}
                    />
                    <span className="ml-2">%</span>
                  </div>
                  {errors?.hcDiscount && (
                    <span className="text-red-500 mt-1">
                      {errors?.hcDiscount?.message}
                    </span>
                  )}
                </div>
                <div className="col-span-3 flex flex-col">
                  <label htmlFor="" className=" text-gray-500 font-medium mb-2">
                    Netralaya{" "}
                    {netralayaWatch && (
                      <span className="ml-1 text-red-400">*</span>
                    )}
                  </label>
                  <div className="inline-flex items-center">
                    <input
                      type="number"
                      // defaultValue={!netralayaCoPayment && 0}
                      placeholder="Enter netralaya percentage"
                      className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                        view && "bg-gray-100"
                      } `}
                      {...register("netralayaDiscount", {
                        required: netralayaWatch && "This field is required",
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Only numeric values are allowed",
                        },
                        max: {
                          value: 100,
                          message: "Value must be between 0 to 100",
                        },
                        min: {
                          value: 0,
                          message: "Value must be between 0 to 100",
                        },
                      })}
                      disabled={view || !netralayaWatch}
                    />
                    <span className="ml-2">%</span>
                  </div>
                  {errors?.netralayaDiscount && (
                    <span className="text-red-500 mt-1">
                      {errors?.netralayaDiscount?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="my-8" />

          {/* approval documents */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">
                Approval Documents <span className="text-danger">*</span>
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Controller
                name="approvalDocuments"
                control={control}
                // defaultValue={[]}
                rules={{ required: true }}
                render={({ field }) => (
                  <AsyncSelect
                    isMulti={true}
                    {...field}
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
                    isDisabled={view}
                    styles={customStyles}
                    isRequired={true}
                  />
                )}
              />
              {errors?.approvalDocuments && (
                <span className="text-red-500 mt-1">
                  This field is required
                </span>
              )}
            </div>
          </div>

          <hr className="my-8" />

          {/* upload MOU */}

          <UploadMediaCMS
            register={register}
            handleSubmit={handleSubmit}
            globalObjectId={globalObjectId}
            disabled={view}
            // errors={errors}
            name={`${view ? "View Attachment" : "Upload MOU"}`}
            mandate={false}
            // uploadFor={addendum ? "Addendum Document" : "MOU Document"}
            uploadFor={
              renewal
                ? "Aggregator Renewal Document"
                : "Aggregator Addendum Document"
            }
            id={addendumAggregatorId}
            aggregatorReference={aggregatorReference}
            aggregatorId={addendumAggregatorId}
            type="Aggregator"
            uuidVal={`aggregator_${index}`}
          />

          {/* <ViewAttachmentsCMS
            data={data}
            code={code}
            print={print}
            uploadedAttachments={uploadedAttachments}
            uploadedFiles={uploadedFiles}
            uploadedVideos={uploadedVideos}
          /> */}

          <hr className="my-8" />

          {/* patient deposit */}
          <div className="grid grid-cols-12 gap-5">
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
                      !view && "cursor-pointer"
                    } border-gray-400 w-5 h-5`}
                    value="yes"
                    name="patientDeposit"
                    {...register("patientDeposit", {
                      required: "This field is required",
                    })}
                    disabled={view}
                  />
                  <label htmlFor="patientDepositYes">Yes</label>

                  <input
                    type="radio"
                    id="patientDepositNo"
                    className={`${
                      !view && "cursor-pointer"
                    } border-gray-400 w-5 h-5`}
                    value="no"
                    name="patientDeposit"
                    {...register("patientDeposit")}
                    disabled={view}
                  />
                  <label htmlFor="patientDepositNo">No</label>
                </div>
              </div>
              <p className="text-red-500 mt-1">
                {errors?.patientDeposit && "This field is required"}
              </p>
            </div>

            {patientDeposit == "yes" ? (
              <div className="col-span-12 md:col-span-4">
                <input
                  type="number"
                  placeholder="In Rupees"
                  className={`${
                    view && "bg-gray-100"
                  } form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full`}
                  {...register("patientDepositInRupees", {
                    required:
                      patientDeposit == "yes" ? "This field is required" : "",
                    pattern: {
                      value: /^[0-9]*\.?[0-9]*$/,
                      message: "Please enter valid amount",
                    },
                  })}
                  disabled={view}
                />
                {errors?.patientDepositInRupees && (
                  <p className="text-red-500 ml-6 mt-1">
                    {errors?.patientDepositInRupees?.message}
                  </p>
                )}
              </div>
            ) : (
              ""
            )}
          </div>

          <hr className="my-8" />

          {/* Non Admissable Material */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <div className="flex items-center">
                <p className="text-xl font-semibold">
                  Non Admissable Material / Service{" "}
                  <span className="text-danger">*</span>
                </p>
                <div className="flex gap-4 items-center ml-8">
                  <input
                    type="radio"
                    id="nonAdmissableServiceYes"
                    className={`${
                      !view && "cursor-pointer"
                    } border-gray-400 w-5 h-5`}
                    value="yes"
                    disabled={view}
                    name="nonAdmissableService"
                    {...register("nonAdmissableService", {
                      required: "This field is required",
                    })}
                  />
                  <label htmlFor="nonAdmissableServiceYes">Yes</label>

                  <input
                    type="radio"
                    id="nonAdmissableServiceNo"
                    className={`${
                      !view && "cursor-pointer"
                    } border-gray-400 w-5 h-5`}
                    value="no"
                    disabled={view}
                    name="nonAdmissableService"
                    {...register("nonAdmissableService")}
                  />
                  <label htmlFor="nonAdmissableServiceNo">No</label>
                </div>
              </div>
              <p className="text-red-500   mt-1  ">
                {errors?.nonAdmissableService && "This field is required"}
              </p>
            </div>
          </div>

          {nonAdmissableService == "yes" && (
            <div className="grid grid-cols-12 gap-5 mt-6">
              <div className="col-span-12 md:col-span-6">
                <Controller
                  name="naMaterialService"
                  control={control}
                  // defaultValue={[]}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <AsyncSelect
                      isMulti={true}
                      {...field}
                      cacheOptions
                      loadOptions={fetchMaterialServices}
                      onChange={(approveDocument) => {
                        // setApproveDocument(approveDocument);
                        field.onChange(approveDocument);
                      }}
                      isClearable={true}
                      placeholder="Selecte material / service"
                      isDisabled={view}
                      styles={customStyles}
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

          <hr className="my-8" />

          {/* payment Terms */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">
                Payment Terms <span className="text-danger">*</span>
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <input
                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                    view && "bg-gray-100"
                  }`}
                  type="number"
                  {...register("paymentTerms", {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Please enter valid input",
                    },
                  })}
                  disabled={view}
                  placeholder="Enter payment terms"
                />
                <p className="md:ml-3 shrink-0">
                  <span className="text-lg font-medium">Days</span>
                  <span className="text-sm ml-2">
                    (From days of Bill Submission)
                  </span>
                </p>
              </div>
              {errors?.paymentTerms && (
                <p className="text-red-500    mt-1 ">
                  {errors?.paymentTerms?.message}
                </p>
              )}
            </div>
          </div>

          <hr className="my-8" />

          {/* Custodian Details */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Custodian Details</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 font-medium mb-2">
                Custodian Name <span class="ml-1 text-red-400">*</span>
              </label>
              <Controller
                name={`custodianName`}
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <AsyncSelect
                    {...field}
                    // cacheOptions
                    loadOptions={fetchEmpNameOptions}
                    // defaultValue={custodianNameOption}
                    // value={custodianNameOption}
                    onChange={(custodianNameOption) => {
                      setCustodianNameOption(custodianNameOption);
                      field.onChange(custodianNameOption);
                    }}
                    isDisabled={view}
                    isClearable={true}
                    placeholder="Select custodian"
                    styles={customStyles}
                    isRequired={true}
                  />
                )}
              />

              {errors?.custodianName && (
                <span className="text-red-500 mt-1">
                  This field is required
                </span>
              )}
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 font-medium mb-2">
                File Location <span class="ml-1 text-red-400">*</span>
              </label>
              <Controller
                name={`fileLocation`}
                control={control}
                defaultValue={[]}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={fileLocationList}
                    isDisabled={view}
                    isClearable={true}
                    classNamePrefix="react-select"
                    placeholder="Select file location"
                  />
                )}
              />
              {errors?.fileLocation && (
                <p className="text-red-500    mt-1 ">
                  {errors?.fileLocation?.message}
                </p>
              )}
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 font-medium mb-2">
                Add Details
              </label>
              <input
                type="text"
                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                  view && "bg-gray-100"
                }`}
                {...register("addDetails", {
                  // required: "This field is required",
                  maxLength: {
                    value: 100,
                    message: "Maximum length is 100 characters",
                  },
                  minLength: {
                    value: 2,
                    message: "Minimum length is 2 character",
                  },
                })}
                disabled={view}
                placeholder="Enter add details"
              />
              {errors?.addDetails && (
                <p className="text-red-500  mt-1 ">
                  {errors?.addDetails?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {!view && (
          <div className="form-actions">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-8 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {openPreviewName}
              {/* {renew
                ? "Renew"
                : edit && !addendum
                ? "Update"
                : addendum
                ? "Add addendum"
                : "Save"} */}
            </button>
            {/* <button
              type="button"
              onClick={() => {
                setApproveDocument(null);
                reset();
              }}
              className="py-2.5 px-8 me-2 ml-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              Reset
            </button> */}
            <button
              type="button"
              onClick={() => {
                // Navigate(-1);
                setOpenAddendumRenew(false);
              }}
              className="py-2.5 px-8 me-2  text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              Cancel
            </button>
          </div>
        )}

        {isOpen && (
          <LatestModalPopUp
            open={isOpen}
            title={`Are you sure you want to ${
              openPreviewName == "Add Renew" ? "Renew" : " Add Addendum"
            } for ${insurenceCompanyName}  Aggregartor with ${
              MOUDetails?.contractName
            } `}
            // title={`Are you sure do you want to ${
            //   edit
            //     ? "update"
            //     : addendum
            //     ? `add addendum for ${MOUDetails?.contractName}`
            //     : "create mou contract"
            // } ?`}
            setOpen={setIsOpen}
            description={`It will be sent for L1 approval`}
            icon={
              <ExclamationTriangleIcon
                className="h-20 w-20 text-red-600"
                aria-hidden="true"
              />
            }
            buttons={[
              <button
                type="button"
                className="py-2.5 px-4 text-md font-medium text-white focus:outline-none bg-blue-600 rounded border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:ring-0 w-[100px]"
                onClick={submitAggregator}
              >
                Yes
              </button>,
              <button
                type="button"
                className="py-2.5 px-4 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:ring-0 w-[100px]"
                onClick={() => setIsOpen(false)}
                data-autofocus
              >
                No
              </button>,
            ]}
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            title={
              openPreviewName == "Add Renew"
                ? `Renewal for ${insurenceCompanyName}  Aggregartor with ${MOUDetails?.contractName} created successfully`
                : `Addendum for ${insurenceCompanyName}  Aggregartor with ${MOUDetails?.contractName} created successfully`
            }
            showSuccessModal={showSuccessModal}
            setShowSuccessModal={(data) => {
              setShowSuccessModal(data);
              setApproveDocument(null);
              reset();
              Navigate("/mou-contract-list");
            }}
          />
        )}

        <ToastContainer />
      </form>

      {/* {MOUDetails?.terminationDetails && (
        <div>
          {MOUDetails?.terminationDetails?.map((item, index) => (
            <React.Fragment key={index}>
              <div className="bg-white shadow relative p-4 rounded mt-5">
                <div className="grid grid-cols-12 gap-x-8 gap-y-5">
                  <div className="col-span-12">
                    <div className="flex items-center justify-between">
                      <label className="inline-block text-xl font-semibold">
                        {item?.type} Notice
                      </label>
                      <label className="inline-block text-gray-500 font-medium mb-1 justify-end">
                        Approval Status -{" "}
                        <span className="font-semibold text-gray-800">
                          {item?.statusName == "Active"
                            ? "Approved"
                            : item?.statusName}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <UploadMediaCMS
                      register={register}
                      handleSubmit={handleSubmit}
                      globalObjectId={globalObjectId}
                      disabled={view}
                      errors={errors}
                      name={`${
                        view
                          ? `${
                              item?.type == "Terminated"
                                ? "Termination"
                                : item?.type == "Withdraw"
                                ? "Withdrawal"
                                : ""
                            } Notice`
                          : "Upload MOU"
                      }`}
                      mandate={true}
                      uploadFor={
                        item?.type == "Terminated"
                          ? "Termination Notice"
                          : item?.type == "Withdraw"
                          ? "Withdrawal Notice"
                          : ""
                      }
                      isVisible={false}
                    />
                  </div>
                  {item?.type != "Withdraw" ? (
                    <>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          className="inline-block text-gray-500 text-lg mb-1"
                        >
                          Start Date
                        </label>
                        <p className="text-lg font-medium">
                          {item?.startDate
                            ? convertFromUnix1(item?.startDate)
                            : ""}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label
                          htmlFor=""
                          className="inline-block text-gray-500 text-lg mb-1"
                        >
                          End Date
                        </label>
                        <p className="text-lg font-medium">
                          {item?.endsDate
                            ? convertFromUnix1(item?.endsDate)
                            : ""}
                        </p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div
                    className={`${
                      item?.type == "Withdraw" ? "col-span-8" : "col-span-12"
                    }`}
                  >
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-1"
                    >
                      Remark
                    </label>
                    <p className="text-lg font-medium">
                      {item?.remarks || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )} */}
    </>
  );
};

export default AddendumRenewalAggregator;
