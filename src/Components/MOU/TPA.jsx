import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast, ToastContainer } from "react-toastify";
import {
  createMouTpa,
  getMouById,
  updateMouTpa,
} from "../../Services/mouServices";
import SuccessModal from "../Common/ModalPopups/SuccessModal";
import {
  fetchCreditCompanies,
  fetchInsuranceCompanies,
  fetchTariffs,
  fetchFileLocations,
} from "../../Services/external";
import {
  convertFromUnix1,
  generateYearOptions,
  makeItProperObject,
  mapData,
  mouContractSegment,
  mouContractSegmentUnits,
} from "../../utils/other";
import LatestModalPopUp from "../Common/LatestModalPopUp";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  convertFromUnix,
  convertIntoUnix,
  fetchAddendumToTPACorporate,
  fetchApproveDocument,
  fetchEmpNameOptions,
  fetchMaterialServices,
  getUnitId,
} from "../../utils/functions";
import UploadMediaCMS from "../Common/UploadMediaCMS";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import MOUContext from "../../context/MOUContext";
import { BsChevronRight } from "react-icons/bs";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { TETooltip } from "tw-elements-react";
import PostTerminationNotice from "./PostTerminationNotice";

const initial = {
  creditCompany: null,
  insuranceCompany: null,
  op: null,
  ip: null,
  hc: null,
  netralaya: null,
  coPaymentInPercent: null,
  opCoPayment: null,
  opCoPaymentEmployee: null,
  opCoPaymentDependant: null,
  hcCoPayment: null,
  hcCoPaymentEmployee: null,
  hcCoPaymentDependant: null,
  ipCoPayment: null,
  ipCoPaymentEmployee: null,
  ipCoPaymentDependant: null,
  netralayaCoPayment: null,
  netralayaCoPaymentEmployee: null,
  netralayaCoPaymentDependant: null,
  isValidityRenewal: null,
  validityDateFrom: null,
  validityDateTo: null,
  renewalFrom: null,
  renewalTo: null,
  discountTariff: null,
  discountTransactionYear: null,
  opDiscount: null,
  ipDiscount: null,
  hcDiscount: null,
  netralayaDiscount: null,
  approvalDocuments: null,
  patientDeposit: null,
  patientDepositInRupees: null,
  nonAdmissableService: null,
  naMaterialService: null,
  paymentTerms: null,
  custodianName: null,
  fileLocation: null,
  addDetails: null,
};
const TPA = ({
  contractType,
  globalObjectIdVal,
  view = false,
  renewal,
  renewalSuccess,
  setRenewalId,
}) => {
  const Navigate = useNavigate();
  const { mouId } = useParams();
  const location = useLocation();
  const { addendum, renew} = location.state || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const edit = searchParams.get("edit");
  const unitId = getUnitId();
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
  } = useForm({ defaultValues: view || edit ? MOUDetails : {} });

  const coPaymentPercent = watch("coPaymentInPercent");
  const opCoPayment = watch("opCoPayment");
  const hcCoPayment = watch("hcCoPayment");
  const ipCoPayment = watch("ipCoPayment");
  const netralayaCoPayment = watch("netralayaCoPayment");
  const validityDateFrom = watch("validityDateFrom");
  const isValidityRenewal = watch("isValidityRenewal");
  const patientDeposit = watch("patientDeposit");

  const nonAdmissableService = watch("nonAdmissableService");
  const validityDateTo = watch("validityDateTo");
  const addendumTo = watch("addendumTo");
  const addDetails = watch("addDetails");

  const renewalDateFrom = watch("renewalFrom");
  
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
  const [showEditTermination, setShowEditTermination] = useState(false);
  const [terminationNotice, setTerminationNotice] = useState(false);

  const [id, setId] = useState(null);
  const opWatch = watch("op");
  const ipWatch = watch(`ip`);
  const hcWatch = watch(`hc`);
  const netralayaWatch = watch(`netralaya`);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    if (opWatch == true) {
      setValue(`opCoPayment`, true);
      // setValue(`opDiscount`, true);
    }
    if (opWatch == false) {
      setValue(`opCoPayment`, false);
      setValue(`opDiscount`, null);
    }
    if (ipWatch == true) {
      setValue(`ipCoPayment`, true);
      // setValue(`ipDiscount`, true);
    }
    if (ipWatch == false) {
      setValue(`ipCoPayment`, false);
      setValue(`ipDiscount`, null);
    }
    if (hcWatch == true) {
      setValue(`hcCoPayment`, true);
      // setValue(`hcDiscount`, true);
    }
    if (hcWatch == false) {
      setValue(`hcCoPayment`, false);
      setValue(`hcDiscount`, null);
    }
    if (netralayaWatch == true) {
      setValue(`netralayaCoPayment`, true);
      // setValue(`netralayaDiscount`, true);
    }
    if (netralayaWatch == false) {
      setValue(`netralayaCoPayment`, false);
      setValue(`netralayaDiscount`, null);
    }
  }, [opWatch, ipWatch, hcWatch, netralayaWatch, setValue]);


  const fetchData = async () => {
    try {
      const [creditResponse, insuranceResponse, fileResponse, tariffResponse] = await Promise.all([
        fetchCreditCompanies(),
        fetchInsuranceCompanies(),
        fetchFileLocations(),
        fetchTariffs()
      ]);

      const creditData = creditResponse?.success || [];
      const insuranceData = insuranceResponse?.success || [];
      const fileData = fileResponse?.success || [];
      const tariffData = tariffResponse?.success || [];
      setCreditCompanies(mapData(creditData, "creditcompany"));
      setInsuranceCompanies(mapData(insuranceData, "insurancecompany"));
      setFileLocationList(mapData(fileData, "filelocation"));
      setTariffList(mapData(tariffData, "tarifflist"));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
   
    fetchData();
  }, []);

  useEffect(() => {
    if (renewal) {
      const data = getValues();
      submitTPA(data);
    }
  }, [renewal]);

  useEffect(() => {
    if (addendumTo?.value) {
      getMouDetails(addendumTo?.value);
    } else {
      getMouDetails();
      // setGlobalObjectId(0);
    }
  }, [addendumTo]);

  const getMouDetails = async (id) => {
    try {
      const mouDetail = await getMouById({ id: id });
      if (mouDetail?.success) {
        const response = mouDetail?.data?.length ? mouDetail?.data[0] : {};
        // const data = response?.terminationDetails
        if (response?.categoryTypeName == "TPA") {
          const defaultValue = makeItProperObject(response, 1);
          setGlobalObjectId(response?.globalObjectId);
          setId(response?.contractId);
          setMOUDetails(defaultValue);
          reset(defaultValue);
        }

        if (response?.categoryTypeName == "Corporate") {
          const defaultValue = makeItProperObject(response, 2);
          setGlobalObjectId(response?.globalObjectId);
          setMOUDetails(defaultValue);
          reset(defaultValue);
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
  const submitTPA = (renewalData) => {
    const data = renewal ? renewalData : dataToSave;
    let payload = {
      // ...MOUDetails,
      contractName: edit ? MOUDetails?.contractName : null,
      mouContractId:
        edit && !addendum && !renew ? MOUDetails?.mouContractId : 0,
      globalObjectId: edit && addendum ? MOUDetails?.globalObjectId : null,
      //...MOUDetails,
      categoryTypeEnum: contractType == 1 ? 1 : contractType == 2 ? 2 : "",
      categoryTypeName:
        contractType == 1 ? "TPA" : contractType == 2 ? "Corporate" : "",
      unitId: data?.unitId || unitId,
      creditCompanyId: data?.creditCompany?.value,
      creditCompany:
        data?.creditCompany?.valueToUse ?? data?.creditCompany?.label,
      insuranceCompanyId: data?.insuranceCompany?.value,
      insuranceCompany:
        data?.insuranceCompany?.valueToUse ?? data?.creditCompany?.label,
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
        return { ...item, value: "" + item?.value, aggregatorNumber: 0 };
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
      contractStatusType:
        data?.contractStatusType === "Renewal"
          ? 2
          : data?.contractStatusType === "Addendum"
          ? 3
          : 1,
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
        aggregatorNumber: 0,
        dotTariffId: data?.discountTariff?.value,
        dotTariffName: data?.discountTariff?.label,
        dotTransactionYear: data?.discountTransactionYear,
        dotop: data?.opDiscount || 0,
        dotip: data?.ipDiscount || 0,
        dothc: data?.hcDiscount || 0,
        dotNetralaya: data?.netralayaDiscount || 0,

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

    if (renew || addendum) {
      payload = {
        ...payload,
        // status: addendum ? 3 : 2,
        contractStatusType: addendum ? 3 : 2,
        mouReference: MOUDetails?.mouContractId
          ? "" + MOUDetails?.mouContractId
          : "",
        previousMouNumber: MOUDetails?.mouId,
      };
    }

    const createTPA = async () => {
      setGlobalObjectId();
      try {
        let tpaData = null;
        if (renew) {
          tpaData = await createMouTpa({ data: payload });
        } else if (edit && !addendum) {
          tpaData = await updateMouTpa({ data: payload });
        } else {
          tpaData = await createMouTpa({ data: payload });
          setIsEdit(true);
        }
        if (tpaData?.success) {
          setGlobalObjectId(tpaData?.data?.globalObjectId);
          if (renewal) {
            setRenewalId(tpaData?.data?.contractId);
            setId(tpaData?.data?.contractId);
            renewalSuccess();
          } else {
            setId(tpaData?.data?.contractId);
            setShowSuccessModal(true);
          }
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
    createTPA();
  };
  const onSubmit = (data) => {
    // const updatedData = {
    //   ...data,
    //   creditCompany: creditCompanies.filter(
    //     (item) => item?.value === data?.creditCompany?.value
    //   )[0],
    //   insuranceCompany: insuranceCompanies.filter(
    //     (item) => item?.value === data?.creditCompany?.value
    //   )[0],
    // };
    setIsOpen(true);
    setDataToSave(data);
  };
  const convertDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  useEffect(() => {
    if (MOUDetails) {
      let result = MOUDetails?.terminationDetails;
      if (Array.isArray(result)) {
        const firstObject = result[0];
        const firstApprovalLog =
          firstObject?.terminationApprovalLogs &&
          firstObject?.terminationApprovalLogs[0];
        const currentLevelStatus =
          firstApprovalLog &&
          firstApprovalLog?.level == 2 &&
          firstApprovalLog?.statusName == "Pending";
        if (currentLevelStatus) {
          setShowEditTermination(true);
        }
      }
    }
  }, [MOUDetails]);

  return (
    <>
      {view ? (
        <div className="bg-white shadow relative p-4 rounded-b mb-3 flex flex-col gap-y-8">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Credit Company
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.creditCompany?.label || "--"}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Insurance Company
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.insuranceCompany?.label || "--"}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5 ">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Contract Segment</p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                OP
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.op ? "Yes" : MOUDetails?.op == false ? "No" : "-"}
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                IP
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.ip ? "Yes" : MOUDetails?.ip == false ? "No" : "-"}
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Hc
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.hc ? "Yes" : MOUDetails?.hc == false ? "No" : "-"}
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Netralaya
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.netralaya
                  ? "Yes"
                  : MOUDetails?.netralaya == false
                  ? "No"
                  : "-"}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5 ">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Co-Payment</p>
            </div>
            <div className="col-span-12">
              <label for="" class="inline-block text-gray-500 text-lg mb-2">
                Co-Payment in %
              </label>
              <p className="text-lg font-medium flex justify-between gap-2">
                {MOUDetails?.coPaymentInPercent
                  ? MOUDetails?.coPaymentInPercent?.charAt(0).toUpperCase() +
                    MOUDetails?.coPaymentInPercent.slice(1)
                  : ""}
              </p>
            </div>
            <div className="col-span-8">
              {/* <p className="text-lg font-medium flex justify-between gap-2 w-full"> */}
              {MOUDetails?.coPaymentInPercent && (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="font-medium">Employee</th>
                      <th className="font-medium">Dependant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2">OP </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.opCoPaymentEmployee || "--"}{" "}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.opCoPaymentDependant || "--"}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">IP </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.ipCoPaymentEmployee || "--"}{" "}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.ipCoPaymentDependant || "--"}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">HC </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.hcCoPaymentEmployee || "--"}{" "}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.hcCoPaymentDependant || "--"}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Netralaya </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.netralayaCoPaymentEmployee || "--"}{" "}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {MOUDetails?.netralayaCoPaymentDependant || "--"}{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
              {/* </p> */}
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5 ">
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <p className="text-xl font-semibold">Validity</p>
              <div className="grid grid-cols-12 gap-x-8 mt-4">
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    From
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.validityDateFrom
                      ? convertDate(MOUDetails?.validityDateFrom)
                      : "--"}
                  </p>
                </div>
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    To
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.validityDateTo
                      ? convertDate(MOUDetails?.validityDateTo)
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <p className="text-xl font-semibold">Renewal Date</p>
              <div className="grid grid-cols-12 gap-x-8 mt-4">
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    From
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.renewalFrom
                      ? convertDate(MOUDetails?.renewalFrom)
                      : "--"}
                  </p>
                </div>
                <div className="col-span-6">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    To
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.renewalTo
                      ? convertDate(MOUDetails?.renewalTo)
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Discount on Tariff</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Tariff
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.discountTariff?.label}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Transaction Year
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.discountTransactionYear}
              </p>
            </div>
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    OP
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.opDiscount || "0"}{" "}
                    {MOUDetails?.opDiscount ? "%" : ""}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    IP
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.ipDiscount || "0"}{" "}
                    {MOUDetails?.ipDiscount ? "%" : ""}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    HC
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.hcDiscount || "0"}{" "}
                    {MOUDetails?.hcDiscount ? "%" : ""}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label for="" class="inline-block text-gray-500 text-lg mb-1">
                    Netralaya
                  </label>
                  <p className="text-lg font-medium">
                    {MOUDetails?.netralayaDiscount || "0"}{" "}
                    {MOUDetails?.netralayaDiscount ? "%" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Approval Documents</p>
            </div>
            <div className="col-span-12">
              <label for="" class="inline-block text-gray-500 text-lg mb-1">
                Documents
              </label>
              <ul className="grid grid-cols-12">
                {MOUDetails?.approvalDocuments?.map((item) => (
                  <li className="col-span-12 md:col-span-2 text-lg inline-flex items-center font-medium gap-2">
                    <BsChevronRight /> <span>{item?.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Attachments</p>
            </div>
            <div className="col-span-6">
              <UploadMediaCMS
                register={register}
                handleSubmit={handleSubmit}
                globalObjectId={
                  addendum ? MOUDetails?.globalObjectId : globalObjectId
                }
                disabled={view}
                errors={errors}
                name={`${view ? "View Attachment" : "Upload MOU"}`}
                mandate={true}
                uploadFor={
                  addendum || MOUDetails?.contractStatusTypeName === "Addendum"
                    ? "Addendum Document"
                    : renew || MOUDetails?.contractStatusTypeName === "Renewal"
                    ? "Renewal Document"
                    : "MOU Document"
                }
                id={id}
                type={"MOU"}
              />
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Patient Deposit
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.patientDeposit == "yes"
                  ? "Yes"
                  : MOUDetails?.patientDeposit == "no"
                  ? "No"
                  : ""}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Patient Deposit In Rupees
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.patientDepositInRupees || "-"}{" "}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-y-5 gap-x-8">
            <div className="col-span-12">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Non Admissable Material / Service
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.nonAdmissableService == "yes"
                  ? "Yes"
                  : MOUDetails?.nonAdmissableService == "no"
                  ? "No"
                  : ""}
              </p>
              {MOUDetails?.nonAdmissableService == "yes" ? (
                <ul className="grid grid-cols-12 mt-3">
                  <li className="col-span-12 md:col-span-3 text-lg inline-flex items-center font-medium gap-2">
                    <BsChevronRight />{" "}
                    <span>
                      {MOUDetails?.naMaterialService
                        ?.map((item) => item.label)
                        .join(", ")}
                    </span>
                  </li>
                </ul>
              ) : (
                ""
              )}
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Payment Terms
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.paymentTerms} Days
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <p className="text-xl font-semibold">Physical Document Details</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Employee Name
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.custodianName?.label}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                File Location
              </label>
              <p className="text-lg font-medium">
                {MOUDetails?.fileLocation?.label}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label htmlFor="" class="inline-block text-gray-500 text-lg mb-1">
                Add Details
              </label>
              <p className="text-lg font-medium">{MOUDetails?.addDetails}</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
          <div className="bg-white shadow relative p-4 rounded-b mb-5">
            {addendum && !edit ? (
              <>
                <div className="grid grid-cols-12 mb-4">
                  <div className="col-span-8">
                    <label
                      htmlFor="addendumTo"
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      MOU Id
                    </label>
                    <p className="text-lg font-medium">
                      {MOUDetails?.mouId || "--"}
                    </p>
                  </div>
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
                          loadOptions={fetchAddendumToTPACorporate}
                          // defaultValue={approveDocument}
                          // value={approveDocument}
                          onChange={(approveDocument) => {
                            // setApproveDocument(approveDocument);
                            if (approveDocument) {
                              field.onChange(approveDocument);
                            } else {
                              reset(initial);
                              setMOUDetails({});
                              setGlobalObjectId(0);
                            }
                          }}
                          isClearable={true}
                          placeholder="MOU ID"
                          isDisabled={view}
                          styles={customStyles}
                          // isRequired={true}
                        />
                      )}
                    />
                    <span className="text-red-500 mt-1 text-[11px]">
                      From here you can add addendum only for TPA and Corporate
                      MOUs.
                    </span>
                  </div>
                </div>
                <hr className="my-8" />
              </>
            ) : (
              ""
            )}

            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
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
                      noOptionsMessage={() => "No matching records"}
                      options={creditCompanies}
                      isClearable={true}
                      isDisabled={
                        view ||
                        renew ||
                        addendum ||
                        MOUDetails?.contractStatusTypeName === "Renewal" ||
                        MOUDetails?.contractStatusTypeName === "Addendum" ||
                        MOUDetails?.contractStatusType === "Addendum" ||
                        MOUDetails?.contractStatusType === "Renewal" ||
                        MOUDetails?.contractStatusType === 2 ||
                        MOUDetails?.contractStatusType === 3
                      }
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
              </div>
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
                      noOptionsMessage={() => "No matching records"}
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
                <p className="text-red-500  col-span-12">
                  {errors?.op?.message}
                </p>
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
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                      min: {
                                        value: 0,
                                        message:
                                          "Value must be between 0 to 100",
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
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                      min: {
                                        value: 0,
                                        message:
                                          "Value must be between 0 to 100",
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
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                      min: {
                                        value: 0,
                                        message:
                                          "Value must be between 0 to 100",
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
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                      min: {
                                        value: 0,
                                        message:
                                          "Value must be between 0 to 100",
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
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                      min: {
                                        value: 0,
                                        message:
                                          "Value must be between 0 to 100",
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
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                      min: {
                                        value: 0,
                                        message:
                                          "Value must be between 0 to 100",
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
                            <label htmlFor="netralayaCoPayment">
                              Netralaya
                            </label>
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
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                      min: {
                                        value: 0,
                                        message:
                                          "Value must be between 0 to 100",
                                      },
                                    })}
                                  />
                                  <p className="text-red-500 absolute mt-1 top-full   ">
                                    {errors?.netralayaCoPaymentEmployee &&
                                      errors?.netralayaCoPaymentEmployee
                                        ?.message}
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
                                    {...register(
                                      "netralayaCoPaymentDependant",
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
                                            "Value must be between 0 to 100",
                                        },
                                        min: {
                                          value: 0,
                                          message:
                                            "Value must be between 0 to 100",
                                        },
                                      }
                                    )}
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
                          minDate={getValues("minValidityDate")}
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            setValue("validityDateTo", null);
                          }}
                          placeholderText="Select from date"
                          // required
                          disabled={view}
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
                          onChange={(date) => {
                            field.onChange(date);
                            setValue("renewalFrom", null);
                          }}
                          placeholderText="Select to date"
                          // required
                          disabled={view}
                          minDate={validityDateFrom}
                          excludeDates={
                            validityDateFrom ? [validityDateFrom] : ""
                          }
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
                          required:
                            isValidityRenewal && "This field is required",
                        }}
                        render={({ field }) => (
                          <DatePicker
                            className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                              view && "bg-gray-100"
                            }`}
                            selected={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                              setValue("renewalTo", null);
                            }}
                            placeholderText="Select renewal from date"
                            // required
                            disabled={view}
                            minDate={validityDateTo}
                            excludeDates={
                              validityDateTo ? [validityDateTo] : ""
                            }
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
                          required:
                            isValidityRenewal && "This field is required",
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
                            excludeDates={
                              renewalDateFrom ? [renewalDateFrom] : ""
                            }
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
                  <div className="col-span-6 md:col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      OP{" "}
                      {opWatch && <span className="ml-1 text-red-400">*</span>}
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
                  <div className="col-span-6 md:col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      IP{" "}
                      {ipWatch && <span className="ml-1 text-red-400">*</span>}
                    </label>
                    <div className="inline-flex items-center">
                      <input
                        type="number"
                        // defaultValue={!ipCoPayment && 0}
                        placeholder="Enter ip percentage"
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
                  <div className="col-span-6 md:col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
                      HC{" "}
                      {hcWatch && <span className="ml-1 text-red-400">*</span>}
                    </label>
                    <div className="inline-flex items-center">
                      <input
                        type="number"
                        placeholder="Enter hc percentage"
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
                  <div className="col-span-6 md:col-span-2">
                    <label
                      htmlFor=""
                      className="inline-block text-gray-500 font-medium mb-2"
                    >
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
                        onInput={(e) => {
                          const value = e.target.value;
                          if (value < 0) {
                            e.target.value = 0;
                          } else if (value > 100) {
                            e.target.value = 100;
                          }
                        }}
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
              globalObjectId={
                addendum ? MOUDetails?.globalObjectId : globalObjectId
              }
              disabled={view}
              errors={errors}
              name={`${view ? "View Attachment" : "Upload MOU"}`}
              mandate={true}
              uploadFor={
                addendum || MOUDetails?.contractStatusType === "Addendum"
                  ? "Addendum Document"
                  : renew || MOUDetails?.contractStatusType === "Renewal"
                  ? "Renewal Document"
                  : "MOU Document"
              }
              id={id}
              type={"MOU"}
              isAddendum={addendum}
              isRenew={renew}
              isEdit={isEdit}
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
                <label
                  for=""
                  class="inline-block text-gray-500 font-medium mb-2"
                >
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
                <label
                  for=""
                  class="inline-block text-gray-500 font-medium mb-2"
                >
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
                <label
                  for=""
                  class="inline-block text-gray-500 font-medium mb-2"
                >
                  Add Details
                </label>
                <input
                  type="text"
                  name="addDetails"
                  maxLength={150}
                  minLength={2}
                  className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                    view && "bg-gray-100"
                  }`}
                  {...register("addDetails", {
                    // required: "This field is required",
                    maxLength: {
                      value: 150,
                      message: "Maximum length is 150 characters",
                    },
                    minLength: {
                      value: 2,
                      message: "Minimum length is 2 character",
                    },
                  })}
                  disabled={view}
                  placeholder="Enter add details"
                />
                <span className="inline-block text-right w-full text-gray-500 mb-2">
                  {`${addDetails ? addDetails?.length : 0} of 150 Characters`}
                </span>
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
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-8 mr-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {renew
                  ? "Renew"
                  : edit && !addendum
                  ? "Update"
                  : addendum
                  ? "Add addendum"
                  : "Save"}
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
                  if (view || edit) {
                    Navigate(-1);
                  } else {
                    Navigate("/mou-contract-list");
                  }
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
                edit
                  ? `${
                      renew ? "renew" : addendum ? "add addendum" : "update"
                    } for ${MOUDetails?.creditCompany?.label}`
                  : addendum
                  ? `add addendum for ${MOUDetails?.contractName}`
                  : `create mou contract for ${dataToSave?.creditCompany?.label}`
              } ?`}
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
                  onClick={submitTPA}
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
              title={`${
                renew ? "Renewal" : addendum ? "Addendum" : "MOU Contract"
              } ${
                (edit && !addendum) || renew
                  ? "updated"
                  : addendum
                  ? "added"
                  : "created"
              } successfully ${
                addendum ? `for ${MOUDetails?.contractName}` : ""
              } `}
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
      )}
      {MOUDetails?.terminationDetails && (
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
                      {showEditTermination && (
                        // <label
                        //   htmlFor=""
                        //   onClick={() => setTerminationNotice(true)}
                        // >
                        //   <GrEdit className="cursor-pointer" />
                        // </label>
                        <TETooltip title={"Edit termination"}>
                          <FiEdit
                            className="text-xl"
                            onClick={() => setTerminationNotice({status:true,dateFrom:convertFromUnix(item?.startDate),dateTo:convertFromUnix(item?.endsDate),index:index})}
                          />
                        </TETooltip>
                      )}
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
                      id={id}
                      type={item?.type}
                      requestTypeId={item?.tRequestId?.slice(1)}
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
      )}

      {terminationNotice?.status && (
        <PostTerminationNotice
          globalObjectId={MOUDetails.globalObjectId}
          mouId={mouId}
          dateFrom={(terminationNotice?.dateFrom && convertIntoUnix(terminationNotice?.dateFrom)) || (MOUDetails.validityDateFrom && convertIntoUnix(MOUDetails.validityDateFrom))}
          dateTo={(terminationNotice?.dateTo && convertIntoUnix(terminationNotice?.dateTo)) || (MOUDetails.validityDateTo && convertIntoUnix(MOUDetails.validityDateTo))}
          mouContractOrContractDetails={MOUDetails}
          mouDisplayName={MOUDetails.contractName}
          open={terminationNotice?.status}
          terminationIndex={terminationNotice?.index}
          setOpen={()=>setTerminationNotice({status:false,dateFrom:null,dateTo:null,index:null})}
          editTermination={true}
          updateName="TPA"
          mou={true}
        />
      )}
    </>
  );
};

export default TPA;
