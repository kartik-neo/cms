
export const USER_ACCESSIBLE_CODES =
  "/emergencycode/Emergency/GetUserAccessibleCodes";
export const LOGGEDIN_USER_ROLE = "/iam/Authentication/GetLoggedInUserRoles";

//EscalationMatrixMaster
export const ESC_MATRIX_GET_BY_CODE_ID =
  "/emergencycode/EscalationMatrixMaster/GetByCodeId";
export const ESC_MATRIX_GET_BY_ID =
  "/emergencycode/EscalationMatrixMaster/GetById";
export const ESC_MATRIX_UPSERT = "/emergencycode/EscalationMatrixMaster/Upsert";
export const ESS_MATRIX_GET_ALL =
  "/emergencycode/EscalationMatrixMaster/GetAll";
export const ESCALATION_MATRIX_DELETE_BY_ID = "/cms/EscalationMatrix/Delete";

export const ESCALATION_MATRIX_GET_BY_DEPARTMENT_ID =
  "/cms/EscalationMatrix/GetAll";
export const ESCALATION_MATRIX_UPDATE = "/cms/EscalationMatrix/Update";

// ApprovalMatrix

export const APPROVAL_MATRIX_GET_BY_DEPARTMENT_ID =
  "/cms/ApprovalMatrix/GetAll";
export const APPROVAL_MATRIX_DELETE_BY_ID = "/cms/ApprovalMatrix/Delete";
export const APPROVAL_MATRIX_UPDATE = "/cms/ApprovalMatrix/Update";

//External
export const GET_PATIENT_BY_IP = "/iam/External/GetPatientByIp";
export const GET_PATIENT_BY_MR = "/iam/External/GetPatientByMrNo";
export const GET_EMPLOYEE_BY_ID = "/iam/External/GetEmployeeByIdOrName";
export const GET_CREDIT_COMPANY_BY_ID = "/iam/External/creditcompanies";
export const GET_INSURANCE_COMPANY_BY_ID = "/iam/External/insurancecompanies";
export const GET_FILE_LOCATIONS = "/iam/KeyPair/GetLocationsByUnit";
export const GET_TARIFF_LIST = "/iam/External/tariffs";
export const GET_MATERIAL_LIST = "/iam/External/material";
export const GET_SERVICES_LIST = "/iam/External/services";
export const LOCATION_ID = "/iam/KeyPair/GetLocationsByUnit";
export const GET_COUNTRIES = "/iam/KeyPair/countries";
export const GET_STATES = "/iam/KeyPair/states";
export const GET_CITIES = "/iam/KeyPair/cities";
export const GET_DEPARTMENTS = "/iam/External/GetDepartmentMaster";
export const GET_ALL_UNITS = "/iam/KeyPair/GetHospitalOrganizations";
export const GET_LOCATIONS = "/iam/KeyPair/GetLocationsByUnit";
export const VERIFY_SESSION = "/iam/Authentication/VerifySession";
export const LOGOUT_SESSION = "/iam/Authentication/Logout";
export const GET_MENU_LIST = "/iam/Authentication/GetMenulist?moduleName=cms";
export const GET_MODULE_GROUP_MENU =
  "/iam/Permission/GetModuleMenuGroups?moduleId=8";
export const GET_LOGGEDIN_USER = "/iam/Authentication/LoggedInUser";
export const ASSIGN_ROLE_TO_USER = "/iam/User/AssignRoleToUser";
export const GET_LOGGEDIN_USER_DETAILS = "/iam/User/loggeduserdetails";
export const CREATE_LOGGED_USER = "/cms/LoggedUsers/Create";
export const GET_ORGNISATIONS = "/iam/KeyPair/GetAllOrganizations"

//S3 signedURL
export const S3_SIGNED_URL = "cms/Attachment/GetSignedURL/";
export const UPLOAD_ATTACHMENT = "/cms/Attachment/UploadAttachment/";
export const ALL_ATTACHMENT = "/cms/Attachment/GetAllByGlobalObjectId";
export const VIEW_ATTACHMENT = "/cms/Attachment/GetAll";
export const DELETE_ATTACHMENT = "/cms/Attachment/Delete";

// Audit logs
export const AUDIT_GET_BY_ID = "/cms/NotificationReport/AuditGetById";

//Create Company
export const CREAT_COMPANY = "cms/CompanyMaster/Create";
export const UPDATE_COMPANY = "cms/CompanyMaster/Update";
export const COMPANY_BY_ID = "cms/CompanyMaster/GetById";
export const COMPANY_LIST = "cms/CompanyMaster/GetAll";
export const COMPANY_DELETE = "cms/CompanyMaster/Delete";

// Document Masterlete";

export const CREATE_DOCUMENT = "cms/DocumentMaster/Create";
export const UPDATE_DOCUMENT = "cms/DocumentMaster/Update";
export const DOCUMENT_BY_ID = "cms/DocumentMaster/GetById";
export const DOCUMENT_LIST = "cms/DocumentMaster/GetAll";
export const DOCUMENT_DELETE = "cms/DocumentMaster/Delete";

// Contract Type Master
export const CREATE_CONTRACT = "cms/ContractMaster/Create";
export const UPDATE_CONTRACT = "cms/ContractMaster/Update";
export const CONTRACT_BY_ID = "cms/ContractMaster/GetById";
export const CONTRACT_LIST = "cms/ContractMaster/GetAll";
export const CONTRACT_DELETE = "cms/ContractMaster/Delete";

// ApostilleMaster
export const CREATE_APOSTILLE = "cms/ApostilleMaster/Create";
export const UPDATE_APOSTILLE = "cms/ApostilleMaster/Update";
export const ASPOSTILLE_BY_ID = "cms/ApostilleMaster/GetById";
export const APOSTILLE_LIST = "cms/ApostilleMaster/GetAll";
export const APOSTILLE_DELETE = "cms/ApostilleMaster/Delete";

export const APPROVAL_GET_ALL = "cms/ApprovalMatrix/GetAll";

// MOU-Aggregator
export const CREATE_AGGRERATOR = "cms/MOUAggregator/Create";
export const UPDATE_AGGRERATOR = "cms/MOUAggregator/Update";
export const DELETE_AGGRERATOR = "cms/MOUAggregator/Delete";
export const GET_AGGREGATOR_DETAIL = "cms/MOUAggregator/GetById";
export const ADD_ADDENDUM_RENEWAL_AGGREGATOR =
  "cms/MOUAggregator/AddAddendumRenewal";

// Mou

export const CREATE_MOU_TPA = "cms/MOUContract/Create";
export const UPDATE_MOU_TPA = "cms/MOUContract/Update";
export const CREATE_MOU_CORPORATE = "";
export const CREATE_MOU_AGGREGATOR = "";
export const MOU_AGGREGATOR_APPROV_REJECT =
  "/cms/MOUAggregatorApproval/ApproveReject";

export const MOU_LIST = "/cms/MOUContract/GetAll";
export const DELETE_MOU = "/cms/MOUContract/Delete";
export const GET_MOU_DETAIL = "cms/MOUContract/GetById";
export const MOU_PENDING_LIST = "cms/MOUContract/GetPendingApproval";
// contract
export const CONTRACT_GET = "cms/Contract/GetById";
export const CONTRACT_APPROVAL = "cms/ContractApproval/Approve";
export const CONTRACT_REJECT = "cms/ContractApproval/Reject";

// Contract

export const CREATE_CONTRACT_FORM = "cms/Contract/Create";
export const UPDATE_CONTRACT_FORM = "cms/Contract/Update";
export const CONTRACT_GETALL = "cms/Contract/GetAllFilters";
export const DELETE_CONTRACT = "/cms/Contract/Delete";
export const CONTRACT_PENDINGLIST = "cms/Contract/GetPendingApproval";

// Dashboard
export const DASHBOARD = "cms/DashboardActivity/GetMOUContractCounts";
export const DASHBOARD_CONTRACT = "cms/DashboardActivity/GetContractCounts";

// posttermination
export const POST_TERMINATION = "cms/Termination/Create";
export const UPDATE_POST_TERMINATION = "cms/Termination/Update";
export const TERMINATION = "cms/Termination/TerminateContract";
export const WITHDRAW = "cms/Termination/WithdrawTermination";

// Country
export const COUNTRY = "iam/KeyPair/countries";

// Report
export const NOTIFICATION = "cms/NotificationReport/GetAll";
export const AUDIT_GET_ALL = "cms/NotificationReport/AuditGetAll";
export const AUDITLOG_EMPLOYEE = "cms/LoggedUsers/GetAll";

export const retainerOptionData = [
  { label: "Weekly", value: 1 },
  { label: "Monthly", value: 2 },
  { label: "Quaterly", value: 3 },
  { label: "Yearly", value: 4 },
];

export const GET_APPROVAL_DEPARTMENT =
  "cms/ApprovalMatrix/GetApprovalDepartmentDetails";
