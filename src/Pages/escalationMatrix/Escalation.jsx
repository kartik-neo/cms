import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  deleteEscalationMatrixById,
  updateEscalationMatrix,
} from "../../Services/escalationMatrixService";
import SuccessModal from "../../Components/Common/ModalPopups/SuccessModal";
import { Input } from "../../Pages/escalationMatrix/Input";

import AlertModal from "../../Components/Common/ModalPopups/AlertModal";
import PageTitle from "../../Components/Common/PageTitle";
import {  getUnitId } from "../../utils/functions";
import { toast } from "react-toastify";


export const Escalation = ({
  matrixCode,
  viewOnly,
  datas,
  setTriggerApiCall,
  escalationMatrixMasterByColorId,
  type,
}) => {
  const navigate = useNavigate();
  const { Id, departName, contractType } = useParams();
  const unitId = getUnitId();
  const unitName = localStorage.getItem("unitName");
  const [showPopup, setShowPopup] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [errorMsg, setErrorMsg] = useState(false);

  const [data, setData] = useState();
  const [person1, setPerson1] = useState();
  const [person2, setPerson2] = useState();
  const [person3, setPerson3] = useState();
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState([]);

  useEffect(() => {
    if (datas) {
      setData(datas);
      // setPerson1({
      //   empid: datas?.p1Id,
      //   name: datas?.p1Name,
      //   email: datas?.p1Email,
      //   mobile: datas?.p1Mobile,
      // });
      // setPerson2({
      //   empid: datas?.p2Id,
      //   name: datas?.p2Name,
      //   email: datas?.p2Email,
      //   mobile: datas?.p2Mobile,
      // });
      // setPerson3({
      //   empid: datas?.p3Id,
      //   name: datas?.p3Name,
      //   email: datas?.p3Email,
      //   mobile: datas?.p3Mobile,
      // });
    }
  }, [datas]);

  const location = useLocation();
  const titleForBreadCrumb = location?.pathname?.includes(
    "edit-escalation-matrix/MOU"
  )
    ? `Edit ${departName}`
    : location?.pathname?.includes("edit-escalation-matrix/Contract")
    ? `Edit ${departName}`
    : location?.pathname?.includes("edit-escalation-matrix/Classified")
    ? `Edit`
    : "";
  const title = `Company Master List `;
  let breadCrumbData;

  if (location?.pathname?.includes("edit-escalation-matrix/MOU")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/escalation-matrix-mou",
        name: "Escalation Matrix-MOU",
      },
      { route: "", name: `${titleForBreadCrumb} ` },
    ];
  }
  if (location?.pathname?.includes("edit-escalation-matrix/Contract")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/escalation-matrix-contract",
        name: "Escalation Matrix-Contract",
      },
      { route: "", name: `${titleForBreadCrumb} ` },
    ];
  }
  if (location?.pathname?.includes("edit-escalation-matrix/Classified")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/escalation-matrix-classified",
        name: "Escalation Matrix-Classified",
      },
      { route: "", name: `${titleForBreadCrumb} ` },
    ];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data1 = parseInt(person1?.skipDays == undefined ? 0 : person1?.skipDays);
    const data2 = parseInt(person2?.skipDays == undefined ? 0 : person2?.skipDays);
    const data3 = parseInt(person3?.skipDays == undefined ? 0 : person3?.skipDays);
    const empcode1 = person1?.empId;
    const empcode2 = person2?.empId;
    const empcode3 = person3?.empId;
    let errorFound = false;

    let validations;
    let validateEmpCode;

    if (data2 == 0 && data3 == 0) {
      validations = true;
    } else if (data3 == 0) {
      validations = data2 > data1;
      if (!validations) {
        setMessage("Escalation 2 should be greater than Escalation 1 *");
      }
    } else if (data2 == 0) {
      validations = data3 > data1;
      if (!validations) {
        setMessage("Escalation 3 should be greater than Escalation 1 *");
      }
    } else if (data1 && data2 && data3) {
      validations = data3 > data2 && data2 > data1;
      if (!validations) {
        if (data1 >= data2 && data1 >= data3) {
          setMessage(
            "Escalation 2 & Escalation 3 should be greater than Escalation 1*"
          );
        } else if (data1 >= data2 && data1 <= data3) {
          setMessage("Escalation2 should be greater than Escalation1 *");
        } else if (data1 >= data3 && data1 <= data2) {
          setMessage("Escalation3 should be greater than Escalation1 *");
        } else if (data2 >= data1 && data2 >= data3) {
          setMessage("Escalation3 should be greater than Escalation2 *");
        } else if (data2 <= data1 && data2 <= data3) {
          setMessage("Escalation2 should be greater than Escalation1 *");
        } else if (data2 >= data3 && data2 <= data1) {
          setMessage(
            "Escalation3 should be greater than Escalation2 & Escalation 2 should be greater than Escalation 1 *"
          );
        } else if (data3 >= data1 && data3 <= data2) {
          setMessage("Escalation3 should be greater than Escalation 2 *");
        } else if (data3 >= data2 && data3 <= data1) {
          setMessage("Escalation3 should be greater than Escalation 1 *");
        } else if (data3 <= data1 && data3 <= data2) {
          setMessage(
            "Escalation3 should be greater than Escalation1 & Escalation 2 *"
          );
        }
      }
    }

    if (empcode2 == undefined && empcode3 == undefined) {
      validateEmpCode = true;
    } else if (empcode3 == undefined) {
      validateEmpCode = empcode1 !== empcode2;
    } else if (empcode2 == undefined) {
      validateEmpCode = empcode1 != empcode3;
    } else {
      validateEmpCode = (empcode1 != empcode2) != empcode3;
    }

    if (!validations) {
      setErrorMsg(true);
      // setMessage(
      //   "Escalation3 should be greater than Escalation2, and Escalation2 should be greater than Escalation1 *"
      // );
      errorFound = true;
    } 
    else if (!validateEmpCode) {
      setErrorMsg(true);
      setMessage("Duplicate values are not allowed *");
      errorFound = true;
    } else if (empcode2 == undefined && empcode3 == undefined) {
      // console.log("hello");
      // additional code goes here
    }

    if (errorFound) {
      return false;
    } else {
      setIsOpen(true);
      setErrorMsg(false);
      setMessage("");
    }
  };

  const handleResponse = async () => {
    if (datas) {
      const dataValue = datas?.data && datas?.data[0];
      const dataToUpdate = {
        locationId: dataValue?.locationId ? dataValue?.locationId : unitId,
        locationName: dataValue?.locationName
          ? dataValue?.locationName
          : unitName,
        departmentId: dataValue?.departmentId ? dataValue?.departmentId : Id,
        departmentName: dataValue?.departmentName
          ? dataValue?.departmentName
          : departName,
        contractType: dataValue?.contractType
          ? dataValue?.contractType
          : contractType,
        EscalationMatrixModel: [
          {
            ...person1,
            isActive: true,
          },
          person2
            ? {
                ...person2,
                // skipDays: 0,
                isActive: true,
              }
            : null,
          person3
            ? {
                ...person3,
                // skipDays: 0,
                isActive: true,
              }
            : null,
        ].filter(Boolean),
      };

      const originalIds = data?.data?.[0]?.escalationMatrixModel?.map(
        (emp) => emp.id
      );
      const updatedIds = dataToUpdate?.EscalationMatrixModel?.map(
        (emp) => emp.id
      );

      const deletedIds = originalIds?.filter((id) => !updatedIds.includes(id));
      setDeletedId(deletedIds);

      if (deletedIds) {
        deletedIds?.forEach((id) => handleDelete(id));
      }

      updateEscalationMatrix(dataToUpdate);
      setShowPopup(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteEscalationMatrixById({ id: id });
     
    } catch (error) {
      toast.error(error.message ?? "Error while deleting escalation matrix", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      {title && type == "Classified" ? (
        <PageTitle
          title={`Escalation Matrix - ${type} `}
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      ) : (
        <PageTitle
          title={`Escalation Matrix - ${type} - ${departName} `}
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      )}
      {data && (
        <form onSubmit={handleSubmit}>
            <div className="bg-white shadow rounded-lg p-4">
                <table class="table-fixed w-full table-borderless">
                    <thead>
                        <tr>
                            <th className="p-3" style={{ width: "30%" }}></th>
                            <th className="p-3" style={{ width: "45%" }}>
                            Person Responsible
                            </th>
                            <th className="p-3" style={{ width: "45%" }}>
                            Trigger After
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-3">
                            Escalation 1<span className="ml-1 text-red-400">*</span>
                            </td>
                            <Input
                            setData={setData}
                            data={data}
                            pIndex={"1"}
                            persons={person1}
                            setPersons={setPerson1}
                            setDisableSave={setDisableSave}
                            viewOnly={viewOnly}
                            />
                        </tr>
                        {type !== "Classified" && (
                            <>
                            <tr>
                                <td className="p-3">Escalation 2</td>
                                <Input
                                setData={setData}
                                data={data}
                                pIndex={"2"}
                                persons={person2}
                                person3={person3}
                                setPersons={setPerson2}
                                setDisableSave={setDisableSave}
                                viewOnly={viewOnly}
                                />
                            </tr>
                            <tr>
                                <td className="p-3">Escalation 3</td>
                                <Input
                                setData={setData}
                                data={data}
                                pIndex={"3"}
                                persons={person3}
                                setPersons={setPerson3}
                                setDisableSave={setDisableSave}
                                viewOnly={viewOnly}
                                />
                            </tr>
                        </>
                    )}
                    </tbody>
                   
                </table>
            </div>
            {errorMsg && (
                <p className="error-message text-sm text-red-500 font-medium">
                    {message}
                </p>
            )}
            <div className="px-3 my-3 action-buttons text-end my-8">
                {viewOnly ? (
                    <button
                        onClick={() => navigate(-1)}
                        type="submit"
                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-8 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        Back
                    </button>
                ) : (
                <>
                    <button
                        onClick={() => navigate(-1)}
                        type="button"
                        class="py-2.5 px-8 me-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-8 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        Save
                    </button>
                </>
                )}
            </div>
        </form>
      )}
      {showPopup && (
        <SuccessModal
          title="Escalation updated successfully"
          showSuccessModal={showPopup}
          setShowSuccessModal={setShowPopup}
          handleResponse={() => {
            if (type == "MOU") {
              navigate("/master-management/escalation-matrix-mou");
            }
            if (type == "Contract") {
              navigate("/master-management/escalation-matrix-contract");
            }
            if (type == "Classified") {
              navigate("/master-management/escalation-matrix-classified");
            }
          }}
        />
      )}
      {isOpen && (
        <AlertModal
          title="Are you sure you want to update Escalation matrix?"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowPopup}
          confirmPost={handleResponse}
        />
      )}
    </>
  );
};
