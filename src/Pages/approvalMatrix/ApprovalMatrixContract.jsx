import React, { useState, useEffect } from "react";
import "../../Components/Layout/custom.css";
import { useLocation, useParams } from "react-router-dom";

import Approval from "./Approval";
import { fetchApprovalMatrixDepartmentId } from "../../Services/approvalMatrixService";
import { getUnitId } from "../../utils/functions";

const ApprovalMatrixContract = ({ viewOnly }) => {
  const { id, type } = useParams();
  const location = useLocation();
  const { data } = location.state || {};
  const [verificationEscalation, setVerificationEscalation] = useState({});
  const [triggerApiCall, setTriggerApiCall] = useState(false);

  const escalationMatrixMasterByColorId = async (id) => {
    try {
      var unitId = getUnitId();
      const response = await fetchApprovalMatrixDepartmentId(
        unitId,
        data?.departmentId,
        data?.contractType
      );
      setVerificationEscalation(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    escalationMatrixMasterByColorId(id);
  }, [id]);

  useEffect(() => {
    if (triggerApiCall) {
      escalationMatrixMasterByColorId();
    }
    setTriggerApiCall(false);
  }, [triggerApiCall]);

  return (
    <>
          <Approval
            matrixCode={3}
            datas={verificationEscalation}
            setTriggerApiCall={setTriggerApiCall}
            escalationMatrixMasterByColorId={escalationMatrixMasterByColorId}
            viewOnly={viewOnly}
            type={type}
          />
    </>
  );
};

export default ApprovalMatrixContract;
