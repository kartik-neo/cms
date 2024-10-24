import React, {useState } from "react";
import { useForm } from "react-hook-form";
import { convertIntoUnix, getUnitId } from "../../utils/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
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

const CreateContract = ({ type }) => {
  const navigate = useNavigate();

  const unitId = getUnitId();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [globalObjectId, setGlobalObjectId] = useState(null);
  const [data, setData] = useState();
  const [selectedID, setSelectedID] = useState();
  const [employeeID, setEmployeeID] = useState();
  const [companyDetails, setcompanyDetails] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [inciDetails, setInciDetails] = useState("");
  const [id, setId] = useState(null);

  const unitName = localStorage.getItem("unitName");
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
      locationId: unitId,
      locationName: unitName,
      departmentId: data?.department?.value,
      departmentName: data?.department?.valueToUse,

      //contractTypeId: 2,
      // if other then 0 and value as typed value
      contractTypeId: parseInt(data?.contractType?.value),
      contractTypeOther: data?.contractType?.label,

      companyId: data?.contractWith?.value,
      // when addendum then we have to send it bu passing contractID
      // contractReference: data?.contractWith?.label,
      contractReference: "",

      isDeleted: false,
      contractId: "",

      reference: data?.refNo,

      apostilleId: apostilleResult,

      retainerContractId: data?.retainerContract?.value,
      retainerContractName: data?.retainerContract?.label,
      // terms: withoutTrimmedData,
      terms: data?.termsConditions,
      // terms: inciDetails,

      keyEffectiveDate: data?.effectiveDate
        ? convertIntoUnix(data?.effectiveDate)
        : "-",
      keyExpiryDate: data?.expiryDate ? convertIntoUnix(data?.expiryDate) : "-",
      renewalEffectiveDate: data?.renewalEffectiveDate
        ? convertIntoUnix(data?.renewalEffectiveDate)
        : "-",
      renewalExpiryDate: data?.renewalExpiryDate
        ? convertIntoUnix(data?.renewalExpiryDate)
        : "-",

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
      cmpStateId: data?.states?.value.toString(),
      cmpState: data?.states?.label,
      cmpCityId: data?.city?.value.toString(),
      cmpCity: data?.city?.label,
      cmpCountryId: data?.country?.value.toString(),
      cmpCountry: data?.country?.label,
      pocName: data?.pocName,
      pocContactNo: data?.pocContactNo,
      pocEmailID: data?.pocEmailId,
      globalObjectId: 0,
      isClassified: type == "Classified" ? true : false,
      isActive: true,
      previousContractId: "",
      contractStatusType: "New",
      contractCustodianDetailsModel: {
        cId: 0,
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-8 py-8 rounded-b bg-white shadow relative">
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
            customStyles={customStyles}
            errorMessage={errorMessage}
            setError={setError}
            clearErrors={clearErrors}
            getValues={getValues}
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
            // watch={watch}
            handleSubmit={handleSubmit}
            globalObjectId={globalObjectId}
            disabled={false}
            name="Upload Contract"
            mandate={true}
            errors={errors}
            uploadFor={"Contract Document"}
            id={id}
            type={"Contract"}
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
            onClick={() => navigate("/contract-list")}
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
          title={
            type == "Classified"
              ? "Classified contract created successfully!"
              : "Contract created successfully!"
          }
          showSuccessModal={showSuccessModal}
          setShowSuccessModal={(data) => setShowSuccessModal(data)}
          handleResponse={() =>
            type == "Classified"
              ? navigate("/contract-classified-list")
              : navigate("/contract-list")
          }
        />
      )}

      {isOpen && (
        <AlertModal
          title={
            type == "Classified"
              ? `Are you sure you want to create classified contract?`
              : `Are you sure you want to create contract with ${data?.contractWith?.label}?`
          }
          extraTitle={`It will be sent for L1 approval`}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowSuccessModal}
          confirmPost={handleContract}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default CreateContract;
