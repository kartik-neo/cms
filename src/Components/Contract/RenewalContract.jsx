import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  convertFromUnix,
  DateToUnixTimestamp,
} from "../../utils/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Link,
  useLocation,
  useNavigate, 
} from "react-router-dom";
import DepartmentForm from "../Common/contractForms/DepartmentForm";
import KeyDatesForm from "../Common/contractForms/KeyDatesForm";
import PartyDetails from "../Common/contractForms/PartyDetails";
import CustodianDetails from "../Common/contractForms/CustodianDetails";
import { createContractForm } from "../../Services/contractServices";
import SuccessModal from "../Common/ModalPopups/SuccessModal";
import AlertModal from "../Common/ModalPopups/AlertModal";
import UploadMediaCMS from "../Common/UploadMediaCMS";
import { fetchCompanyById } from "../../Services/createCompanyService";
import { fetchEmpId } from "../../Services/external";
import { fetchContractView } from "../../Services/contractTypeMastersServices";
import { retainerOptionData } from "../../Constant/apiConstant";
import PageTitle from "../Common/PageTitle";

const RenewalContract = ({ type, cameFrom, cameFromProps }) => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [globalObjectId, setGlobalObjectId] = useState(null);
  const [data, setData] = useState();
  const [selectedID, setSelectedID] = useState();
  const [employeeID, setEmployeeID] = useState();
  const [companyDetails, setcompanyDetails] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [inciDetails, setInciDetails] = useState("");
  const [allContractData, setAllContractData] = useState();
  const [errorMessage, setErrorMessage] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [renewId, setRenewId] = useState(null);
  const [locationnId, setLocationnId] = useState(null);

  const location = useLocation();
  const { contractId, contractType } = location.state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    control,
    getValues,
    setError,
    clearErrors,
  } = useForm({ defaultValues: "" });

  const onSubmit = (data) => {
    // let result = inciDetails.replace(/<[^>]*>/g, "")?.trim()?.length;
    // if (result == 0) {
    //   setErrorMessage(true);
    //   return false;
    // } else {
    //   setIsOpen(true);
    //   setData(data);
    // }
    setIsOpen(true);
    setData(data);
  };

  const handleContract = () => {
    // const payload = {
    //   id: 0,
    //   locationId: datacon?.locationId,
    //   locationName: datacon?.locationName,
    //   departmentId: datacon?.departmentId,
    //   departmentName: datacon?.departmentName,

    //   contractTypeId: parseInt(data?.contractType?.value),
    //   contractTypeOther: data?.contractType?.label,

    //   companyId: datacon?.companyId,
    //   // contractId: datacon?.id.toString(),
    //   contractId: "",

    //   // contractReference: allContractData?.id.toString(),

    //   contractReference: datacon?.id ? datacon?.id?.toString() : null,
    //   // contractReference: "",

    //   reference: datacon?.reference,
    //   apostilleId: datacon?.apostilleId,

    //   retainerContractId: datacon?.retainerContractId,
    //   retainerContractName: datacon?.retainerContractName,
    //   terms: datacon?.terms,

    //   keyEffectiveDate: convertIntoUnix(getValues("effectiveDate")),
    //   keyExpiryDate: convertIntoUnix(getValues("expiryDate")),
    //   renewalEffectiveDate: datacon?.renewalEffectiveDate,
    //   renewalExpiryDate: datacon?.renewalExpiryDate,

    //   empCode: datacon?.empCode,
    //   empId: datacon?.empCode,
    //   empName: datacon?.empName,
    //   empEmail: datacon?.empEmail,
    //   empPhone: datacon?.empPhone,
    //   designationId: 0,
    //   designation: datacon?.designation,
    //   empDepartment: datacon?.empDepartment,
    //   empLocationId: 0,
    //   empLocation: datacon?.empLocation,

    //   cmpName: datacon?.cmpName,
    //   cmpPhone: datacon?.cmpPhone,
    //   cmpEmail: datacon?.cmpEmail,
    //   cmpAdd1: datacon?.cmpAdd1,
    //   cmpAdd2: datacon?.cmpAdd2,
    //   cmpAdd3: datacon?.cmpAdd3,
    //   cmpPincode: datacon?.cmpPincode,
    //   cmpState: datacon?.cmpState,
    //   cmpStateId: datacon?.cmpStateId,
    //   cmpCity: datacon?.cmpCity,
    //   cmpCityId: datacon?.cmpCityId,
    //   cmpCountry: datacon?.cmpCountry,
    //   cmpCountryId: datacon?.cmpCountryId,
    //   pocName: datacon?.pocName,
    //   pocContactNo: datacon?.pocContactNo,
    //   pocEmailID: datacon?.pocEmailID,

    //   isClassified: contractType == "Classified" ? true : false,
    //   isActive: true,
    //   isDeleted: false,
    //   globalObjectId: datacon?.globalObjectId,
    //   previousContractId: datacon?.contractId,

    //   contractStatusType: "Renewal",
    //   contractCustodianDetailsModel: {
    //     cId: datacon?.contractCustodianDetailsModel?.cId,
    //     custodianDetails:
    //       datacon?.contractCustodianDetailsModel?.custodianDetails,
    //     custodianEmpCode:
    //       datacon?.contractCustodianDetailsModel?.custodianEmpCode,
    //     custodianFileLocation:
    //       datacon?.contractCustodianDetailsModel?.custodianFileLocation,
    //     custodianName: datacon?.contractCustodianDetailsModel?.custodianName,
    //     custodianFilePath:
    //       datacon?.contractCustodianDetailsModel?.custodianFilePath,
    //   },
    // };

    const apostilleResult = data?.apostilleType?.map((d) => d.value).join(",");
    const payload = {
      // id: allContractData?.id,
      id: 0,
      locationId: data?.locationId,
      locationName: data?.locationName,
      departmentId: data?.department?.value,
      departmentName: data?.department?.valueToUse ?? data?.department?.label,

      contractTypeId: data?.contractType?.value,
      contractTypeOther: data?.contractType?.value
        ? null
        : data?.contractType?.label,
      contractTypeName: data?.contractType?.value
        ? data?.contractType?.label
        : null,

      companyId: data?.contractWith?.value,

      contractId: allContractData?.id ? allContractData?.id?.toString() : "",
      contractReference: contractId
        ? contractId?.toString()
        : allContractData?.id?.toString(),

      reference: data?.refNo,
      apostilleId: apostilleResult,

      retainerContractId: data?.retainerContract?.value,
      retainerContractName: data?.retainerContract?.label,
      // terms: inciDetails,
      terms: data?.termsConditions,

      keyEffectiveDate: DateToUnixTimestamp(data?.effectiveDate),
      keyExpiryDate: DateToUnixTimestamp(data?.expiryDate),
      renewalEffectiveDate: DateToUnixTimestamp(data?.renewalEffectiveDate),
      renewalExpiryDate: DateToUnixTimestamp(data?.renewalExpiryDate),

      empCode: data?.empCode,
      empId: data?.empCode,
      empName: data?.empName?.label,
      empEmail: data?.emailId,
      empPhone: data?.contactNo,
      designationId: 0,
      designation: data?.designation,
      empDepartment: data?.empDepartment,
      empLocationId: 0,
      empLocation: data?.location,

      cmpName: data?.companyName,
      cmpPhone: data?.companyContactNo,
      cmpEmail: data?.CompanyEmailId,
      cmpAdd1: data?.companyAddressLineOne,
      cmpAdd2: data?.companyAddressLineTwo,
      cmpAdd3: data?.companyAddressLineThree,
      cmpPincode: data?.pinCode,
      cmpState: data?.states?.label,
      cmpStateId: data?.states?.value.toString(),
      cmpCity: data?.city?.label,
      cmpCityId: data?.city?.value.toString(),
      cmpCountry: data?.country?.label,
      cmpCountryId: data?.country?.value.toString(),
      pocName: data?.pocName,
      pocContactNo: data?.pocContactNo,
      pocEmailID: data?.pocEmailId,

      isClassified: contractType == "Classified" ? true : false,
      globalObjectId: globalObjectId ?? 0,
      // previousContractId: "",
      previousContractId: allContractData?.contractId,
      isActive: true,
      isDeleted: false,
      contractStatusType: "Renewal",
      contractCustodianDetailsModel: {
        cId: 0,
        // cId: allContractData?.contractCustodianDetailsModel?.cId,
        custodianDetails: data?.details,
        custodianFileLocation: data?.fileLocation?.label,
        custodianName: data?.custodianName?.label,
        custodianEmpCode: data?.custodianName?.value,
        custodianFilePath: data?.fileLocation?.label,
      },
    };

    const createContract = async () => {
      try {
        const contractData = await createContractForm({ data: payload });
        if (contractData?.success) {
          setRenewId(contractData?.data[0]?.id);
          // setConfirm(true);
          setIsEdit(true);
          setGlobalObjectId(contractData?.data[0]?.globalObjectId);
          setShowSuccessModal(true);
        } else {
          toast.error("Error while creating Contract", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        toast.error(error.message ?? "Error while creating Contract", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    createContract();
  };

  const [popUpData, setPopUpData] = useState();

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: "1.1rem",
      width: "13.3rem",
      fontSize: "8px",
      minHeight: "2.3rem",
      alignItems: "center",
    }),
  };

  const handleSuccess = () => {
    location?.state?.contractType == "Classified"
      ? navigate("/contract-classified-list")
      : navigate("/contract-list");
  };

  const getCompanyDetails = async (id) => {
    try {
      const companyDetails = await fetchCompanyById({ id: id });
      if (companyDetails?.data?.length && companyDetails?.success) {
        setcompanyDetails(companyDetails?.data[0]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getEmployeeDetails = async (empId) => {
    try {
      const employee = await fetchEmpId({ id: empId });
      let data = [...employee?.success].slice(0, 5);
      setEmployeeDetails(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getContractDetailsById = async (contractId) => {
    try {
      const response = await fetchContractView({
        id: contractId,
      });
      setAllContractData(response?.data[0]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (location?.state?.cameFrom == "active-contract") {
      getContractDetailsById(contractId);
    }
    // else {
    //   getContractDetailsById(contractId);
    // }
  }, [contractId]);

  // const handleDocumentList = async (id) => {
  //   try {
  //     const documentList = await fetchContractView({ id: id });
  //     const response = documentList?.data[0];
  //     setDatacon(documentList?.data[0]);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  // useEffect(() => {
  //   handleDocumentList(contractId);
  // }, []);

  useEffect(() => {
    if (allContractData) {
      setInciDetails(allContractData?.terms);
      setLocationnId(allContractData?.locationId)
      const newDataObj = {
        locationId:allContractData?.locationId,
        locationName:allContractData?.locationName,
        empName: allContractData?.empName,
        details:
          allContractData?.contractCustodianDetailsModel?.custodianDetails,
        department: allContractData
          ? {
              label: allContractData?.departmentName,
              value: allContractData?.departmentId,
            }
          : "",
        refNo: allContractData?.reference,

        retainerContract: allContractData
          ? retainerOptionData[allContractData?.retainerContractId - 1]
          : "",
        termsConditions: allContractData?.terms,

        contractType: allContractData
          ? {
              label:
                allContractData?.contractTypeOther ??
                allContractData?.contractTypeName,
              value: allContractData?.contractTypeId,
            }
          : "",
        contractWith: allContractData
          ? {
              label: "",
              value: allContractData?.companyId,
            }
          : "",
        empName: allContractData
          ? {
              label: allContractData?.empName,
              value: allContractData?.empCode,
            }
          : "",
        empCode: allContractData?.empCode,
        contactNo: allContractData?.empPhone,
        emailId: allContractData?.empEmail,
        designation: allContractData?.designation,
        empDepartment: allContractData?.empDepartment,
        location: allContractData?.empLocation,
        companyName: allContractData?.cmpName,
        companyContactNo: allContractData?.cmpPhone,
        CompanyEmailId: allContractData?.cmpEmail,
        companyAddressLineOne: allContractData?.cmpAdd1,
        companyAddressLineTwo: allContractData?.cmpAdd2,
        companyAddressLineThree: allContractData?.cmpAdd3,
        pinCode: allContractData?.cmpPincode,
        states: allContractData
          ? {
              label: allContractData?.cmpState,
              value: allContractData?.cmpStateId,
            }
          : "",
        city: allContractData
          ? {
              label: allContractData?.cmpCity,
              value: allContractData?.cmpCityId,
            }
          : "",
        country: allContractData
          ? {
              label: allContractData?.cmpCountry,
              value: allContractData?.cmpCountryId,
            }
          : "",
        pocName: allContractData?.pocName,
        pocContactNo: allContractData?.pocContactNo,
        pocEmailId: allContractData?.pocEmailID,
        state: allContractData
          ? {
              label: allContractData?.cmpState,
              value: allContractData?.cmpStateId,
            }
          : "",
        apostilleType: allContractData
          ? {
              label: allContractData?.apostilleName,
              value: allContractData?.apostilleId,
            }
          : "",
        custodianName: allContractData?.contractCustodianDetailsModel
          ? {
              label:
                allContractData?.contractCustodianDetailsModel?.custodianName,
              value:
                allContractData?.contractCustodianDetailsModel
                  ?.custodianEmpCode,
            }
          : "",
        fileLocation: allContractData?.contractCustodianDetailsModel
          ? {
              label:
                allContractData?.contractCustodianDetailsModel
                  ?.custodianFileLocation,
              value:
                allContractData?.contractCustodianDetailsModel
                  ?.custodianFileLocation,
            }
          : "",
        // minEffectiveDate: convertFromUnix(allContractData?.keyEffectiveDate),
        // effectiveDate: convertFromUnix(allContractData?.keyEffectiveDate),
        // expiryDate: convertFromUnix(allContractData?.keyExpiryDate),
        // renewalEffectiveDate: convertFromUnix(
        //   allContractData?.renewalEffectiveDate
        // ),
        // renewalExpiryDate: convertFromUnix(allContractData?.renewalExpiryDate),
        minEffectiveDate:
          allContractData?.statusName === "Expired"
            ? convertFromUnix(+allContractData?.keyExpiryDate + 86400)
            : convertFromUnix(+allContractData?.keyEffectiveDate + 86400),
        effectiveDate: null,
        expiryDate: null,
        renewalEffectiveDate: null,
        renewalExpiryDate: null,
      };
      reset(newDataObj);
      setGlobalObjectId(allContractData?.globalObjectId);
      setRenewId(allContractData?.id);
    }
  }, [allContractData]);

  const breadCrumbData = [
    {
      route: "",
      name: "Renewal",
    },
  ];

  return (
    <>
      {location?.state?.cameFrom === "active-contract" && (
        <PageTitle
          title={`Renewal Contract ${allContractData?.contractId}`}
          buttonTitle=""
          breadCrumbData={breadCrumbData}
          bg={true}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-8 py-8 rounded-b bg-white shadow relative">
          {/* <div>
            <p>Contract Reference {allContractData?.contractId}</p>
          </div> */}

          {location?.state?.cameFrom == "active-contract" && (
            <div className="col-span-12 mt-4">
              <label
                htmlFor="creditCompany"
                className="inline-block  font-medium  text-lg"
              >
                <Link
                  to={`/details-screen/${contractId}`}
                  state={{
                    type: type,
                    typeOf: "Contract",
                    contractType: contractType,
                    // typeOf: info.row?.original?.typeOfApproval,
                  }}
                  className="ml-4 cursor-pointer text-blue-600 text-lg"
                >
                  Contract renewal For &nbsp;{allContractData?.contractId}
                  {/* {location?.state?.refValue} */}
                </Link>
              </label>
              <hr className="my-8" />
            </div>
          )}
          <DepartmentForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            control={control}
            selectedID={setSelectedID}
            setInciDetails={setInciDetails}
            getCompanyDetails={getCompanyDetails}
            setValue={setValue}
            inciDetails={inciDetails}
            errorMessage={errorMessage}
            disableValue={
              location?.state?.cameFrom == "active-contract" || cameFromProps
            }
            setError={setError}
            clearErrors={clearErrors}
            getValues={getValues}
            locationId={locationnId}
          />

          <hr className="my-8" />

          <KeyDatesForm
            contractType={"renewal"}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            control={control}
            getValues={getValues}
            setValue={setValue}
            isExpired={true}
          />

          <UploadMediaCMS
            register={register}
            handleSubmit={handleSubmit}
            globalObjectId={globalObjectId}
            disabled={false}
            name="Upload Contract"
            isEdit={isEdit}
            mandate={true}
            errors={errors}
            uploadFor={"Renewal Document"}
            id={renewId}
            type={"Contract"}
            isAddendum={false}
            isRenew={true}
          />

          <hr className="my-8" />

          <PartyDetails
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            customStyles={customStyles}
            control={control}
            employeeID={setEmployeeID}
            selectedID={selectedID}
            setSelectedID={setSelectedID}
            companyDetails={companyDetails}
            employeeDetails={employeeDetails}
            setValue={setValue}
            reset={reset}
            getEmployeeDetails={getEmployeeDetails}
          />

          <hr className="my-8" />

          <CustodianDetails
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            customStyles={customStyles}
            control={control}
          />
        </div>
        <div className="form-actions my-5">
          <button
            onClick={
              () => navigate(-1)
              // navigate(`/contract-list-active`)
              // navigate(-1)
            }
            type="button"
            class="py-2.5 px-8 me-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-8 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Save
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <SuccessModal
          title={`${allContractData?.companyName} contract renewal submitted successfully!`}
          showSuccessModal={showSuccessModal}
          setShowSuccessModal={(data) => setShowSuccessModal(data)}
          handleResponse={handleSuccess}
        />
      )}

      {isOpen && (
        <AlertModal
          title={`Are you sure? You are about to renew the following contract ${allContractData?.companyName}`}
          extraTitle={`It will be sent for L1 approval`}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowSuccessModal}
          confirmPost={handleContract}
          updateName="Approve"
        />
      )}

      <ToastContainer />
    </>
  );
};

export default RenewalContract;
