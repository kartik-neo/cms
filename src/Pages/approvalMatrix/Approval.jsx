import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SuccessModal from "../../Components/Common/ModalPopups/SuccessModal";
import { Input } from "./Input";
import {
  deleteApprovalMatrixById,
  GetApprovalDepartmentDetails,
  updateApprovalMatrix,
} from "../../Services/approvalMatrixService";
import AlertModal from "../../Components/Common/ModalPopups/AlertModal";
import PageTitle from "../../Components/Common/PageTitle";
import { findRemovedRecords, getUnitId } from "../../utils/functions";
import { assignRoleToUser } from "../../Services/external";
import { toast } from "react-toastify";

const Approval = ({
  matrixCode,
  viewOnly,
  datas,
  setTriggerApiCall,
  escalationMatrixMasterByColorId,
  type,
  departmentName,
}) => {
  const navigate = useNavigate();
  const unitId = getUnitId();
  const unitName = localStorage.getItem("unitName");
  const { Id, departName, contractType } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [errorMsg, setErrorMsg] = useState(false);

  const [data, setData] = useState();
  const [person1, setPerson1] = useState();
  const [person2, setPerson2] = useState();
  const [person3, setPerson3] = useState();
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (data) {
  //     const dataValue = datas?.data && datas?.data[0];
  //     const dataToUpdate = {
  //       locationId: dataValue?.locationId,
  //       locationName: dataValue?.locationName,
  //       departmentId: dataValue?.departmentId,
  //       departmentName: dataValue?.departmentName,
  //       contractType: dataValue?.contractType,
  //       approvalMatrixModel: [
  //         {
  //           ...person1,
  //           isActive: true,
  //         },
  //         {
  //           ...person2,
  //           skipDays: 0,
  //           isActive: false,
  //         },
  //         {
  //           ...person3,
  //           skipDays: 0,
  //           isActive: true,
  //         },
  //       ],
  //     };
  //     updateApprovalMatrix(dataToUpdate);
  //     setShowPopup(true);
  //   } else {
  //     setErrorMsg(true);
  //     setMessage("");
  //     return false;
  //   }
  // };

  const location = useLocation();
  const titleForBreadCrumb = location?.pathname?.includes(
    "edit-approval-matrix/MOU"
  )
    ? `Edit ${departName}`
    : location?.pathname?.includes("edit-approval-matrix/Contract")
    ? `Edit ${departName}`
    : location?.pathname?.includes("edit-approval-matrix/Classified")
    ? `Edit `
    : "";
  const title = `Company Master List `;
  let breadCrumbData;

  if (location?.pathname?.includes("edit-approval-matrix/MOU")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/approval-matrix-mou",
        name: " Approval Matrix",
      },

      { route: "", name: `${titleForBreadCrumb} ` },
    ];
  }
  if (location?.pathname?.includes("edit-approval-matrix/Contract")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/approval-matrix-contract",
        name: "Approval Matrix-Contract",
      },
      { route: "", name: `${titleForBreadCrumb} ` },
    ];
  }
  if (location?.pathname?.includes("edit-approval-matrix/Classified")) {
    breadCrumbData = [
      {
        route: "",
        name: "Masters",
      },
      {
        route: "/master-management/approval-matrix-classified",
        name: " Approval Matrix-Classified",
      },
      { route: "", name: `${titleForBreadCrumb} ` },
    ];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // setIsOpen(true);
    const empcode1 = person1?.empId;
    const empcode2 = person2?.empId;
    const empcode3 = person3?.empId;
    let errorFound = false;
    if (empcode2 == undefined && empcode3 == undefined) {
    } else if (
      empcode1 == empcode2 ||
      empcode1 == empcode3 ||
      empcode2 == empcode3
    ) {
      setErrorMsg(true);
      setMessage("Duplicate values are not allowed *");
      errorFound = true;
    }
    if (!errorFound) {
      setIsOpen(true);
      setErrorMsg(false);
    }
  };

  const assignRole = async (data) => {
    try {
      const response = await assignRoleToUser(data);
      if (response.success) {
      }
    } catch (error) {
      toast.error("Error while assigning role", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleResponse = async () => {
    if (datas) {
      const dataValue = datas?.data && datas?.data[0];
      const approvalMatrixModel = [
        {
          ...person1,
          skipDays:
            person2 == undefined && person3 == undefined ? 0 : person1.skipDays,
          isActive: true,
        },
        person2
          ? {
              ...person2,
              skipDays: 0,
              isActive: true,
            }
          : null,
        person3
          ? {
              ...person3,
              skipDays: 0,
              isActive: true,
            }
          : null,
      ].filter(Boolean);
      const dataToUpdate = {
        locationId: dataValue?.locationId ? dataValue?.locationId : unitId,
        locationName: dataValue?.locationName
          ? dataValue?.locationName
          : unitName,
        departmentId: dataValue?.departmentId ? dataValue?.departmentId : Id,
        departmentName: dataValue?.departmentName
          ? dataValue?.departmentName
          : departName,
        contractType: parseInt(contractType),
        // contractType: dataValue?.contractType ? dataValue?.contractType: contractType,
        approvalMatrixModel: approvalMatrixModel,
      };

      const originalIds = data?.data?.[0]?.approvalMatrixModel?.map(
        (emp) => emp.id
      );
      const updatedIds = dataToUpdate?.approvalMatrixModel?.map(
        (emp) => emp.id
      );

      const deletedIds = originalIds?.filter((id) => !updatedIds.includes(id));

      if (deletedIds) {
        deletedIds?.forEach((id) => handleDelete(id));
      }

      const removedRecords = findRemovedRecords(
        data?.data?.[0]?.approvalMatrixModel,
        dataToUpdate?.approvalMatrixModel
      );

      const result = await updateApprovalMatrix(dataToUpdate);
      if (result?.success) {
        dataToUpdate?.approvalMatrixModel?.map(async (data) => {
          const roleName =
            contractType == "1"
              ? "CMS MOU Approver"
              : contractType == "2"
              ? "CMS Contract Approver"
              : "CMS Management User";
          const payload = {
            employeeCode: `${data?.empCode}`,
            roleName: roleName,
            action: "add", // add / remove
          };
          await assignRole(payload);
        });
        if (removedRecords?.length > 0) {
          removedRecords?.map(async (data) => {
            const result = await GetApprovalDepartmentDetails(
              data?.empCode,
              contractType
            );
            if (result?.totalCount < 2) {
              const roleName =
              contractType == "1"
                ? "CMS MOU Approver"
                : contractType == "2"
                ? "CMS Contract Approver"
                : "CMS Management User";
              const removePayload = {
                employeeCode: `${data?.empCode}`,
                roleName: roleName, //EMS Code Owner , EMS Team Captain
                action: "remove", // add / remove
              };
              await assignRole(removePayload);
            }
          });
        }
        setShowPopup(true);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteApprovalMatrixById({ id: id });
    
    } catch (error) {
      toast.error("Error while deleting approval matrix", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      {title && type == "Classified" ? (
        <PageTitle
          title={`Approval Matrix - ${type} `}
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      ) : (
        <PageTitle
          title={`Approval Matrix - ${type} - ${departName} `}
          buttonTitle=""
          breadCrumbData={breadCrumbData}
        />
      )}
      {data && (
        <form onSubmit={handleSubmit} novalidate>
            <div className="bg-white shadow rounded-lg p-4">
                <table class="table-fixed w-full table-borderless">
                    <thead>
                    <tr>
                        <th className="p-3" style={{ width: "30%" }}></th>
                        <th className="p-3" style={{ width: "45%" }}>
                        Person Responsible
                        </th>
                        <th className="p-3" style={{ width: "45%" }}>
                        Skip Approval after no response for the number of days
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="p-3">
                        Approval 1 <span className="ml-1 text-red-400">*</span>
                        </td>
                        <Input
                        setData={setData}
                        data={data}
                        pIndex={"1"}
                        persons={person1}
                        person1={person1}
                        setPersons={setPerson1}
                        setDisableSave={setDisableSave}
                        viewOnly={viewOnly}
                        personTwoValue={person2}
                        personThreeValue={person3}
                        />
                    </tr>
                    <tr>
                        <td className="p-3">Approval 2</td>
                        <Input
                        novalidate
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
                    {type !== "Classified" && (
                        <tr>
                        <td className="p-3">Approval 3</td>
                        <Input
                            novalidate
                            setData={setData}
                            data={data}
                            // person2={person2}

                            pIndex={"3"}
                            persons={person3}
                            setPersons={setPerson3}
                            setDisableSave={setDisableSave}
                            viewOnly={viewOnly}
                        />
                        </tr>
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
                type="button"
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
          title="Approval matrix updated successfully"
          showSuccessModal={showPopup}
          setShowSuccessModal={setShowPopup}
          handleResponse={() => {
            if (type == "MOU") {
              navigate("/master-management/approval-matrix-mou");
            }
            if (type == "Contract") {
              navigate("/master-management/approval-matrix-contract");
            }
            if (type == "Classified") {
              navigate("/master-management/approval-matrix-classified");
            }
          }}
        />
      )}
      {isOpen && (
        <AlertModal
          title="Are you sure you want to update Approval matrix?"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setShowSuccessModal={setShowPopup}
          confirmPost={handleResponse}
        />
      )}
    </>
  );
};

export default Approval;
