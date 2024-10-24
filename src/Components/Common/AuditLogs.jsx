import React, { useEffect, useState } from "react";
import { getAuditGetById } from "../../Services/uploadService";
import {
  formatDateTime,
} from "../../utils/functions";
import { toast } from "react-toastify";


const dateColumns =  ["KeyEffectiveDate", 
  "KeyExpiryDate" ,
  "RenewalEffectiveDate", 
  "RenewalExpiryDate", 
  "ValidityDateFrom", 
  "ValidityDateTo", 
  "RenewalDateFrom", 
  "RenewalDateTo" ]

const formatUnixTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString(); // Format the date as a human-readable string (date only)
};

const formatObject = (obj,propertyName=null) => {
  
  if (typeof obj !== "object" || obj === null) {
    if (!isNaN(obj) && 
    // Number(obj) > 1000000000 && 
    propertyName) {
      return formatUnixTimestamp(Number(obj));
    }
    return obj;
  }

  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${formatObject(value)}`)
    .join(", ");
};

const AuditLogs = ({ id, type, print }) => {
  const [auditLogsData, setAuditLogsData] = useState();

  const getAuditLogs = async (id) => {
    try {
      const response = await getAuditGetById(id, type);
      if (response?.data) {
        setAuditLogsData(response?.data);
      }
    } catch (e) {
      toast.error("Error while fetching audit logs", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    id && getAuditLogs(id);
  }, [id]);

  const iconColor = "fill-emerald-500";

  return (
    <div className="mt-8 bg-white mb-8 rounded-b shadow">
      <div className="ext-xl font-semibold p-4 bg-gray-600 text-white rounded flex justify-between items-center">
        <span className="text-lg font-semibold">Audit Logs</span>
      </div>

      <div
        className={`${
          !print ? "max-h-[400px]" : ""
        } overflow-y-auto p-5 audit-log-list`}
      >
        {auditLogsData &&
          auditLogsData?.map((step, index) => (
            <div key={index} className="relative log-entry mb-5 pb-1">
              <div className="flex items-start space-x-4 mb-3 relative">
                <div className="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow border md:order-1">
                    <svg
                      className={iconColor}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                    >
                      <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                    </svg>
                  </div>
                </div>
                <div className="text-slate-500 ml-14">
                  <span className="text-gray-900 font-bold block leading-tight">
                    {step?.action ? step?.action : "-"}
                  </span>
                  <time className="text-sm font-medium text-gray-500"></time>
                  <p className="text-sm leading-tight">
                    <span className="text-gray-500">
                      {step?.activityType ? `${step?.activityType} by -` : ""}{" "}
                      {step?.actionBy ? `${step?.actionBy} ,` : ""}
                      {step?.actionOn ? formatDateTime(step?.actionOn) : "-"}
                      {step?.changedValues && 
                      !(
                      JSON.parse(step?.changedValues)?.length == 1 
                    
                      && !JSON.parse(step?.changedValues)[0]?.NewValue?.length 
                      && !JSON.parse(step?.changedValues)[0]?.OldValue?.length 
                      )
                      && JSON.parse(step?.changedValues)?.length > 0 
                      ? 
                      (
                        <div>
                          <span className="font-bold">Changed values:</span>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div className="font-bold">Attribute</div>
                            <div className="font-bold">Old Value</div>
                            <div className="font-bold">New Value</div>
                            {Array.isArray(JSON.parse(step?.changedValues)) &&
                              JSON.parse(step?.changedValues)?.map(
                                (change, i) => {
                                  const formatRetainerContract = (value) => {
                                    switch (formatObject(value)) {
                                      case 1:
                                        return "Weekly";
                                      case 2:
                                        return "Monthly";
                                      case 3:
                                        return "Quarterly";
                                      case 4:
                                        return "Yearly";
                                      default:
                                        return "-";
                                    }
                                  };
                                  return (
                                    <React.Fragment key={i}>
                                      {!(Array.isArray(change.OldValue) && change.OldValue.length === 0 && 
                                          Array.isArray(change.NewValue) && change.NewValue.length === 0) ?
                                        <>
                                          <div>{change.PropertyName}</div>
                                          {change?.PropertyName === "Terms" ? (
                                        <>
                                          <div
                                            className="break-words"
                                            dangerouslySetInnerHTML={{
                                              __html: formatObject(
                                                change.OldValue
                                              ),
                                            }}
                                          />
                                          <div
                                            className="break-words"
                                            dangerouslySetInnerHTML={{
                                              __html: formatObject(
                                                change.NewValue
                                              ),
                                            }}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <div>
                                            {change.PropertyName ===
                                            "RetainerContractId"
                                              ? formatRetainerContract(
                                                  change.OldValue
                                                )
                                              : (change.OldValue !== undefined && change.OldValue !== null)
                                              ? (change.OldValue === true ? "Yes" : change.OldValue === false ? "No" : (dateColumns.includes(change.PropertyName) ? formatObject(change.OldValue,change.PropertyName):formatObject(change.OldValue)))
                                              : "-"}
                                          </div>
                                          <div>
                                            {change.PropertyName ===
                                            "RetainerContractId"
                                              ? formatRetainerContract(
                                                  change.NewValue
                                                )
                                              : (change.NewValue !== undefined && change.NewValue !== null)
                                              ?  (change.NewValue === true ? "Yes" : change.NewValue === false ? "No" : (dateColumns.includes(change.PropertyName) ? formatObject(change.NewValue,change.PropertyName):formatObject(change.NewValue)))
                                              : "-"}
                                          </div>
                                        </>
                                      )}
                                        </>  
                                        : ""
                                      }
                                    </React.Fragment>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      ) 
                      : 
                      (
                        ""
                      )}


                      {step?.rejectReason ? (
                        <div>
                          <span className="font-bold">Rejection remarks:</span>{" "}
                          {step?.rejectReason}
                        </div>
                      ) : (
                        ""
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AuditLogs;
