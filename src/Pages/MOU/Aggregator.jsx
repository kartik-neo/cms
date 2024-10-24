import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  BsArrowClockwise,
  BsChevronDown,
  BsChevronUp,
  BsPlusCircle,
  BsPrinter,
  BsTrash,
  BsXCircle,
} from "react-icons/bs";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  addAggregator,
  deleteAggregator,
  updateAggregator,
} from "../../Services/aggregatorService";
import AlertModal from "../../Components/Common/ModalPopups/AlertModal";
import LatestModalPopUp from "../../Components/Common/LatestModalPopUp";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import AsyncSelect from "react-select/async";
import {

  fetchInsuranceCompanies,
  fetchFileLocations,
  fetchTariffs,
  fetchAggregatorCreditCompanies,
} from "../../Services/external";
import {
  generateYearOptions,
  mapData,
  mouContractSegment,
  mouContractSegmentUnits,
} from "../../utils/other";
import {
  convertIntoUnix,
  fetchApproveDocument,
  fetchEmpNameOptions,
  fetchMaterialServices,
  getUnitId,
} from "../../utils/functions";
import SuccessModal from "../../Components/Common/ModalPopups/SuccessModal";
import PostTerminationNotice from "../../Components/MOU/PostTerminationNotice";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import UploadMediaCMS from "../../Components/Common/UploadMediaCMS";
import MOUContext from "../../context/MOUContext";
import {
  fetchMOUList,
} from "../../Services/mouServices";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const Aggregator = ({
  contractType,
  type,
  view = false,
  defaultData,
  globalObjectIdVal,
  aggregatorIdVal,
  creditCompanyProp,
  renewalSuccess,
  setRenewalId,
}) => {
  // const location = useLocation();
  // const { edit } = location.state || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const edit = searchParams.get("edit");
  const { mouId } = useParams();
  const location = useLocation();
  const { editAggregator } =
    location.state || {};
  const [creditCompany, setCreditCompany] = useState(creditCompanyProp ?? {});
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payloadToSubmit, setPayloadToSubmit] = useState();
  const unitId = getUnitId();
  const Navigate = useNavigate();
  const { MOUDetails } = useContext(MOUContext);
  const [renewal, setRenewal] = useState({
    status: false,
    index: 0,
    mouReference: "",
    previousMouNumber: "",
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
    setFocus,
  } = useForm({
    defaultValues: {
      aggregator:
        edit && MOUDetails && MOUDetails.aggregators
          ? MOUDetails?.aggregators
          : [],
      // aggregator: view || addendum ? MOUDetails?.aggregators : [initial],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "aggregator",
  });
  const [creditCompanies, setCreditCompanies] = useState(null);
  const [insuranceCompanies, setInsuranceCompanies] = useState(null);
  const [tariffList, setTariffList] = useState(null);
  const [fileLocationList, setFileLocationList] = useState(null);
  const [aggregatorIds, setAggregatorIds] = useState(aggregatorIdVal ?? []);
  const [globalObjectIds, setGlobalObjectIds] = useState(
    globalObjectIdVal ?? null
  );

  const [confirm, setConfirm] = useState(false);
  const [IsRedirecting, setIsRedirecting] = useState({
    isOpen: false,
    isAdded: false,
  });

  const documents = [
    { value: "document1", label: "Document 1" },
    { value: "document2", label: "Document 2" },
    { value: "document3", label: "Document 3" },
    // Add more document options here
  ];

  // const fetchCreditCompany = async () => {
  //   try {
  //     let status = ["Active", "Pending Approval"];
  //     const response = await fetchAggregatorCreditCompanies({ status });

  //     const data = response?.success;

  //     const result = data?.map((item) => ({
  //       value: item?.code,
  //       label: `${item.code} - ${item.name}`,
  //       valueToUse: `${item.name}`,
  //     }));

  //     setCreditCompanies(result);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return [];
  //   }
  // };
  // const fetchInsuranceCompany = async () => {
  //   try {
  //     const response = await fetchInsuranceCompanies();

  //     const data = response?.success;

  //     const result = data?.map((item) => ({
  //       value: item?.code,
  //       label: `${item.name}`,
  //     }));

  //     setInsuranceCompanies(result);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return [];
  //   }
  // };

  // const fetchFileLocation = async () => {
  //   try {
  //     const response = await fetchFileLocations();

  //     const data = response?.success;

  //     const result = data.map((item) => ({
  //       value: item?.locationID,
  //       label: `${item.locationName}`,
  //     }));

  //     setFileLocationList(result);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return [];
  //   }
  // };

  // const fetchTariffList = async () => {
  //   try {
  //     const response = await fetchTariffs();

  //     const data = response?.success;

  //     const result = data?.map((item) => ({
  //       value: item?.code,
  //       label: `${item.name}`,
  //     }));

  //     setTariffList(result);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return [];
  //   }
  // };

  const fetchData = async () => {
    try {
      const [creditResponse, insuranceResponse, fileResponse, tariffResponse] = await Promise.all([
        fetchAggregatorCreditCompanies({ status: ["Active", "Pending Approval"] }),
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
    // fetchCreditCompany();
    // fetchInsuranceCompany();
    // fetchFileLocation();
    // fetchTariffList();
      fetchData();
  }, []);


  useEffect(() => {
    if (renewal?.status) {
      const data = getValues();
      submitAgreegatorDetails(data);
    }
  }, [renewal?.status]);

  const getMouDetails = async (creditCompany) => {
    let status = ["Active", "Pending Approval"];
    const unitId = getUnitId();
    try {
      const mouList = await fetchMOUList(
        `status=${status.join(",")}&locationId=${unitId}&categoryType=Aggregator&creditCompanyId=${creditCompany?.value}`
      );
     
      if (mouList?.success && mouList?.data?.length) {
        setIsRedirecting({
          isOpen: true,
          isAdded: true,
        });
        setTimeout(() => {
          Navigate(`/edit-mou-contract/${mouList?.data[0]?.id}?edit=true`, {
            state: { disableAggregator: true },
          });
        }, 5000);
      } else {
        setIsRedirecting({
          isOpen: true,
          isAdded: false,
        });
      }
    } catch (error) {
      toast.error(
        error.message ??
          "Error while fetching mou contract details with credit company",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  const submitAgreegatorDetails = async (renewalData) => {
  
    const filteredAggregator = payloadToSubmit?.aggregator?.filter(
      (item) =>
        !item?.statusName ||
        (item?.statusName && item?.statusName == "Pending Approval")
    );

    const payload = renewal?.status
      ? renewalData
      : { ...payloadToSubmit, aggregator: filteredAggregator };

    const payloadToAdd = payload?.aggregator?.map((data, index) => {
      let dataToAdd = {
        aggregatorId: data?.aggregatorId,
        globalObjectId: edit || renewal?.status ? data?.globalObjectId : null,
        // aggregatorNumber: index + 1,
        insuranceCompanyId: data?.insuranceCompany?.value,
        insuranceCompany: data?.insuranceCompany?.label,
        contractSegment: mouContractSegmentUnits(
          data?.op,
          data?.ip,
          data?.hc,
          data?.netralaya
        ),
        isCoPayment:
          data.coPaymentInPercent === "yes"
            ? true
            : data.coPaymentInPercent === "no"
            ? false
            : "",
        validityDateFrom: data?.validityDateFrom
          ? convertIntoUnix(data?.validityDateFrom)
          : "",
        validityDateTo: data?.validityDateTo
          ? convertIntoUnix(data?.validityDateTo)
          : "",
        isValidityRenewal: data?.renewal,
        renewalDateFrom: data?.renewalFrom
          ? convertIntoUnix(data?.renewalFrom)
          : "",
        renewalDateTo: data?.renewalTo ? convertIntoUnix(data?.renewalTo) : "",
        approvalDocument: data?.approvalDocuments?.map((item) => {
          return {
            ...item,
            value: "" + item?.value,
            aggregatorId: data?.aggregatorId || 0,
          };
        }),
        isNAMaterialService:
          data.nonAdmissableService === "yes"
            ? true
            : data.nonAdmissableService === "no"
            ? false
            : "",
        materialService:
          data.nonAdmissableService === "yes" || data?.naMaterialService?.length
            ? data?.naMaterialService?.map((item) => {
                return {
                  ...item,
                  value: item?.value,
                  aggregatorId: data?.aggregatorId || 0,
                };
              })
            : null,

        isPatientDeposit:
          data?.patientDeposit == "yes"
            ? true
            : data?.patientDeposit == "no"
            ? false
            : "",
        patientDepositAmount:
          data?.patientDeposit == "yes" ? data?.patientDepositInRupees : null,
        paymentTermsDays: data.paymentTerms,
        status: 1,
        contractStatusType:data?.contractStatusTypeName === "Renewal"
        ? 2
        : data?.contractStatusTypeName === "Addendum"
        ? 3
        : 1,
        mouContractSegmentDetails:
          data.coPaymentInPercent === "yes"
            ? mouContractSegment(
                data?.ipCoPayment,
                data?.opCoPayment,
                data?.hcCoPayment,
                data?.netralayaCoPayment,
                data,
                index,
                true
              )
            : null,

        contractDiscountOnTariff: {
          aggregatorId: data?.aggregatorId || 0,
          dotTariffId: data?.discountTariff?.value,
          dotTariffName: data?.discountTariff?.label,
          // dotTransactionYear: data?.discountTransactionYear,
          dotTransactionYear: data?.discountTransactionYear.value
            ? data?.discountTransactionYear.value
            : data?.discountTransactionYear,
          dotop: data?.opDiscount || 0,
          dotip: data?.ipDiscount || 0,
          dothc: data?.hcDiscount || 0,
          dotNetralaya: data?.netralayaDiscount || 0,
        },
        contractCustodianDetails: {
          aggregatorId: data?.aggregatorId || 0,
          custodianName: data?.custodianName.label,
          custodianFileLocation: data?.fileLocation?.label,
          custodianDetails: data?.addDetails,
          custodianEmpCode: data?.custodianName?.value,
          // CustodianFileName: "File 1",
          // CustodianFilePath: "C-Folder",
        },
        // insuranceCompany: {
        //   value: data?.insuranceCompany?.value,
        //   label: data?.insuranceCompany?.label,
        // },
      };
      if (renewal?.status && renewal?.index == index) {
        dataToAdd = {
          ...dataToAdd,
          status: 2,
          mouReference: MOUDetails?.mouContractId
            ? "" + MOUDetails?.mouContractId
            : "",
          previousMouNumber: MOUDetails?.mouId,
        };
      }
      return dataToAdd;
    });

    const addData = {
      mouContractId: edit ? mouId : 0,
      mouId: null,
      categoryTypeEnum: 3,
      // categoryTypeName: "Aggregator",
      unitId: MOUDetails?.unitId || unitId,
      creditCompanyId: creditCompany?.value,
      creditCompany: creditCompany?.valueToUse ?? creditCompany?.label,
      contractStatusType: 1,
      // isDeleted: false,
      // contractStatusType: 1,
      mouReference: null,
      previousMouNumber: null,
      mouAggregatorDetail: payloadToAdd,
    };
    if (edit) {
      addData.globalObjectId = MOUDetails?.globalObjectId;
    }
    try {
      let companyAdd = null;
      if (edit) {
        setGlobalObjectIds();
        companyAdd = await updateAggregator({ data: addData });
      } else {
        companyAdd = await addAggregator({ data: addData });
      }

      if (companyAdd?.success) {
        const globalObjectIds = companyAdd?.data?.map((item) => {
          return {
            aggregatorNumber: item?.aggregatorNumber,
            globalObjectId: item?.globalObjectId,
          };
        });
        companyAdd?.data
          ?.sort((a, b) => a?.aggregatorNumber - b?.aggregatorNumber)
          ?.map((item, index) => {
            setValue(`aggregator.${index}.aggregatorId`, item?.aggregatorId);
          });
        setAggregatorIds(aggregatorIds);

        setGlobalObjectIds(globalObjectIds);
        if (renewal?.status) {
          setRenewalId(companyAdd?.data[0]?.contractId);
          renewalSuccess();
        } else {
          setSuccess(true);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsOpen(false);
    }
  };

  const onSubmit = (data) => {
    setIsOpen(true);
    setPayloadToSubmit(data);
  };

  return (
    <>
      <div className="bg-white shadow relative p-4 rounded-b mb-5">
        <div className="grid grid-cols-12 gap-5">
          {edit ? (
            <div className="col-span-12 md:col-span-12">
              <label
                htmlFor="creditCompany"
                className="inline-block text-gray-500 font-medium mb-2"
              >
                MOU Id
              </label>
              <div>{MOUDetails?.mouId}</div>
            </div>
          ) : (
            ""
          )}
          <div className="col-span-12 md:col-span-4">
            <label
              htmlFor="creditCompany"
              className="inline-block text-gray-500 font-medium mb-2"
            >
              Credit Company
            </label>
            <div title={creditCompany?.label || ""}>
              <Select
                options={creditCompanies}
                onChange={(selectedOption) => {
                  setCreditCompany(selectedOption);
                  getMouDetails(selectedOption);
                }}
                isDisabled={view || editAggregator || edit}
                value={creditCompany}
                classNamePrefix="react-select"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        {fields?.length
          ? fields?.map((field, index) => (
              <div key={field?.id} className="w-full">
                <AggregatorForm
                  index={index}
                  control={control}
                  errors={errors}
                  documents={documents}
                  remove={remove}
                  watch={watch}
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  view={view}
                  insuranceCompanies={insuranceCompanies}
                  tariffList={tariffList}
                  fileLocationList={fileLocationList}
                  handleSubmit={handleSubmit}
                  setFocus={setFocus}
                  globalObjectId={
                    globalObjectIds?.find(
                      (item) => item?.aggregatorNumber == index + 1
                    )?.globalObjectId
                  }
                  // aggregatorId={aggregatorIds[index]}
                  setRenewal={setRenewal}
                  confirm={confirm}
                  IsRedirecting={IsRedirecting}
                />
              </div>
            ))
          : ""}
        {!view && (
          <div className="form-actions mt-6">
            <button
              type="submit"
              disabled={!fields?.length}
              className={`text-white mr-2 ${
                !fields?.length
                  ? "bg-gray-300"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 "
              }  font-medium rounded text-md px-8 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-300`}
            >
              {/* {edit ? "Update" : "Save"} */}
              Save
            </button>
            {edit ? (
              <>
                {MOUDetails?.statusName == "Active" ||
                MOUDetails?.contractApprovalLogs?.filter(
                  (item) => item?.level == 1 && item?.statusName == "Pending"
                )?.length ? (
                  <button
                    type="button"
                    disabled={!creditCompany?.value}
                    onClick={() => append({})}
                    className={`py-2.5 px-8  mr-2  text-md font-medium text-gray-900 focus:outline-none  rounded border border-gray-200 ${
                      !creditCompany?.value
                        ? "bg-gray-300 text-white"
                        : "bg-white hover:bg-blue-600 hover:text-white"
                    }   focus:z-10 focus:ring-4 focus:ring-gray-100`}
                  >
                    Add Aggregator
                  </button>
                ) : (
                  ""
                )}
              </>
            ) : (
              <button
                type="button"
                disabled={!creditCompany?.value}
                onClick={() => append({})}
                className={`py-2.5 px-8  mr-2  text-md font-medium text-gray-900 focus:outline-none  rounded border border-gray-200 ${
                  !creditCompany?.value
                    ? "bg-gray-300 text-white"
                    : "bg-white hover:bg-blue-600 hover:text-white"
                }   focus:z-10 focus:ring-4 focus:ring-gray-100`}
              >
                Add Aggregator
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (view || edit) {
                  Navigate(-1);
                } else {
                  Navigate("/mou-contract-list");
                }
              }}
              className="py-2.5 px-8   text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {IsRedirecting.isOpen && (
        <LatestModalPopUp
          open={IsRedirecting.isOpen}
          title={
            IsRedirecting.isAdded
              ? `Selected credit ${
                  creditCompany?.valueToUse || "Company"
                } already has aggregator MOU. You are being redirected to the existing contract.`
              : `There is no MOU aggregator contract for ${creditCompany?.valueToUse}. You can create a new contract. Click on add aggregator.`
          }
          description={``}
          setOpen={() => {}}
          icon={
            IsRedirecting.isAdded ? (
              <AiOutlineLoading3Quarters
                className="h-20 w-20 text-blue-600 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <ExclamationTriangleIcon
                className="h-20 w-20 text-red-600"
                aria-hidden="true"
              />
            )
          }
          buttons={
            IsRedirecting.isAdded
              ? []
              : [
                  <button
                    key="add-aggreator-ok-btn"
                    type="button"
                    className="py-2.5 px-4 text-md font-medium text-white focus:outline-none bg-blue-600 rounded border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:ring-0 w-[100px]"
                    onClick={() =>
                      setIsRedirecting({ isOpen: false, isAdded: false })
                    }
                  >
                    Ok
                  </button>,
                ]
          }
        />
      )}

      {isOpen && (
        <LatestModalPopUp
          open={isOpen}
          title={`Are you sure you want to
           ${
             // edit
             //   ? disableAggregator
             //     ? "create Mou contract"
             //     : "update MOU contract"
             //   : "create Mou contract"
             edit
               ? "update MOU contract with"
               : `create Mou contract with ${creditCompany?.label}`
           } ${edit ? MOUDetails?.contractName : ""} ?`}
          description={`It will be sent for L1 approval`}
          setOpen={setIsOpen}
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
              onClick={submitAgreegatorDetails}
            >
              Ok
            </button>,
            <button
              type="button"
              className="py-2.5 px-4 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:ring-0 w-[100px]"
              onClick={() => setIsOpen(false)}
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
          title={`You will be able to modify details for ${MOUDetails?.contractName}`}
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
              onClick={() => Navigate(`/mou-new`)}
            >
              Ok
            </button>,
          ]}
        />
      )}
      {success && (
        <SuccessModal
          title={`MOU aggregator contract with ${
            edit ? MOUDetails?.contractName : creditCompany?.label
          } ${
            // edit ? (disableAggregator ? "created" : "updated") : "created"
            edit ? "updated" : "created"
          } successfully!`}
          showSuccessModal={success}
          setShowSuccessModal={(data) => {
            setSuccess(false);
            // setApproveDocument(null)
            reset();
            Navigate("/mou-contract-list");
          }}
        />
      )}
    </>
  );
};

export default Aggregator;

const AggregatorForm = ({
  index,
  control,
  errors,
  documents,
  remove,
  watch,
  register,
  customStyles,
  setValue,
  getValues,
  view,
  insuranceCompanies,
  tariffList,
  fileLocationList,
  handleSubmit,
  globalObjectId,
  setRenewal,
  setFocus,
  IsRedirecting,
  // aggregatorId
}) => {
  const { mouId } = useParams();
  const { MOUDetails } = useContext(MOUContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hideForm, setHideForm] = useState(true);

  const edit = searchParams.get("edit");
  const renewal = watch(`aggregator.${index}.renewal`);
  const aggregatorId = watch(`aggregator.${index}.aggregatorId`);
  const validityDateFrom = watch(`aggregator.${index}.validityDateFrom`);
  const validityDateTo = watch(`aggregator.${index}.validityDateTo`);
  const coPaymentPercent = watch(`aggregator.${index}.coPaymentInPercent`);
  const opCoPayment = watch(`aggregator.${index}.opCoPayment`);
  const hcCoPayment = watch(`aggregator.${index}.hcCoPayment`);
  const ipCoPayment = watch(`aggregator.${index}.ipCoPayment`);
  const netralayaCoPayment = watch(`aggregator.${index}.netralayaCoPayment`);
  const patientDeposit = watch(`aggregator.${index}.patientDeposit`);
  const opWatch = watch(`aggregator.${index}.op`);
  const ipWatch = watch(`aggregator.${index}.ip`);
  const hcWatch = watch(`aggregator.${index}.hc`);
  const netralayaWatch = watch(`aggregator.${index}.netralaya`);
 
  const [custodianNameOption, setCustodianNameOption] = useState(null);
 
  
  const renewalDateFrom = watch(`aggregator.${index}.renewalFrom`);
  const nonAdmissableService = watch(
    `aggregator.${index}.nonAdmissableService`
  );
  const aggregatorStatus = watch(`aggregator.${index}.statusName`);
  const AggregatorApprovalLogs = watch(
    `aggregator.${index}.contractAggregatorApprovalLogs`
  );
  const aggregatorAddDetails = watch(`aggregator.${index}.addDetails`);
  const opDiscount = watch(`aggregator.${index}.opDiscount`);
  const ipDiscount = watch(`aggregator.${index}.ipDiscount`);
  const hcDiscount = watch(`aggregator.${index}.hcDiscount`);
  const netralayaDiscount = watch(`aggregator.${index}.netralayaDiscount`);

  // const sum = parseInt(demoWatchEmp) + parseInt(demoWatchDep);
  // const [approveDocument, setApproveDocument] = useState(null);
  const [alert, setAlert] = useState(false);
  const [terminationNotice, setTerminationNotice] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);


  useEffect(() => {
    if (MOUDetails?.aggregators[index]?.aggregatorId) {
      setHideForm(false);
    }
    
  }, [MOUDetails?.aggregators[index]?.aggregatorId]);

  useEffect(() => {
    if (opWatch == true) {
      setValue(`aggregator.${index}.opCoPayment`, true);
    }
    if (opWatch == false) {
      setValue(`aggregator.${index}.opCoPayment`, false);
      setValue(`aggregator.${index}.opDiscount`, null);
    }

    if (ipWatch == true) {
      setValue(`aggregator.${index}.ipCoPayment`, true);
    }
    if (ipWatch == false) {
      setValue(`aggregator.${index}.ipCoPayment`, false);
      setValue(`aggregator.${index}.ipDiscount`, null);
    }
    if (hcWatch == true) {
      setValue(`aggregator.${index}.hcCoPayment`, true);
    }
    if (hcWatch == false) {
      setValue(`aggregator.${index}.hcCoPayment`, false);
      setValue(`aggregator.${index}.hcDiscount`, null);
    }
    if (netralayaWatch == true) {
      setValue(`aggregator.${index}.netralayaCoPayment`, true);
    }
    if (netralayaWatch == false) {
      setValue(`aggregator.${index}.netralayaCoPayment`, false);
      setValue(`aggregator.${index}.netralayaDiscount`, null);
    }
  }, [opWatch, ipWatch, hcWatch, netralayaWatch, setValue]);

  useEffect(() => {
    setFocus(`aggregator.${index}.insuranceCompany`);
  }, []);
  const handleDeleteAggregator = async (indx, aggregatorId) => {
    try {
      const response = await deleteAggregator(aggregatorId);
      if (response?.success) {
        remove(indx);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message ?? "Error while delete mou aggregator", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleDelete = (index) => {
    if (edit && aggregatorId) {
      handleDeleteAggregator(index, aggregatorId);
    } else {
      remove(index);
    }
  };

  //disabling while edit in the case of data already available fetch with the help of credit company
  // const aggregatorDisable = disableAggregator && index + 1 <= MOUDetails?.aggregators?.length;
  let aggregatorDisable = true;
  if (edit && aggregatorId) {
    // if (MOUDetails?.statusName != "Active") {
    //   aggregatorDisable = false;
    // } else {
    //   console.log("::::AggregatorApprovalLogs:::::", AggregatorApprovalLogs);

    //   if (
    //     AggregatorApprovalLogs?.filter(
    //       (item) => item?.level == 1 && item?.statusName == "Pending"
    //     )?.length
    //   ) {
    //     aggregatorDisable = true;
    //   } else {
    //     aggregatorDisable = false;
    //   }
    // }
    if (
      MOUDetails?.statusName == "Active" ||
      MOUDetails?.statusName == "Pending Approval"
    ) {
      if (
        AggregatorApprovalLogs?.filter(
          (item) =>
            item?.level == 1 &&
            (item?.statusName == "Pending" ||
              item?.statusName == "Pending Approval")
        )?.length
      ) {
        aggregatorDisable = true;
      } else {
        aggregatorDisable = false;
      }
    } else {
      aggregatorDisable = false;
    }
    // else {
    //   console.log("::::AggregatorApprovalLogs:::::", AggregatorApprovalLogs);

    //   if (
    //     AggregatorApprovalLogs?.filter(
    //       (item) => item?.level == 1 && item?.statusName == "Pending"
    //     )?.length
    //   ) {
    //     aggregatorDisable = true;
    //   } else {
    //     aggregatorDisable = false;
    //   }
    // }
  }
  // (edit && MOUDetails?.statusName == "Active" && aggregatorStatus && aggregatorStatus == "Pending Approval") ? true
  // : (edit && MOUDetails?.statusNam && MOUDetails?.statusName != "Active" && aggregatorStatus && aggregatorStatus != "Pending Approval") ? false
  // : true
  return (
    <>
      <div className="grid grid-cols-12 gap-5 mt-6">
        <div className="col-span-12" 
        onClick={() => setHideForm(!hideForm)}
        >
          <p className="text-xl font-semibold p-4 bg-blue-600 text-white rounded flex justify-between items-center">
            {MOUDetails?.aggregators?.length ? (
              //  ${
              //   MOUDetails.aggregators[index]?.contractStatusTypeName == "New"
              //     ? ""
              //     : MOUDetails.aggregators[index]?.contractStatusTypeName ||
              //       ""
              // } 
              <span>
                {`
               
                Aggregator Id - ${
                  MOUDetails?.aggregators[index]?.aggregatorId || index + 1
                } 
                ${ MOUDetails?.aggregators[index]?.aggregatorId ? `(${
                  MOUDetails?.aggregators[index]?.statusName == "Pending Approval"
                  ? `L${MOUDetails?.aggregators[index]?.contractAggregatorApprovalLogs.sort((a,b)=>b?.level - a?.level)[0]?.level} - Pending Approval`
                  : MOUDetails?.aggregators[index]?.statusName
                })`:""}
               
                ${MOUDetails?.aggregators[index]?.aggregatorId ? `${
                MOUDetails?.aggregators[index]?.contractStatusTypeName == "New"
                  ? ""
                  : `[${MOUDetails?.aggregators[index]?.contractStatusTypeName}
                  ${
                  (MOUDetails?.aggregators[index]?.contractStatusTypeName == "Addendum" 
                  && ( MOUDetails?.aggregators[index]?.statusName == "Pending Approval" || MOUDetails?.aggregators[index]?.statusName == "Rejected")) ||
               MOUDetails?.aggregators[index]?.contractStatusTypeName == "Renewal"
                  ? ` of ${MOUDetails?.aggregators[index]?.aggregatorReference}` :"" 
                  }]`
              }`:"" }
              `}
              </span>
            ) : (
              <span>Aggregator {index + 1}</span>
            )}{" "}
            {hideForm ? (
              <BsChevronDown className="cursor-pointer" />
            ) : (
              <BsChevronUp className="cursor-pointer" />
            )}
          </p>
        </div>
      </div>
      {/* ----working 0--- */}
      <div
      
        className={`${
          hideForm ? "block" : "hidden"
        } bg-white shadow relative rounded py-25`}
      >
        {/* <div className="bg-white shadow relative rounded py-25"> */}
        <div className="grid grid-cols-12 px-4 pt-4 mb-8 mt-2">
          <div className="col-span-6">
            <label
              htmlFor="insuranceCompany"
              className="inline-block font-medium text-xl mb-4"
            >
              Insurance Company <span className="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`aggregator.${index}.insuranceCompany`}
              control={control}
              // defaultValue={[]}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={insuranceCompanies}
                  // isMulti
                  isClearable={true}
                  isDisabled={!aggregatorDisable}
                  classNamePrefix="react-select"
                  placeholder="Select insurance company"
                />
              )}
            />
            {errors?.aggregator &&
              errors?.aggregator[index]?.insuranceCompany && (
                <span className="text-red-500 mt-1">
                  This field is required
                </span>
              )}
          </div>
          <div className="col-span-6 flex justify-end">
            {aggregatorDisable ? (
              <BsTrash
                onClick={() => {
                  setIsDeletePopupOpen(true);
                  // if(edit && aggregatorId ){
                  //   handleDeleteAggregator(index,aggregatorId)
                  // }else{
                  //   remove(index)
                  // }
                }}
                title="Remove Aggregator"
                className="cursor-pointer text-lg font-semibold h-8 w-8"
              />
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Validity */}
        <div className="grid grid-cols-12 gap-5 px-4 pt-4">
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center">
              <p className="text-xl font-semibold">Validity</p>
              <div className="inline-flex items-center ml-8">
                <input
                  type="checkbox"
                  id={`renewal-${index}`}
                  className={`mr-2 ${
                    aggregatorDisable && "cursor-pointer"
                  } w-5 h-5 border-gray-400 rounded `}
                  {...register(`aggregator.${index}.renewal`)}
                  disabled={!aggregatorDisable}
                />
                <label htmlFor={`renewal-${index}`}>Renewal Opted</label>
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
                  name={`aggregator.${index}.validityDateFrom`} // Adjusted field name
                  control={control}
                  rules={{ required: !view && "This field is required" }}
                  render={({ field }) => (
                    <DatePicker
                      className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                        !aggregatorDisable && "bg-gray-100"
                      }`}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="Select from date"
                      dateFormat="dd/MM/yyyy"
                      disabled={!aggregatorDisable}
                    />
                  )}
                />
                {errors?.aggregator &&
                  errors?.aggregator[index]?.validityDateFrom && (
                    <p className="text-red-500 mt-1">
                      {errors?.aggregator[index]?.validityDateFrom?.message}
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
                  name={`aggregator.${index}.validityDateTo`}
                  control={control}
                  rules={{ required: !view && "This field is required" }}
                  render={({ field }) => (
                    <DatePicker
                      className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                        !aggregatorDisable && "bg-gray-100"
                      }`}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="Select to date"
                      minDate={validityDateFrom}
                      excludeDates={validityDateFrom ? [validityDateFrom] :""}
                      dateFormat="dd/MM/yyyy"
                      disabled={!aggregatorDisable}
                    />
                  )}
                />
                {errors?.aggregator &&
                  errors?.aggregator[index]?.validityDateTo && (
                    <p className="text-red-500 mt-1">
                      {errors?.aggregator[index]?.validityDateTo?.message}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {renewal && (
            <div className="col-span-12 md:col-span-6">
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
                    name={`aggregator.${index}.renewalFrom`}
                    control={control}
                    rules={{
                      required: renewal && !view && "This field is required",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                          !aggregatorDisable && "bg-gray-100"
                        }`}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholderText="Select renewal from date"
                        // required
                        disabled={!aggregatorDisable}
                        minDate={validityDateTo}
                        excludeDates={validityDateTo ? [validityDateTo] : ""}
                        dateFormat="dd/MM/yyyy" // Set the date format
                      />
                    )}
                  />
                  {errors?.aggregator &&
                    errors?.aggregator[index]?.renewalFrom && (
                      <p className="text-red-500 mt-1">
                        {errors?.aggregator[index]?.renewalFrom?.message}
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
                    name={`aggregator.${index}.renewalTo`}
                    control={control}
                    rules={{
                      required: renewal && !view && "This field is required",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                          !aggregatorDisable && "bg-gray-100"
                        }`}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholderText="Select renewal to date"
                        // required
                        disabled={!aggregatorDisable}
                        minDate={renewalDateFrom}
                        excludeDates={renewalDateFrom ? [renewalDateFrom] : ""}
                        dateFormat="dd/MM/yyyy" // Set the date format
                      />
                    )}
                  />
                  {errors?.aggregator &&
                    errors?.aggregator[index]?.renewalTo && (
                      <p className="text-red-500 mt-1">
                        {errors?.aggregator[index]?.renewalTo?.message}
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
                  aggregatorDisable && "cursor-pointer"
                } w-5 h-5 border-gray-400 rounded`}
                // value={true}
                disabled={!aggregatorDisable}
                {...register(`aggregator.${index}.op`, {
                  validate: (value) => {
                    const values = getValues(`aggregator.${index}`);
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
                disabled={!aggregatorDisable}
                className={`mr-2 ${
                  aggregatorDisable && "cursor-pointer"
                } w-5 h-5 border-gray-400 rounded`}
                {...register(`aggregator.${index}.ip`)}
              />
              <label htmlFor="ip">IP</label>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="hc"
                disabled={!aggregatorDisable}
                className={`mr-2 ${
                  aggregatorDisable && "cursor-pointer"
                } w-5 h-5 border-gray-400 rounded`}
                {...register(`aggregator.${index}.hc`)}
              />
              <label htmlFor="hc">HC</label>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="netralaya"
                disabled={!aggregatorDisable}
                className={`mr-2 ${
                  aggregatorDisable && "cursor-pointer"
                } w-5 h-5 border-gray-400 rounded`}
                {...register(`aggregator.${index}.netralaya`)}
              />
              <label htmlFor="netralaya">Netralaya</label>
            </div>
          </div>

          {errors?.aggregator && errors?.aggregator[index]?.op && (
            <p className="text-red-500  col-span-12">
              {errors?.aggregator[index]?.op?.message}
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
                    aggregatorDisable && "cursor-pointer"
                  } border-gray-400 w-5 h-5`}
                  value="yes"
                  disabled={!aggregatorDisable}
                  name={`aggregator.${index}.coPaymentInPercent`}
                  {...register(`aggregator.${index}.coPaymentInPercent`, {
                    required: aggregatorDisable && "This field is required",
                  })}
                />
                <label htmlFor="coPaymentInPercentYes">Yes</label>

                <input
                  type="radio"
                  id="coPaymentInPercentNo"
                  className={`${
                    aggregatorDisable && "cursor-pointer"
                  } border-gray-400 w-5 h-5`}
                  value="no"
                  disabled={!aggregatorDisable}
                  name={`aggregator.${index}.coPaymentInPercent`}
                  {...register(`aggregator.${index}.coPaymentInPercent`)}
                />
                <label htmlFor="coPaymentInPercentNo">No</label>
              </div>
            </div>
            {errors?.aggregator &&
              errors?.aggregator[index]?.coPaymentInPercent && (
                <p className="text-red-500 mt-1 ">
                  {errors?.aggregator[index]?.coPaymentInPercent?.message}
                </p>
              )}
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
                          id="opCoPayment"
                          disabled={true}
                          // disabled={hcWatch || ipWatch || netralayaWatch}
                          className={`mr-2 
                           w-5 h-5 border-gray-400 rounded`}
                          {...register(`aggregator.${index}.opCoPayment`)}
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
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.opCoPaymentEmployee`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]?.opCoPaymentEmployee
                                  ? errors?.aggregator[index]
                                      ?.opCoPaymentEmployee?.message
                                  : ""}
                              </p>
                            </div>
                            <div className="relative flex-1 flex justify-center">
                              <input
                                type="number"
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.opCoPaymentDependant`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]?.opCoPaymentDependant
                                  ? errors?.aggregator[index]
                                      ?.opCoPaymentDependant?.message
                                  : ""}
                              </p>
                            </div>
                          </div>
                          {/* <p className="flex w-full justify-center text-red-500 mt-1">
                            {opCoPaymentEmployee &&
                            opCoPaymentDependant &&
                            +opCoPaymentEmployee + +opCoPaymentDependant != 100
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
                          disabled={true}
                          id="hcCoPayment"
                          className="mr-2  w-5 h-5 border-gray-400 rounded"
                          {...register(`aggregator.${index}.hcCoPayment`)}
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
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.hcCoPaymentEmployee`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]?.hcCoPaymentEmployee
                                  ? errors?.aggregator[index]
                                      ?.hcCoPaymentEmployee?.message
                                  : ""}
                              </p>
                            </div>
                            <div className="relative flex-1 flex justify-center">
                              <input
                                type="number"
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.hcCoPaymentDependant`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]?.hcCoPaymentDependant
                                  ? errors?.aggregator[index]
                                      ?.hcCoPaymentDependant?.message
                                  : ""}
                              </p>
                            </div>
                          </div>
                          {/* <p className="flex w-full justify-center text-red-500 mt-1">
                            {hcCoPaymentEmployee &&
                            hcCoPaymentDependant &&
                            +hcCoPaymentEmployee + +hcCoPaymentDependant != 100
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
                          disabled={true}
                          id="ipCoPayment"
                          className="mr-2  w-5 h-5 border-gray-400 rounded"
                          {...register(`aggregator.${index}.ipCoPayment`)}
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
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.ipCoPaymentEmployee`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]?.ipCoPaymentEmployee
                                  ? errors?.aggregator[index]
                                      ?.ipCoPaymentEmployee?.message
                                  : ""}
                              </p>
                            </div>
                            <div className="relative  flex-1 flex justify-center">
                              <input
                                type="number"
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.ipCoPaymentDependant`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]?.ipCoPaymentDependant
                                  ? errors?.aggregator[index]
                                      ?.ipCoPaymentDependant?.message
                                  : ""}
                              </p>
                            </div>
                          </div>
                          {/* <p className="flex w-full justify-center text-red-500 mt-1">
                            {demoWatchEmp &&
                            demoWatchDep &&
                            +demoWatchEmp + +demoWatchDep != 100
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
                          disabled={true}
                          // disabled={opWatch || ipWatch || hcWatch }
                          id="netralayaCoPayment"
                          className="mr-2  w-5 h-5 border-gray-400 rounded"
                          {...register(
                            `aggregator.${index}.netralayaCoPayment`
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
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.netralayaCoPaymentEmployee`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]
                                  ?.netralayaCoPaymentEmployee
                                  ? errors?.aggregator[index]
                                      ?.netralayaCoPaymentEmployee?.message
                                  : ""}
                              </p>
                            </div>
                            <div className="relative flex-1 flex justify-center">
                              <input
                                type="number"
                                disabled={!aggregatorDisable}
                                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                                  !aggregatorDisable && "bg-gray-100"
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
                                  `aggregator.${index}.netralayaCoPaymentDependant`,
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
                                {errors?.aggregator &&
                                errors?.aggregator[index]
                                  ?.netralayaCoPaymentDependant
                                  ? errors?.aggregator[index]
                                      ?.netralayaCoPaymentDependant?.message
                                  : ""}
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

        <hr className="my-8 mx-4" />

        {/* discount on Tariff */}
        <div className="grid grid-cols-12 gap-5 px-4">
          <div className="col-span-12">
            <p className="text-xl font-semibold">Discount on Tariff</p>
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-4">
                <label
                  htmlFor={`aggregator.${index}.discountTariff`}
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  Tariff <span className="ml-1 text-red-400">*</span>
                </label>

                <Controller
                  name={`aggregator.${index}.discountTariff`}
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={tariffList}
                      isClearable={true}
                      isDisabled={!aggregatorDisable}
                      classNamePrefix="react-select"
                      placeholder="Select tariff"
                    />
                  )}
                />
                {errors?.aggregator &&
                  errors?.aggregator[index]?.discountTariff && (
                    <p className="text-red-500 mt-1">
                      {errors?.aggregator[index]?.discountTariff?.message}
                    </p>
                  )}
              </div>
              <div className="col-span-12 md:col-span-4">
                <label
                  htmlFor={`aggregator.${index}.discountTransactionYear`}
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  Transaction Year<span className="ml-1 text-red-400">*</span>
                </label>
                <Controller
                  name={`aggregator.${index}.discountTransactionYear`}
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        options={generateYearOptions()?.map((option) => ({
                          value: option,
                          label: `${option}`,
                        }))}
                        isClearable={true}
                        isDisabled={!aggregatorDisable}
                        classNamePrefix="react-select"
                        placeholder={field?.value ?? "Select transaction year"}
                      />
                    );
                  }}
                />
                {/* <select
                  disabled={!aggregatorDisable}
                  className={`form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                    !aggregatorDisable && "bg-gray-100"
                  }`}
                  {...register(`aggregator.${index}.discountTransactionYear`, {
                    required: "This field is required",
                  })}
                >
                  <option value="">Select transaction year</option>
                  {generateYearOptions()?.map((option, index) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select> */}
                {errors?.aggregator &&
                  errors?.aggregator[index]?.discountTransactionYear && (
                    <p className="text-red-500 mt-1">
                      {
                        errors?.aggregator[index]?.discountTransactionYear
                          ?.message
                      }
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
                  {opCoPayment && <span className="ml-1 text-red-400">*</span>}
                </label>
                <div className="inline-flex items-center">
                  <input
                    type="number"
                    disabled={!aggregatorDisable || !opCoPayment}
                    defaultValue={0}
                    placeholder="Enter op percentage"
                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                      (!aggregatorDisable || !opCoPayment) && "bg-gray-100"
                    }`}
                    onInput={(e) => {
                      const value = e.target.value;
                      if (value < 0) {
                        e.target.value = 0;
                      } else if (value > 100) {
                        e.target.value = 100;
                      }
                    }}
                    {...register(`aggregator.${index}.opDiscount`, {
                      required:
                        opCoPayment &&
                        opDiscount === "" &&
                        "This field is required",
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
                {errors?.aggregator &&
                  errors?.aggregator[index]?.opDiscount && (
                    <span className="text-red-500">
                      {errors?.aggregator[index]?.opDiscount?.message}
                    </span>
                  )}
              </div>
              <div className="col-span-6 md:col-span-2">
                <label
                  htmlFor=""
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  IP{" "}
                  {ipCoPayment && <span className="ml-1 text-red-400">*</span>}
                </label>
                <div className="inline-flex items-center">
                  <input
                    disabled={!aggregatorDisable || !ipCoPayment}
                    type="number"
                    defaultValue={0}
                    placeholder="Enter ip percentage"
                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                      (!aggregatorDisable || !ipCoPayment) && "bg-gray-100"
                    }`}
                    onInput={(e) => {
                      const value = e.target.value;
                      if (value < 0) {
                        e.target.value = 0;
                      } else if (value > 100) {
                        e.target.value = 100;
                      }
                    }}
                    {...register(`aggregator.${index}.ipDiscount`, {
                      required:
                        ipCoPayment &&
                        ipDiscount === "" &&
                        "This field is required",
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
                {errors?.aggregator &&
                  errors?.aggregator[index]?.ipDiscount && (
                    <span className="text-red-500">
                      {errors?.aggregator[index]?.ipDiscount?.message}
                    </span>
                  )}
              </div>
              <div className="col-span-6 md:col-span-2">
                <label
                  htmlFor=""
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  HC{" "}
                  {hcCoPayment && <span className="ml-1 text-red-400">*</span>}
                </label>
                <div className="inline-flex items-center">
                  <input
                    disabled={!aggregatorDisable || !hcCoPayment}
                    type="number"
                    defaultValue={0}
                    placeholder="Enter hc percentage"
                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                      (!aggregatorDisable || !hcCoPayment) && "bg-gray-100"
                    }`}
                    onInput={(e) => {
                      const value = e.target.value;
                      if (value < 0) {
                        e.target.value = 0;
                      } else if (value > 100) {
                        e.target.value = 100;
                      }
                    }}
                    {...register(`aggregator.${index}.hcDiscount`, {
                      required:
                        hcCoPayment &&
                        hcDiscount === "" &&
                        "This field is required",
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
                {errors?.aggregator &&
                  errors?.aggregator[index]?.hcDiscount && (
                    <span className="text-red-500">
                      {errors?.aggregator[index]?.hcDiscount?.message}
                    </span>
                  )}
              </div>
              <div className="col-span-6 md:col-span-2">
                <label
                  htmlFor=""
                  className="inline-block text-gray-500 font-medium mb-2"
                >
                  Netralaya{" "}
                  {netralayaCoPayment && (
                    <span className="ml-1 text-red-400">*</span>
                  )}
                </label>
                <div className="inline-flex items-center">
                  <input
                    type="number"
                    defaultValue={0}
                    disabled={!aggregatorDisable || !netralayaCoPayment}
                    placeholder="Enter netralaya percentage"
                    className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                      (!aggregatorDisable || !netralayaCoPayment) &&
                      "bg-gray-100"
                    } `}
                    onInput={(e) => {
                      const value = e.target.value;
                      if (value < 0) {
                        e.target.value = 0;
                      } else if (value > 100) {
                        e.target.value = 100;
                      }
                    }}
                    {...register(`aggregator.${index}.netralayaDiscount`, {
                      required:
                        netralayaCoPayment &&
                        netralayaDiscount === "" &&
                        "This field is required",
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
                {errors?.aggregator &&
                  errors?.aggregator[index]?.ipDiscount && (
                    <span className="text-red-500">
                      {errors?.aggregator[index]?.ipDiscount?.message}
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
          <div className="col-span-12 md:col-span-6">
            <Controller
              name={`aggregator.${index}.approvalDocuments`}
              control={control}
              // defaultValue={[]}
              rules={{ required: !view && true }}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  isMulti={true}
                  cacheOptions
                  loadOptions={fetchApproveDocument}
                  // defaultValue={approveDocument}
                  // value={approveDocument}
                  onChange={(approveDocument) => {
                    // setApproveDocument(approveDocument);
                    field.onChange(approveDocument);
                  }}
                  isClearable={true}
                  placeholder="Select approval documents"
                  styles={customStyles}
                  isRequired={true}
                  isDisabled={!aggregatorDisable}
                />
              )}
            />
            {errors?.aggregator &&
              errors?.aggregator[index]?.approvalDocuments && (
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
            disabled={
              (aggregatorStatus && aggregatorStatus != "Pending Approval") ||
              !aggregatorDisable
            }
            // disabled={!aggregatorDisable}
            errors={errors}
            name="Upload MOU"
            mandate={true}
            uploadFor={MOUDetails?.aggregators?.length && MOUDetails?.aggregators[index]?.contractStatusTypeName == "Addendum" ? "Aggregator Addendum Document" : MOUDetails?.aggregators?.length && MOUDetails?.aggregators[index]?.contractStatusTypeName == "Renewal" ? "Aggregator Renewal Document" : "Aggregator Document"}
            id={aggregatorId}
            aggregatorReference={813}
            aggregatorId={aggregatorId}
            type="Aggregator"
            uuidVal={`aggregator_${index}`}
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
                    aggregatorDisable && "cursor-pointer"
                  } border-gray-400 w-5 h-5`}
                  value="yes"
                  disabled={!aggregatorDisable}
                  name={`aggregator.${index}.patientDeposit`}
                  {...register(`aggregator.${index}.patientDeposit`, {
                    required: aggregatorDisable && "This field is required",
                  })}
                />
                <label htmlFor="patientDepositYes">Yes</label>

                <input
                  type="radio"
                  id="patientDepositNo"
                  className={`${
                    aggregatorDisable && "cursor-pointer"
                  } border-gray-400 w-5 h-5`}
                  value="no"
                  disabled={!aggregatorDisable}
                  name={`aggregator.${index}.patientDeposit`}
                  {...register(`aggregator.${index}.patientDeposit`)}
                />
                <label htmlFor="patientDepositNo">No</label>
              </div>
            </div>
            <p className="text-red-500  mt-1  ">
              {errors?.aggregator &&
                errors?.aggregator[index]?.patientDeposit &&
                "This field is required"}
            </p>
          </div>
          {patientDeposit == "yes" ? (
            <div className="col-span-12 md:col-span-4">
              <input
                type="number"
                disabled={!aggregatorDisable}
                placeholder="In Rupees"
                className={`${
                  !aggregatorDisable && "bg-gray-100"
                } form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full`}
                {...register(`aggregator.${index}.patientDepositInRupees`, {
                  required:
                    patientDeposit == "yes" ? "This field is required" : "",
                  pattern: {
                    value: /^[0-9]*\.?[0-9]*$/,
                    message: "Please enter valid amount",
                  },
                })}
              />
              {errors?.aggregator &&
                errors?.aggregator[index]?.patientDepositInRupees && (
                  <p className="text-red-500 ml-6   mt-1">
                    {errors?.aggregator[index]?.patientDepositInRupees?.message}
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
                  disabled={!aggregatorDisable}
                  id="nonAdmissableServiceYes"
                  className={`${
                    aggregatorDisable && "cursor-pointer"
                  } border-gray-400 w-5 h-5`}
                  value="yes"
                  name={`aggregator.${index}.nonAdmissableService`}
                  {...register(`aggregator.${index}.nonAdmissableService`, {
                    required: aggregatorDisable && "This field is required",
                  })}
                />
                <label htmlFor="nonAdmissableServiceYes">Yes</label>

                <input
                  type="radio"
                  disabled={!aggregatorDisable}
                  id="nonAdmissableServiceNo"
                  className={`${
                    aggregatorDisable && "cursor-pointer"
                  } border-gray-400 w-5 h-5`}
                  value="no"
                  name={`aggregator.${index}.nonAdmissableService`}
                  {...register(`aggregator.${index}.nonAdmissableService`)}
                />
                <label htmlFor="nonAdmissableServiceNo">No</label>
              </div>
            </div>
            <p className="text-red-500 mt-1">
              {errors?.aggregator &&
                errors?.aggregator[index]?.nonAdmissableService &&
                "This field is required"}
            </p>
          </div>
        </div>

        {nonAdmissableService == "yes" && (
          <div className="grid grid-cols-12 gap-5 mt-6">
            <div className="col-span-12 md:col-span-6 px-4">
              <Controller
                name={`aggregator.${index}.naMaterialService`}
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
                    isDisabled={!aggregatorDisable}
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

        <hr className="my-8 mx-4" />

        {/* payment Terms */}
        <div className="grid grid-cols-12 gap-5 px-4">
          <div className="col-span-12">
            <p className="text-xl font-semibold">
              Payment Terms <span className="text-danger">*</span>
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <input
                className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                  !aggregatorDisable && "bg-gray-100"
                }`}
                type="text"
                placeholder="Enter payment terms"
                disabled={!aggregatorDisable}
                {...register(`aggregator.${index}.paymentTerms`, {
                  required: !view && "This field is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter valid input",
                  },
                })}
              />
              <p className="md:ml-3 shrink-0">
                <span className="text-lg font-medium">Days</span>
                <span className="text-sm ml-2">
                  (From days of Bill Submission)
                </span>
              </p>
            </div>
            {errors?.aggregator && errors?.aggregator[index]?.paymentTerms && (
              <p className="text-red-500   mt-1 ">
                {errors?.aggregator[index]?.paymentTerms?.message}
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
          <div className="col-span-12 md:col-span-4">
            <label for="" class="inline-block text-gray-500 font-medium mb-2">
              Custodian Name <span class="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`aggregator.${index}.custodianName`}
              control={control}
              defaultValue={[]}
              rules={{ required: !view && true }}
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
                  styles={customStyles}
                  isRequired={true}
                  isDisabled={!aggregatorDisable}
                />
              )}
            />
            {errors?.aggregator && errors?.aggregator[index]?.custodianName && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label for="" class="inline-block text-gray-500 font-medium mb-2">
              File Location <span class="ml-1 text-red-400">*</span>
            </label>
            <Controller
              name={`aggregator.${index}.fileLocation`}
              control={control}
              defaultValue={[]}
              rules={{ required: !view && true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={fileLocationList}
                  // isMulti
                  isDisabled={!aggregatorDisable}
                  isClearable={true}
                  classNamePrefix="react-select"
                  placeholder="Select file location"
                />
              )}
            />
            {errors?.aggregator && errors?.aggregator[index]?.fileLocation && (
              <span className="text-red-500 mt-1">This field is required</span>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label for="" class="inline-block text-gray-500 font-medium mb-2">
              Add Details
            </label>
            <input
              type="text"
              placeholder="Enter add details"
              maxLength={150}
              minLength={2}
              disabled={!aggregatorDisable}
              className={`form-input px-4 py-2 border-gray-300 shadow-sm rounded-md w-full ${
                !aggregatorDisable && "bg-gray-100"
              }`}
              {...register(`aggregator.${index}.addDetails`, {
                // required: !view && "This field is required",
                maxLength: {
                  value: 150,
                  message: "Maximum length is 100 characters",
                },
                minLength: {
                  value: 2,
                  message: "Minimum length is 2 character",
                },
              })}
            />
            <span className="inline-block text-right w-full text-gray-500 mb-2">
              {`${
                aggregatorAddDetails ? aggregatorAddDetails?.length : 0
              } of 150 Characters`}
            </span>
            {errors?.aggregator && errors?.aggregator[index]?.addDetails && (
              <p className="text-red-500   mt-1 ">
                {errors?.aggregator[index]?.addDetails?.message}
              </p>
            )}
          </div>
        </div>

        {view && (
          <div className="flex justify-start items-center gap-4 mb-8 py-8 px-4">
            <button
              type="button"
              onClick={() => setAlert(true)}
              className="py-2.5 px-8 text-md font-medium text-green-700 focus:outline-none bg-white rounded border border-gray-300 hover:bg-green-600 hover:border-green-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
            >
              <BsArrowClockwise size={"18px"} className="mr-2" />
              Renew
            </button>
            <button
              type="button"
              onClick={() => setTerminationNotice(true)}
              className="py-2.5 px-5 text-md font-medium text-red-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
            >
              <BsXCircle size={"18px"} className="mr-2" />
              Post Termination Notice
            </button>
            <button
              type="button"
              //  onClick={() => navigate("/mou-new")}
              className="py-2.5 px-8 text-md font-medium text-blue-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
            >
              <BsPlusCircle size={"18px"} className="mr-2" />
              Add Addendum
            </button>
            <button
              type="button"
              className="py-2.5 px-8 text-md font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-600 hover:border-gray-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 flex items-center"
            >
              <BsPrinter size={"18px"} className="mr-2" />
              Print
            </button>
          </div>
        )}
      </div>

      {alert && (
        <LatestModalPopUp
          open={alert}
          title={`Renew MOU ${MOUDetails?.contractName}`}
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
              onClick={() => {
                setRenewal({
                  status: true,
                  index: index,
                  mouReference: mouId,
                  previousMouNumber: "",
                });
                // setConfirm(true)
              }}
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

      {terminationNotice && (
        <PostTerminationNotice
          open={terminationNotice}
          setOpen={setTerminationNotice}
        />
      )}
      {isDeletePopupOpen && (
        <AlertModal
          title={`Are you sure you want to delete aggregator ${
            (MOUDetails?.aggregators?.length &&
              MOUDetails?.aggregators[index]?.aggregatorId) ||
            index + 1
          } details?`}
          isOpen={isDeletePopupOpen}
          setIsOpen={setIsDeletePopupOpen}
          // setShowSuccessModal={setShowSuccessModal}
          confirmPost={() => handleDelete(index)}
        />
      )}
      {/* </div> */}
    </>
  );
};
