import moment from "moment";
import {
  dayssDifference,
  convertFromUnix,
  convertUnixToDatee,
  formatDate,
  DateFromFullToReadable,
} from "./functions";

export function formatDateString(dateString) {
  // Parse the date string
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  // Format the date as dd/mm/yyyy
  return `${day}/${month}/${year}`;
}
export const convertFromUnix1 = (timestamp) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const getDepartment = (id, departments) => {
  const filteredDepartment = departments.find(
    (department) => department.code == id
  );
  const name = filteredDepartment?.name;

  return name;
  //    return filteredDepartment.code
};

export const convertTimestampToFormattedDate = (timestamp) => {
  if (!timestamp) {
    return "--";
  }
  // Convert to milliseconds by multiplying with 1000
  var date = new Date(timestamp * 1000);

  // Get date components
  var day = date.getDate();
  var month = date.getMonth() + 1; // Month starts from 0
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";

  // Adjust hours for AM/PM format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  var formattedDate =
    day + "/" + month + "/" + year + " " + hours + ":" + minutes + " " + ampm;

  return formattedDate;
};

export const generateTreatmentDoneColumns = (inputData) => {
  const maxTimes = inputData.reduce(
    (max, item) => Math.max(max, item.givenTime.length),
    0
  );

  const columns = [{ id: "drug", label: "Drug / Fluid / Rate" }];

  for (let i = 0; i < maxTimes; i++) {
    columns.push({ id: `time${i + 1}`, label: `Time / Dose` });
  }

  return columns;
};

const keyMapping = {
  ecgRhythmTime: "ECG Rhythm",
  defibrillatorJTime: "Defibrillator (J)",
  pacerMATime: "Pacer (MA)",
  modeofAirwayTime: "Mode of Airway",
  etcO2Time: "ETCO2",
};

export const generateIntervationColumns = (data) => {
  const numInterventions = data.length;

  const columns = [{ id: "drug", label: "Name" }];

  for (let i = 1; i <= numInterventions; i++) {
    columns.push({ id: `time${i}`, label: "Time" });
  }

  return columns;
};

export const convertTreatmentData = (inputData) => {
  return inputData.map((item, index) => {
    const { drugFluid, givenTime } = item;
    const formattedData = {
      id: index + 1,
      drug: drugFluid,
    };
    givenTime.forEach((timeData, i) => {
      formattedData[`time${i + 1}`] =
        `${timeData.time}/${timeData.dosage}` || "N/A";
    });
    return formattedData;
  });
};

export const convertInterventions = (interventions) => {
  const result = [];

  for (const timeKey in interventions[0]) {
    const obj = { id: result.length + 1, drug: keyMapping[timeKey] || timeKey };

    for (let i = 0; i < interventions.length; i++) {
      obj[`time${i + 1}`] = interventions[i][timeKey];
    }

    result.push(obj);
  }

  return result;
};

export const convertData = (inputArray) =>
  inputArray.map((item) => ({
    empId: item.empId,
    empName: item.empName,
    emergency: { id: item.emergencyId + 1 },
    empDesignation: item.empDesignation,
    empExt: item.empExt,
    empPhoneNum: item.empPhoneNum,
  }));

export const convertTimestampToDateString = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
    day < 10 ? "0" : ""
  }${day}`;
  return formattedDate;
};

export const checkAllActionTakenSubmitted = (data) => {
  let result = true;
  const ids = data?.actionItem
    ?.map((aItem) => {
      const ids = aItem?.actionAssignTo?.map((assignTo) => assignTo.id);
      return ids;
    })
    ?.flat();

  const submissions = data?.actionSubmission?.map(
    (submission) => submission?.actionAssignsToId
  );

  if (ids?.length != submissions?.length) {
    result = false;
  } else {
    for (let i = 0; i < ids?.length; i++) {
      if (!submissions.includes(ids[i])) {
        result = false;
        break;
      }
    }
  }
  return result;
};

export const colors = {
  Red: "bg-red-600",
  Pink: "bg-pink-600",
  Hazmat: "bg-green-600",
  Purple: "bg-purple-600",
  Black: "bg-black",
  Grey: "bg-gray-600",
  "Blue (Adult)": "bg-blue-600",
  "Blue (Peadiatric)": "bg-blue-600",
};

export const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2008;
  const options = [];

  for (let year = startYear; year < currentYear; year++) {
    const endYear = year + 1;
    options.push(`${year}-${endYear}`);
  }

  return options.reverse();
};

export const mouContractSegment = (
  ip,
  op,
  hc,
  netralaya,
  data,
  index,
  aggregator
) => {
  const empobj = [];
  if (ip) {
    empobj.push({
      // aggregatorNumber: aggregator ? index : 0,
      aggregatorId: 0,
      contractSegment: "IP",
      employee: data?.ipCoPaymentEmployee,
      dependent: data?.ipCoPaymentDependant,
    });
  }
  if (op) {
    empobj.push({
      // aggregatorNumber: aggregator ? index : 0,
      aggregatorId: 0,
      contractSegment: "OP",
      employee: data?.opCoPaymentEmployee,
      dependent: data?.opCoPaymentDependant,
    });
  }
  if (hc) {
    empobj.push({
      // aggregatorNumber: aggregator ? index : 0,
      aggregatorId: 0,
      contractSegment: "HC",
      employee: data?.hcCoPaymentEmployee,
      dependent: data?.hcCoPaymentDependant,
    });
  }
  if (netralaya) {
    empobj.push({
      // aggregatorNumber: aggregator ? index : 0,
      aggregatorId: 0,
      contractSegment: "Netralaya",
      employee: data?.netralayaCoPaymentEmployee,
      dependent: data?.netralayaCoPaymentDependant,
    });
  }

  return empobj;
};

export const mouContractSegmentUnits = (op, ip, hc, netralaya) => {
  const arr = [];

  if (ip) {
    arr.push("IP");
  }
  if (op) {
    arr.push("OP");
  }
  if (hc) {
    arr.push("HC");
  }
  if (netralaya) {
    arr.push("Netralaya");
  }

  return arr;
};

export const makeItProperObject = (response, contractType, openPreviewName) => {
  if (contractType == 1 || contractType == 2) {
    return {
      // contractCustodianDetails:response?.contractCustodianDetails,
      //     createdBy: response?.createdBy,
      //     createdOn:response?.createdOn,
      //     createdById: response?.createdById,
      // lastModifiedById: response?.lastModifiedById,
      // lastModifiedBy: response?.lastModifiedBy,
      // lastModifiedOn: response?.lastModifiedOn,
      // isDeleted: response?.isDeleted,

      // statusName:response?.statusName,
      // contractStatusType:response?.contractStatusType,
      // contractStatusTypeName:response?.contractStatusTypeName,
      // mouReference:response?.mouReference,
      // previousMouNumber:response?.previousMouNumber,
      unitId:response?.unitId,
      parentContractId:response?.parentContractId,
      globalObjectId: response?.globalObjectId,
      contractName: response?.contractName,
      contractStatusType: response?.contractStatusTypeName,
      mouContractId: response.mouContractId,
      mouId: response?.mouId,
      statusName: response?.statusName,
      isAddendumCreated: response?.isAddendumCreated,
      // status: response?.status,

      custodianName: response?.contractCustodianDetails?.custodianEmpCode
        ? {
            label: response?.contractCustodianDetails?.custodianName,
            value: response?.contractCustodianDetails?.custodianEmpCode,
          }
        : "",
      creditCompany: response?.creditCompanyId
        ? { label: response?.contractName, value: response?.creditCompanyId }
        : "",
      insuranceCompany: response?.insuranceCompanyId
        ? {
            label: response?.insuranceCompany,
            value: response?.insuranceCompanyId,
          }
        : "",
      op: response?.contractSegment?.includes("OP"),
      ip: response?.contractSegment?.includes("IP"),
      hc: response?.contractSegment?.includes("HC"),
      netralaya: response?.contractSegment?.includes("Netralaya"),
      coPaymentInPercent: response?.isCoPayment ? "yes" : "no",
      opCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "OP"
      )?.employee,
      opCoPaymentDependant: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "OP"
      )?.dependent,
      ipCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "IP"
      )?.employee,
      ipCoPaymentDependant: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "IP"
      )?.dependent,
      hcCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "HC"
      )?.employee,
      hcCoPaymentDependant: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "HC"
      )?.dependent,
      netralayaCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "Netralaya"
      )?.employee,
      netralayaCoPaymentDependant: response?.mouContractSegmentDetails?.find(
        (item) => item?.contractSegment == "Netralaya"
      )?.dependent,
      isValidityRenewal: response?.isValidityRenewal,
      validityDateFrom: response?.validityDateFrom
        ? convertFromUnix(response?.validityDateFrom)
        : "",
      validityDateTo: response?.validityDateTo
        ? convertFromUnix(response?.validityDateTo)
        : "",
      renewalFrom: response?.renewalDateFrom
        ? convertFromUnix(response?.renewalDateFrom)
        : "",
      renewalTo: response?.renewalDateTo
        ? convertFromUnix(response?.renewalDateTo)
        : "",
      discountTariff: {
        label: response?.contractDiscountOnTariff?.dotTariffName,
        value: response?.contractDiscountOnTariff?.dotTariffId,
      },
      opDiscount: response?.contractDiscountOnTariff?.dotop,
      ipDiscount: response?.contractDiscountOnTariff?.dotip,
      hcDiscount: response?.contractDiscountOnTariff?.dothc,
      netralayaDiscount: response?.contractDiscountOnTariff?.dotNetralaya,
      patientDeposit: response?.isPatientDeposit ? "yes" : "no",
      patientDepositInRupees: response?.patientDepositAmount,
      nonAdmissableService: response?.isNAMaterialService ? "yes" : "no",
      naMaterialService: response?.materialService?.length
        ? response?.materialService
        : "",
      paymentTerms: response?.paymentTermsDays,
      discountTransactionYear:
        response?.contractDiscountOnTariff?.dotTransactionYear,
      approvalDocuments: response?.approvalDocument?.length
        ? response?.approvalDocument
        : [],
      terminationDetails: response?.terminationDetails?.length
        ? response?.terminationDetails
        : "",
      addDetails: response?.contractCustodianDetails?.custodianDetails,
      fileLocation: response?.contractCustodianDetails?.custodianFileLocation
        ? {
            value: response?.contractCustodianDetails?.custodianFileLocation,
            label: response?.contractCustodianDetails?.custodianFileLocation,
          }
        : "",
      terminationStatuses: response?.terminationStatuses,
    };
  }

  if (contractType == 3) {
    const responseArr = response?.mouAggregatorDetail;
    const mainRes = response;
    const payload = responseArr?.map((response, index) => {
      return {
        // status: response?.status,
        // uploadFileAttachments_
        parentContractId:response?.parentContractId,
        isAddendumCreated: response?.isAddendumCreated,
        isRenewalCreated: response?.isRenewalCreated,
        aggregatorReference: response?.aggregatorReference,
        approvalMatrixModel: response?.approvalMatrixModel,
        approvalLogs: response?.contractAggregatorApprovalLogs,
        createdBy: response?.createdBy,
        createdOn: response?.createdOn,
        validityDateTo: response?.validityDateTo,
        contractAggregatorApprovalLogs:
          response?.contractAggregatorApprovalLogs,
        contractStatusType:response?.contractStatusType,
        contractStatusTypeName: response?.contractStatusTypeName,
        terminationDetails: response?.terminationDetails?.length
          ? response?.terminationDetails
          : [],
        statusName: response?.statusName,
        aggregatorNumber: response?.aggregatorNumber,
        aggregatorId: response?.aggregatorId,
        globalObjectId: mainRes?.globalObjectId,
        insuranceCompany: {
          label: response?.insuranceCompany,
          value: response?.insuranceCompanyId,
        },
        op: response?.contractSegment?.includes("OP"),
        ip: response?.contractSegment?.includes("IP"),
        hc: response?.contractSegment?.includes("HC"),
        netralaya: response?.contractSegment?.includes("Netralaya"),
        coPaymentInPercent: response?.isCoPayment ? "yes" : "no",
        opCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "OP"
        )?.employee,
        opCoPaymentDependant: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "OP"
        )?.dependent,
        ipCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "IP"
        )?.employee,
        ipCoPaymentDependant: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "IP"
        )?.dependent,
        hcCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "HC"
        )?.employee,
        hcCoPaymentDependant: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "HC"
        )?.dependent,
        netralayaCoPaymentEmployee: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "Netralaya"
        )?.employee,
        netralayaCoPaymentDependant: response?.mouContractSegmentDetails?.find(
          (item) => item?.contractSegment == "Netralaya"
        )?.dependent,
        renewal: response?.isValidityRenewal,
        unixvalidityFrom: response?.validityDateFrom,
        unixvalidityTo: response?.validityDateTo,
        validityDateFrom: response?.validityDateFrom
          ? openPreviewName == "Add Renew"
            ? ""
            : convertFromUnix(response?.validityDateFrom)
          : "",
        validityDateTo: response?.validityDateTo
          ? openPreviewName == "Add Renew"
            ? ""
            : convertFromUnix(response?.validityDateTo)
          : "",
        renewalFrom: response?.renewalDateFrom
          ? openPreviewName == "Add Renew"
            ? ""
            : convertFromUnix(response?.renewalDateFrom)
          : "",
        renewalTo: response?.renewalDateTo
          ? openPreviewName == "Add Renew"
            ? ""
            : convertFromUnix(response?.renewalDateTo)
          : "",
        discountTariff: {
          label: response?.contractDiscountOnTariff?.dotTariffName,
          value: response?.contractDiscountOnTariff?.dotTariffId,
        },
        discountTransactionYear:
          response?.contractDiscountOnTariff?.dotTransactionYear,
        opDiscount: response?.contractDiscountOnTariff?.dotop,
        ipDiscount: response?.contractDiscountOnTariff?.dotip,
        hcDiscount: response?.contractDiscountOnTariff?.dothc,
        netralayaDiscount: response?.contractDiscountOnTariff?.dotNetralaya,
        patientDeposit: response?.isPatientDeposit ? "yes" : "no",
        patientDepositInRupees: response?.patientDepositAmount,
        nonAdmissableService: response?.isNAMaterialService ? "yes" : "no",
        naMaterialService: response?.materialService?.length
          ? response?.materialService
          : "",
        paymentTerms: response?.paymentTermsDays,
        approvalDocuments: response?.approvalDocument?.length
          ? response?.approvalDocument
          : [],
        fileLocation: response?.contractCustodianDetails?.custodianFileLocation
          ? {
              value: response?.contractCustodianDetails?.custodianFileLocation,
              label: response?.contractCustodianDetails?.custodianFileLocation,
            }
          : "",
        custodianName: response?.contractCustodianDetails?.custodianEmpCode
          ? {
              label: response?.contractCustodianDetails?.custodianName,
              value: response?.contractCustodianDetails?.custodianEmpCode,
            }
          : "",
        addDetails: response?.contractCustodianDetails?.custodianDetails,
        terminationStatuses: response?.terminationStatuses,
      };
    });

  
    return {
      contractApprovalLogs: response?.contractApprovalLogs,
      aggregators: payload?.sort(
        (a, b) => a?.aggregatorNumber - b?.aggregatorNumber
      ),
      unitId:response?.unitId,
      contractName: response?.contractName,
      mouContractId: response.mouContractId,
      mouId: response?.mouId,
      statusName: response?.statusName,
      globalObjectId: mainRes?.globalObjectId,
    };
  }
};

export const bifurcateApprovelStatuse = (
  data,
  createdBy,
  createdOn,
  mouStatus,
  keyExpiryDate = null,
  typeOf
) => {
  let firstStatus = {
    date: createdOn ? formatDate(+createdOn * 1000) : "",
    title: `${typeOf || "Contract"} Created`,
    by: `${createdBy ? `By - ${createdBy}` : ""}`,
    updatedBy: "",
    iconColor: "",
    status: "Approved",
  };
  const lastStatusDate = keyExpiryDate ? dayssDifference(keyExpiryDate) : "";
  let lastStatus = {
    date: 
      (mouStatus == "Active" ||   mouStatus == "Expired") ? 
        // ? ""
        // : 
        (keyExpiryDate 
        ? `${
            lastStatusDate > 1
              ? lastStatusDate
              : lastStatusDate == 0
              ? ""
              : DateFromFullToReadable(+keyExpiryDate * 1000)
          } ${lastStatusDate > 1 ? "days" : ""}`
        : "" ) : "",
    title: `${mouStatus}`,
    by: `${
      mouStatus == "Active" || mouStatus == "Expired"  ? (
        lastStatusDate > 1
        ? `Expiring in`
        : lastStatusDate == 0
        ? "Expiring Today"
        : `Expired On`
      ) : ""
         
    }`,
    updatedBy: "",
    iconColor: "",
    status: `${
      mouStatus === "Rejected"
        ? mouStatus
        : mouStatus !== "Pending Approval"
        ? "Approved"
        : mouStatus
    }`,
  };

  const steps = [];
  data?.forEach((item) => {
    if (item?.approvedDate !== null) {
      steps.push({
        date: item?.approvedDate ? formatDate(+item?.approvedDate * 1000) : "",
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: item?.approvedBy ? `By - ${item?.approvedBy}` : "",
        updatedBy: "",
        status: item?.statusName,
      });
    }
  });

  const pendingStatus = data
    ?.filter((item) => item?.statusName === "Pending")
    ?.map((item) => {
      const lastApprovedDate =
        steps.length === 0 || steps[steps.length - 1].date === null
          ? firstStatus.date
          : steps[steps.length - 1].date;
      return {
        date: `Since ${moment().diff(
          moment(lastApprovedDate, "DD/MM/YYYY hh:mm A"),
          "days"
        )} days`,
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: "",
        updatedBy: "",
        status: item?.statusName,
      };
    });

  if (mouStatus === "Active") {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  } else {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  }
};

export const bifurcateTerminationStatuse = (
  data,
  createdBy,
  createdOn,
  mouStatus,
  typeOf,
  keyExpiryDate = null
) => {
  let firstStatus = {
    date: createdOn ? formatDate(+createdOn * 1000) : "",
    title: `${typeOf} Created`,
    by: `${createdBy ? `By - ${createdBy}` : ""}`,
    updatedBy: "",
    iconColor: "",
    status: "Approved",
  };
  const lastStatusDate = keyExpiryDate ? dayssDifference(keyExpiryDate) : "";
  let lastStatus = {
    date:
      mouStatus !== "Active"
        ? ""
        : keyExpiryDate
        ? `${
            lastStatusDate > 1
              ? lastStatusDate
              : formatDate(+keyExpiryDate * 1000)
          } ${lastStatusDate > 1 ? "days" : ""}`
        : "",
    title: `${mouStatus}`,
    by: `${
      mouStatus !== "Active"
        ? ""
        : lastStatusDate > 1
        ? "Expiring in"
        : "Expired On"
    }`,
    updatedBy: "",
    iconColor: "",
    status: `${mouStatus}`,
  };

  const steps = [];
  data?.forEach((item) => {
    if (item?.approvedDate !== null) {
      steps.push({
        date: item?.approvedDate ? formatDate(+item?.approvedDate * 1000) : "",
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: item?.approvedBy ? `By - ${item?.approvedBy}` : "",
        updatedBy: "",
        status: item?.statusName,
      });
    }
  });

  const pendingStatus = data
    ?.filter((item) => item?.statusName === "Pending")
    ?.map((item) => {
      const lastApprovedDate =
        steps.length === 0 || steps[steps.length - 1].date === null
          ? firstStatus.date
          : steps[steps.length - 1].date;
      return {
        date: `Since ${moment().diff(
          moment(lastApprovedDate, "DD/MM/YYYY hh:mm A"),
          "days"
        )} days`,
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: "",
        updatedBy: "",
        status: item?.statusName,
      };
    });

  if (mouStatus === "Active") {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  } else {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  }
};

export const bifurcateWithdrawalStatuse = (
  data,
  createdBy,
  createdOn,
  mouStatus,
  typeOf,
  keyExpiryDate = null,
  CategoryType,
  isAggregator
) => {
  let firstStatus = {
    date: createdOn ? formatDate(+createdOn * 1000) : "",
    title: `${CategoryType} ${
      typeOf === CategoryType
        ? ""
        : data?.aggregatorId
        ? `Aggregator ${typeOf}`
        : typeOf
    } Created`,
    by: `${createdBy ? `By - ${createdBy}` : ""}`,
    updatedBy: "",
    iconColor: "",
    status: "Approved",
  };
  const lastStatusDate = keyExpiryDate ? dayssDifference(keyExpiryDate) : "";
  let lastStatus = {
    date:
      mouStatus !== "Active"
        ? ""
        : keyExpiryDate
        ? `${
            lastStatusDate > 1
              ? lastStatusDate
              : formatDate(+keyExpiryDate * 1000)
          } ${lastStatusDate > 1 ? "days" : ""}`
        : "",
    title: `${mouStatus}`,
    by: `${
      mouStatus !== "Active"
        ? ""
        : lastStatusDate > 1
        ? "Expiring in"
        : "Expired On"
    }`,
    updatedBy: "",
    iconColor: "",
    status: `${mouStatus}`,
  };

  const steps = [];
  data?.terminationAggregatorApprovalLogs?.forEach((item) => {
    if (item?.approvedDate !== null) {
      steps.push({
        date: item?.approvedDate ? formatDate(+item?.approvedDate * 1000) : "",
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: item?.approvedBy ? `By - ${item?.approvedBy}` : "",
        updatedBy: "",
        status: item?.statusName,
      });
    }
  });

  const pendingStatus = data?.terminationAggregatorApprovalLogs

    ?.filter((item) => item?.statusName === "Pending")
    ?.map((item) => {
      const lastApprovedDate =
        steps.length === 0 || steps[steps.length - 1].date === null
          ? firstStatus.date
          : steps[steps.length - 1].date;
      return {
        date: `Since ${moment().diff(
          moment(lastApprovedDate, "DD/MM/YYYY hh:mm A"),
          "days"
        )} days`,
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: "",
        updatedBy: "",
        status: item?.statusName,
      };
    });

  if (mouStatus === "Active") {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  } else {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  }
};

export const bifurcateStatuses = (data, createdBy, createdOn, matrix) => {
  let firstStatus = {
    date: convertUnixToDatee(createdOn),
    title: `Contract Created`,
    by: `By - ${createdBy}`,
    updatedBy: "",
    iconColor: "",
    status: "Approved",
  };

  const steps = [];
  matrix?.map((item, index) => {
    let filteredData = data?.filter((ditem) => ditem?.level == item?.level);
    if (filteredData?.length) {
      if (index + 1 == matrix?.length) {
        if (filteredData[0]?.statusName != "Pending") {
          steps.push({
            date: filteredData[0]?.approvedDate
              ? convertUnixToDatee(filteredData[0]?.approvedDate)
              : "",
            title: `Active Contract`,
            by: `${
              filteredData[0]?.approvedBy
                ? `By - ${filteredData[0]?.approvedBy}`
                : ""
            }`,
            updatedBy: "",
            iconColor: "",
            status: `${filteredData[0]?.statusName}`,
          });
        } else {
          steps.push({
            date: filteredData[0]?.approvedDate
              ? convertUnixToDatee(filteredData[0]?.approvedDate)
              : "",
            title: `Approval L${filteredData[0]?.level} ${filteredData[0]?.statusName}`,
            by: `${
              filteredData[0]?.approvedBy
                ? `By - ${filteredData[0]?.approvedBy}`
                : ""
            }`,
            updatedBy: "",
            iconColor: "",
            status: `${filteredData[0]?.statusName}`,
          });
        }
      } else {
        steps.push({
          date: filteredData[0]?.approvedDate
            ? convertUnixToDatee(filteredData[0]?.approvedDate)
            : "",
          title: `Approval L${filteredData[0]?.level} ${filteredData[0]?.statusName}`,
          by: `${
            filteredData[0]?.approvedBy
              ? `By - ${filteredData[0]?.approvedBy}`
              : ""
          }`,
          updatedBy: "",
          iconColor: "",
          status: `${filteredData[0]?.statusName}`,
        });
      }
    } else {
      steps.push({
        date: "",
        title: `Approval L${index + 1} Pending`,
        by: "",
        updatedBy: "",
        iconColor: "",
        status: "Pending",
      });
    }
  });

  return [firstStatus, ...steps];
};

export const bifurcateTerminationStatus = (
  data,
  createdBy,
  createdOn,
  matrix
) => {
  let firstStatus = {
    date: convertUnixToDatee(createdOn),
    title: `Termination Document Uploaded`,
    by: `By - ${createdBy}`,
    updatedBy: "",
    iconColor: `fill-green-500`,
    status: "Approved",
  };

  const steps = [];
  const filteredData = data?.filter((item) => item?.type == "Terminated");
  const sortedData = filteredData[0]?.terminationApprovalLogs;
  matrix?.map((item, index) => {
    let filteredData = sortedData?.filter(
      (ditem) => ditem?.level == item?.level
    );
    if (filteredData?.length) {
      if (index + 1 == matrix?.length) {
        steps.push({
          date: filteredData[0]?.approvedDate
            ? convertUnixToDatee(filteredData[0]?.approvedDate)
            : "",
          title: `${
            filteredData[0]?.statusName == "Pending"
              ? `Termination L${filteredData[0]?.level} Pending`
              : "Active Contract"
          }`,
          by: `${
            filteredData[0]?.approvedBy
              ? `By - ${filteredData[0]?.approvedBy}`
              : ""
          }`,
          updatedBy: "",
          iconColor: "",
          status: `${filteredData[0]?.statusName}`,
        });
      } else {
        steps.push({
          date: filteredData[0]?.approvedDate
            ? convertUnixToDatee(filteredData[0]?.approvedDate)
            : "",
          title: `Termination L${filteredData[0]?.level} ${filteredData[0]?.statusName}`,
          by: `${
            filteredData[0]?.approvedBy
              ? `By - ${filteredData[0]?.approvedBy}`
              : ""
          }`,
          updatedBy: "",
          iconColor: "",
          status: `${filteredData[0]?.statusName}`,
        });
      }
    } else {
      steps.push({
        date: "",
        title: `Termination L${index + 1} Pending`,
        by: "",
        updatedBy: "",
        iconColor: "",
        status: "Pending",
      });
    }
  });

  return [firstStatus, ...steps];
};

export const bifurcateWithdrawStatus = (data, createdBy, createdOn, matrix) => {
  let firstStatus = {
    date: createdOn ? convertUnixToDatee(createdOn) : "",
    title: `Withdrawal Notice Uploaded`,
    by: `By - ${createdBy || ""}`,
    updatedBy: "",
    iconColor: `fill-green-500`,
    status: "Approved",
  };

  const steps = [];
  const filteredData = data?.filter((item) => item?.type == "Withdraw");
  const sortedData = filteredData[0]?.terminationApprovalLogs;
  matrix?.map((item, index) => {
    let filteredData = sortedData?.filter(
      (ditem) => ditem?.level == item?.level
    );
    if (filteredData?.length) {
      if (index + 1 == matrix?.length) {
        steps.push({
          date: filteredData[0]?.approvedDate
            ? convertUnixToDatee(filteredData[0]?.approvedDate)
            : "",
          title: `${
            filteredData[0]?.statusName == "Pending"
              ? `Withdrawal L${filteredData[0]?.level} Pending`
              : "Contract Terminated"
          }`,
          by: `${
            filteredData[0]?.approvedBy
              ? `By - ${filteredData[0]?.approvedBy}`
              : ""
          }`,
          updatedBy: "",
          iconColor: "",
          status: `${filteredData[0]?.statusName}`,
        });
      } else {
        steps.push({
          date: filteredData[0]?.approvedDate
            ? convertUnixToDatee(filteredData[0]?.approvedDate)
            : "",
          title: `Withdrawal L${filteredData[0]?.level} ${filteredData[0]?.statusName}`,
          by: `${
            filteredData[0]?.approvedBy
              ? `By - ${filteredData[0]?.approvedBy}`
              : ""
          }`,
          updatedBy: "",
          iconColor: "",
          status: `${filteredData[0]?.statusName}`,
        });
      }
    } else {
      steps.push({
        date: "",
        title: `Withdrawal L${index + 1} Pending`,
        by: "",
        updatedBy: "",
        iconColor: "",
        status: "Pending",
      });
    }
  });

  return [firstStatus, ...steps];
};

export const convertToDateStringg = (dateString) => {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  // Return the formatted date string "DD/MM/YYYY"
  return `${day}/${month}/${year}`;
};

export const validateAggregators = (
  pendingAggregators,
  sendAggregatorForRenewal
) => {
  const aggregatorIds = pendingAggregators?.map((item) => item?.aggregatorId);
  const sendAggregatorForRenewalIds = sendAggregatorForRenewal?.map(
    (item) => item?.aggregatorId
  );
  const remaining = [];

  aggregatorIds.map((item) => {
    if (!sendAggregatorForRenewalIds.includes(item)) {
      remaining.push(item);
    }
  });

  return remaining;
};

export const bifurcateAggregatorApprovalStatus = (
  data,
  createdBy,
  createdOn,
  mouStatus,
  keyExpiryDate = null,
  isAggregator = false,
  contractTypeName
) => {

  let firstStatus = {
    date: createdOn ? formatDate(+createdOn * 1000) : "",
    title: `${contractTypeName || ""} ${
      isAggregator ? "Aggregator" : "MOU"
    } Created`,
    by: `${createdBy ? `By - ${createdBy}` : ""}`,
    updatedBy: "",
    iconColor: "",
    status: "Approved",
  };


  const lastStatusDate = keyExpiryDate ? dayssDifference(keyExpiryDate) : "";
  let lastStatus = {
    date:
      (mouStatus == "Active" ||  mouStatus == "Expired") ?
      (keyExpiryDate
        ? `${
            lastStatusDate > 1
              ? lastStatusDate
              : lastStatusDate == 0
              ? ""
              : DateFromFullToReadable(+keyExpiryDate * 1000)
          } ${lastStatusDate > 1 ? "days" : ""}`:"")
       
        : "",
    title: `${mouStatus}`,
    by: `${
      (mouStatus == "Active" ||  mouStatus == "Expired") ? 
      (
        lastStatusDate > 1
        ? "Expiring in"
        : lastStatusDate == 0
        ? "Expiring Today"
        : "Expired On"
      ):""
         
    }`,
    updatedBy: "",
    iconColor: "",
    status: `${
      mouStatus === "Rejected"
        ? mouStatus
        : mouStatus !== "Pending Approval"
        ? "Approved"
        : mouStatus
    }`,
  };
  const steps = [];
  data?.forEach((item) => {
    if (item?.approvedDate !== null) {
      steps.push({
        date: item?.approvedDate ? formatDate(+item?.approvedDate * 1000) : "",
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: item?.approvedBy ? `By - ${item?.approvedBy}` : "",
        updatedBy: "",
        status: item?.statusName,
      });
    }
  });

  const pendingStatus = data
    ?.filter((item) => item?.statusName === "Pending")
    ?.map((item) => {
      const lastApprovedDate =
        steps.length === 0 || steps[steps.length - 1].date === null
          ? firstStatus.date
          : steps[steps.length - 1].date;
      return {
        date: `Since ${moment().diff(
          moment(lastApprovedDate, "DD/MM/YYYY hh:mm A"),
          "days"
        )} days`,
        title: `Approval L${item?.level} ${item?.statusName}`,
        by: "",
        updatedBy: "",
        status: item?.statusName,
      };
    });

  if (mouStatus === "Active") {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  } else {
    return [firstStatus, ...steps, ...pendingStatus, lastStatus];
  }
};

// Utility function to map data
// Utility function to map data
export const mapData = (data, key) => {
  let result = []
  if(key == "creditcompany"){
      result = data?.map((item) => ({
        value: item?.code,
        label: `${item.code} - ${item.name}`,
        valueToUse: `${item.name}`,
      }));
  }
  if(key == "insurancecompany"){
    result = data?.map((item) => ({
        value: item?.code,
        label: `${item.name}`,
      }));
  }
  if(key == "filelocation"){
    result = data.map((item) => ({
            value: item?.locationID,
            label: `${item.locationName}`,
          }));
  }
  if(key == "tarifflist"){
        result = data?.map((item) => ({
        value: item?.code,
        label: `${item.name}`,
      }));
  }
  return result
}
  // data.map(item => ({
  //   value: item[valueKey],
  //   label: item[labelKey]
  // }));