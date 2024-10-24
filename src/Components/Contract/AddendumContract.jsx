import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  convertFromUnix,
  DateToUnixTimestamp,
} from "../../utils/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
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

const AddendumContract = ({
  type,
  contractId,
  cameFromProps,
}) => {
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
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState(null);
  const [locationnId, setLocationnId] = useState(null);
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
    const apostilleResult = data?.apostilleType?.map((d) => d.value).join(",");
    const payload = {
      id: 0,
      locationId: data?.locationId,
      locationName: data?.locationName,
      departmentId: data?.department?.value,
      departmentName: data?.department?.label,

      contractTypeId: parseInt(data?.contractType?.value),
      contractTypeOther: data?.contractType?.label,

      // contractTypeId: 2,
      // contractTypeOther: data?.contractType?.label,

      companyId: data?.contractWith?.value,
      contractId: allContractData?.contractId,

      // contractReference: allContractData?.id.toString(),
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

      // isClassified:
      //   location?.state?.contractType == "Classified" ? true : false,
      isClassified:
        location?.state?.contractType == "Classified"
          ? true
          : type == "Classified"
          ? true
          : false,
      isActive: true,
      isDeleted: false,
      globalObjectId: globalObjectId ?? 0,
      // status: 3,
      previousContractId: allContractData?.contractId,

      contractStatusType:
        location?.state?.contractType === "renewal" ? "Renew" : "Addendum",
      // contractStatusType: "Renew",
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
          setGlobalObjectId(contractData?.data[0]?.globalObjectId);
          setId(contractData?.data[0]?.id);
          setShowSuccessModal(true);
          setIsEdit(true);
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
      : type == "Classified"
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
      getContractDetailsById(location?.state?.contractId);
    } else {
      getContractDetailsById(contractId);
    }
  }, [contractId]);

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
              label: allContractData?.contractTypeOther,
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
        effectiveDate: convertFromUnix(allContractData?.keyEffectiveDate),
        expiryDate: convertFromUnix(allContractData?.keyExpiryDate),
        renewalEffectiveDate: convertFromUnix(
          allContractData?.renewalEffectiveDate
        ),
        renewalExpiryDate: convertFromUnix(allContractData?.renewalExpiryDate),
      };
      reset(newDataObj);
      setGlobalObjectId(allContractData?.globalObjectId);
      setId(allContractData?.id);
    }
  }, [allContractData]);

  const breadCrumbData = [
    {
      route: "",
      name: "Add Addendum ",
    },
  ];

  return (
    <>
      {location?.state?.cameFrom == "active-contract" && (
        <PageTitle
          title={
            location?.state?.contractType == "Classified"
              ? "Addendum Contract [Classified]"
              : `Addendum Contract ${allContractData?.contractId}`
          }
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
                Contract addendum For &nbsp;{allContractData?.contractId}
                {/* <Link
                  to={`/details-screen/${id}`}
                  className="ml-4 cursor-pointer text-blue-600 text-lg"
                > */}
                {location?.state?.refValue}
                {/* </Link> */}
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
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            control={control}
            getValues={getValues}
            setValue={setValue}
          />

          <UploadMediaCMS
            register={register}
            handleSubmit={handleSubmit}
            globalObjectId={globalObjectId}
            disabled={false}
            name="Upload Contract"
            uploadFor={"Addendum Document"}
            mandate={true}
            id={id}
            type={"Contract"}
            isAddendum={true}
            isRenew={false}
            errors={errors}
            isEdit={isEdit}
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
          title="Addendum contract created successfully!"
          showSuccessModal={showSuccessModal}
          setShowSuccessModal={(data) => setShowSuccessModal(data)}
          handleResponse={handleSuccess}
        />
      )}

      {isOpen && (
        <AlertModal
          title={`Are you sure? You are about to add addendum for the following contract ${allContractData?.companyName}`}
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

export default AddendumContract;
