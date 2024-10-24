import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchContractById,
  updateContract,
  addContract,
} from "../../../Services/contractTypeMastersServices";
import PageTitle from "../../Common/PageTitle";
import Modal from "../../Modal";
import { getUnitId } from "../../../utils/functions";
import Select from "react-select";
import SuccessModal from "../../Common/ModalPopups/SuccessModal";

export const AddContractType = () => {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [documentDetails, setDocumentDetails] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [statusOptionsVal, setStatusOptionsVal] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
  } = useForm();
  useEffect(() => {
    if (id && documentDetails) {
      reset({
        contractType: documentDetails?.contractType,
        isActive: {
          value: documentDetails?.isActive,
          label: documentDetails?.isActive ? "Active" : "Inactive",
        },
      });
      setStatusOptionsVal(documentDetails?.isActive);
    }
  }, [id, reset, documentDetails]);
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

  const getDocumentsDetails = async (id) => {
    try {
      const documentDetails = await fetchContractById({ id: id });
      if (documentDetails?.data?.length && documentDetails?.success) {
        setDocumentDetails(documentDetails?.data[0]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getDocumentsDetails(id);
  }, [id]);

  const handleConfirm = async (data) => {
    const unitId = getUnitId();
    const dataToAdd = {
      ...formData,
      isActive: statusOptionsVal,
      locationId: unitId,
    };
    if (id) {
      dataToAdd.id = id;
    }
    try {
      if (id) {
        const codeMaster = await updateContract({ data: dataToAdd });
        if (codeMaster?.success) {
          setSuccess(true);
          // Navigate(`/master-management/contracttype-master`);
        }
      } else {
        const codeMaster = await addContract({ data: dataToAdd });
        if (codeMaster?.success) {
          setSuccess(true);
          // Navigate(`/master-management/contracttype-master`);
          reset();
        }
      }
    } catch (error) {
      // setIsOpen(true);
      setValue("isCaptain", false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      //setErrorForCaptain(error?.response?.data?.errorMessage);
    }
    setModalOpen(false);
  };

  const onSubmit = (data) => {
    setFormData(data);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const location = useLocation();
  const titleForBreadCrumb = location?.pathname?.includes("edit-contract-type")
    ? "Edit"
    : location?.pathname?.includes("add-contract-type")
    ? "Add"
    : "";
  const title = `Contract Type Master`;

  let breadCrumbData;
  if (location?.pathname?.includes("add-contract-type")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/contracttype-master",
        name: "Contract Type Master",
      },
      { route: "", name: `${titleForBreadCrumb} Contract Type` },
    ];
  } else {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/contracttype-master",
        name: "Contract Type Master",
      },
      { route: "", name: `${titleForBreadCrumb} Contract` },
    ];
  }
  return (
    <>
      <ToastContainer />
      <PageTitle title={title} breadCrumbData={breadCrumbData} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content-wrapper">
          <h3 className="flex items-center mb-3 text-xl font-semibold">
            {titleForBreadCrumb} Contract Type
          </h3>
          <div className="px-8 py-8 bg-white border rounded-lg shadow">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Contract Type <span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="contractType"
                    {...register("contractType", {
                      required: "This field is required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Name should contain only letters and spaces",
                      },
                      maxLength: {
                        value: 100,
                        message: "Name must not be more than 100 character",
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
                  {errors?.contractType && (
                    <p className="text-sm text-red-400">
                      {errors?.contractType?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Contract Status <span className="ml-1 text-red-400">*</span>
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
                  {errors?.isActive && (
                    <p className="text-sm text-red-400">
                      {errors?.isActive?.message}
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

          {/* {isOpen && (
          <AlertModal
            title="Are you sure you want to save the Document?"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setShowSuccessModal={setShowSuccessModal}
            confirmPost={() => {
                onSubmit();
              }}
          />
        )} */}
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        title={"Contract Type"}
        description={"Are you sure you want to save Contract type details?"}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
      {success && (
        <SuccessModal
          title={
            id
              ? "Contract type updated successfully"
              : "Contract type saved successfully"
          }
          showSuccessModal={success}
          setShowSuccessModal={setSuccess}
          handleResponse={() => {
            Navigate(`/master-management/contracttype-master`);
          }}
        />
      )}
    </>
  );
};
