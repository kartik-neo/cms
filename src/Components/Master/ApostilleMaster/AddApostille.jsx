import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addApostille,
  updateApostille,
  fetchApostilleById,
} from "../../../Services/apostilleMasterservice";
import { toast, ToastContainer } from "react-toastify";
import PageTitle from "../../Common/PageTitle";
import Modal from "../../Modal";
import { getUnitId } from "../../../utils/functions";
import Select from "react-select";
import SuccessModal from "../../Common/ModalPopups/SuccessModal";

export const AddApostille = () => {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(null);
  const [apostilleDetails, setApostilleDetails] = useState({});
  const [statusOptionsVal, setStatusOptionsVal] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
  } = useForm();
  useEffect(() => {
    if (id && apostilleDetails) {
      reset({
        name: apostilleDetails?.name,
        isActive: {
          value: apostilleDetails?.isActive,
          label: apostilleDetails?.isActive ? "Active" : "Inactive",
        },
      });
      setStatusOptionsVal(apostilleDetails?.isActive);
    }
  }, [id, reset, apostilleDetails]);

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

  const getApostilleDetails = async (id) => {
    try {
      const apostilleDetails = await fetchApostilleById({ id: id });
      if (apostilleDetails?.data?.length && apostilleDetails?.success) {
        setApostilleDetails(apostilleDetails?.data[0]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getApostilleDetails(id);
  }, [id]);

  const handleConfirm = async (data) => {
    const unitId = getUnitId();
    const LocationName = localStorage.getItem("unitName");
    const dataToAdd = {
      // id :0
      ...formData,
      isActive: statusOptionsVal,
      locationId: unitId,
      LocationName: LocationName,
    };
    if (id) {
      dataToAdd.id = id;
    }
    try {
      if (id) {
        const codeMaster = await updateApostille({ data: dataToAdd });
        if (codeMaster?.success) {
          setSuccess(true);
        }
      } else {
        const codeMaster = await addApostille({ data: dataToAdd });
        if (codeMaster?.success) {
          setSuccess(true);
          // Navigate(`/master-management/apostille-master`)
          // reset();
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
  const titleForBreadCrumb = location?.pathname?.includes("edit-apostille")
    ? "Edit"
    : location?.pathname?.includes("add-apostille")
    ? "Add"
    : "";
  const title = `Apostille Master`;

  let breadCrumbData;
  if (location?.pathname?.includes("add-apostille")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/apostille-master",
        name: "Apostille Master",
      },
      { route: "", name: `${titleForBreadCrumb} Apostille` },
    ];
  } else {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/apostille-master",
        name: "Apostille Master",
      },
      { route: "", name: `${titleForBreadCrumb} Apostille` },
    ];
  }
  return (
    <>
      <ToastContainer />
      <PageTitle title={title} breadCrumbData={breadCrumbData} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="content-wrapper">
          <h3 className="flex items-center mb-3 text-xl font-semibold">
            {titleForBreadCrumb} Apostille
          </h3>
          <div className="px-8 py-8 bg-white border rounded-lg shadow">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Apostille Name<span className="ml-1 text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    {...register("name", {
                      required: "This field is required",
                      pattern: {
                        value: /^[A-Za-z0-9 ]+$/,
                        message: "Special Characters not allowed",
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
            </div>
            <br />
            <br />
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="form-field">
                  <label htmlFor="" className="inline-block mb-2 text-gray-500">
                    Apostille Status{" "}
                    <span className="ml-1 text-red-400">*</span>
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
            title="Are you sure you want to save the Apostille?"
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
        title={"Apostille"}
        description={"Are you sure you want to save Apostille details?"}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />

      {success && (
        <SuccessModal
          title="Apostille details saved successfully"
          showSuccessModal={success}
          setShowSuccessModal={setSuccess}
          handleResponse={() => {
            Navigate(`/master-management/apostille-master`);
          }}
        />
      )}
    </>
  );
};
