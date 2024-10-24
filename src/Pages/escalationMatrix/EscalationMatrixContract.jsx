import React, { useState, useEffect, useCallback } from "react";
import "../../Components/Layout/custom.css";
import { useLocation, useParams } from "react-router-dom";
import { fetchEscalarationMatrixDepartmentId } from "../../Services/escalationMatrixService";
import { Escalation } from "./Escalation";
import { getUnitId } from "../../utils/functions";
const EscalationMatrixContract = ({ viewOnly }) => {
  const { id, type } = useParams();
  const location = useLocation();
  const { data } = location.state || {};
  // const [datas, setDatas] = useState();
  const [verificationEscalation, setVerificationEscalation] = useState({});
  const [triggerApiCall, setTriggerApiCall] = useState(false);

  const escalationMatrixMasterByColorId = useCallback(async (id) => {
    try {
      const unitId = getUnitId();
      const response = await fetchEscalarationMatrixDepartmentId(
        unitId,
        data?.departmentId,
        data?.contractType
      );
      setVerificationEscalation(response);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [data?.departmentId, data?.contractType]);

  useEffect(() => {
    escalationMatrixMasterByColorId(id);
  }, [id,escalationMatrixMasterByColorId]);

  useEffect(() => {
    if (triggerApiCall) {
      escalationMatrixMasterByColorId();
    }
    setTriggerApiCall(false);
  }, [triggerApiCall,escalationMatrixMasterByColorId]);

  return (
    <>
        <Escalation
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

export default EscalationMatrixContract;
