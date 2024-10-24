export const USER_PERMISSION = [
  "EMS.Dashboard.View",
  "EMS.DashboardBlue.View",
  "EMS.DashboardMockDrill.View",

  "EMS.Emergency.View",
  "EMS.Emergency.Create",
  "EMS.Emergency.Edit",
  "EMS.Emergency.Delete",

  "EMS.EmergencyMockDrill.View",
  "EMS.EmergencyMockDrill.Create",
  "EMS.EmergencyMockDrill.Edit",

  "EMS.CodeMaster.View",
  "EMS.CodeMaster.Edit",

  "EMS.CodeTeamMaster.View",
  "EMS.CodeTeamMaster.Create",
  "EMS.CodeTeamMaster.Edit",
  "EMS.CodeTeamMaster.Delete",

  "EMS.CodeTeamMember.View",
  "EMS.CodeTeamMember.Create",
  "EMS.CodeTeamMember.Edit",
  "EMS.CodeTeamMember.Delete",

  "EMS.EscalationMatrix.View",
  "EMS.EscalationMatrix.Create",
  "EMS.EscalationMatrix.Edit",

  "EMS.YouShouldKnow.View",

  "EMS.Report.View",

  "EMS.EmergencyReport.Download",
  "EMS.EmergencyReport.List",

  "EMS.EmergencyReportMock.Download",
  "EMS.EmergencyReportMock.List",


  "EMS.SurvivalReport.Download",
  "EMS.SurvivalReport.List",

  "EMS.Verification.View",
  "EMS.Verification.Edit",

  "EMS.ActionItemClosure.View",
  "EMS.ActionItemClosure.Edit",

];

// export const MENU_PERMISSIONS = {
//   EMS: {
//     Dashboard: {
//       View: "EMS.Dashboard.View",
//     },
//     DashboardBlue: {
//       View: "EMS.DashboardBlue.View",
//     },
//     DashboardMockDrill: {
//       View: "EMS.DashboardMockDrill.View",
//     },
//     Emergency: {
//       View: "EMS.Emergency.View",
//       Create: "EMS.Emergency.Create",
//       Edit: "EMS.Emergency.Edit",
//     },
//     EmergencyMockDrill: {
//       View: "EMS.EmergencyMockDrill.View",
//       Create: "EMS.EmergencyMockDrill.Create",
//       Edit: "EMS.EmergencyMockDrill.Edit",
//     },
//     CodeMaster: {
//       View: "EMS.CodeMaster.View",
//       Edit: "EMS.CodeMaster.Edit",
//     },
//     CodeTeamMaster: {
//       View: "EMS.CodeTeamMaster.View",
//       Create: "EMS.CodeTeamMaster.Create",
//       Edit: "EMS.CodeTeamMaster.Edit",
//       Delete: "EMS.CodeTeamMaster.Delete",
//     },
//     CodeTeamMember: {
//       View: "EMS.CodeTeamMember.View",
//       Create: "EMS.CodeTeamMember.Create",
//       Edit: "EMS.CodeTeamMember.Edit",
//       Delete: "EMS.CodeTeamMember.Delete",

//     },
//     EscalationMatrix: {
//       View: "EMS.EscalationMatrix.View",
//       Create: "EMS.EscalationMatrix.Create",
//       Edit: "EMS.EscalationMatrix.Edit",
//     },
//     YouShouldKnow: {
//       View: "EMS.YouShouldKnow.View",
//     },
//     Report: {
//       View: "EMS.Report.View",
//     },
//     Verification: {
//       View: "EMS.Verification.View",
//       Edit: "EMS.Verification.Edit",
//     },
//     ActionItemClosure: {
//       View: "EMS.ActionItemClosure.View",
//       Edit: "EMS.ActionItemClosure.Edit",
//     },
//     EmergencyReport: {
//       Download: "EMS.EmergencyReport.Download",
//       List: "EMS.EmergencyReport.List",
//     },
//     EmergencyReportMock: {
//       Download: "EMS.EmergencyReportMock.Download",
//       List: "EMS.EmergencyReportMock.List",
//     },
//     SurvivalReport: {
//       Download: "EMS.SurvivalReport.Download",
//       List: "EMS.SurvivalReport.List",
//     },
//   },
// };


export const MENU_PERMISSIONS = {
  CMS:  {
      Dashboard: {
        View: "CMS.Dashboard.View"
      },
      MOUContract: {
        Create: "CMS.MOUContract.Create",
        Edit: "CMS.MOUContract.Edit",
        Delete: "CMS.MOUContract.Delete",
        Approval: "CMS.MOUContract.Approval",
        ViewAll: "CMS.MOUContract.ViewAll",
        ViewActive: "CMS.MOUContract.ViewActive",
        ViewTerminated: "CMS.MOUContract.ViewTerminated",
        ViewPendingApproval: "CMS.MOUContract.ViewPendingApproval",
        ViewRejected: "CMS.MOUContract.ViewRejected",

      },
      Contract: {
        Create: "CMS.Contract.Create",
        Edit: "CMS.Contract.Edit",
        Delete: "CMS.Contract.Delete",
        Approval: "CMS.Contract.Approval",
        ViewAll: "CMS.Contract.ViewAll",
        ViewActive: "CMS.Contract.ViewActive",
        ViewTerminated: "CMS.Contract.ViewTerminated",
        ViewPendingApproval: "CMS.Contract.ViewPendingApproval",
        ViewRejected: "CMS.Contract.ViewRejected",

      },
      ContractClassified: {
        Create: "CMS.ContractClassified.Create",
        Edit: "CMS.ContractClassified.Edit",
        Delete: "CMS.ContractClassified.Delete",
        Approval: "CMS.ContractClassified.Approval",
        ViewAll: "CMS.ContractClassified.ViewAll",
        ViewPendingApproval: "CMS.ContractClassified.ViewPendingApproval",

      },
      Notification: {
        View: "CMS.Notification.View"
      },
      AuditLog: {
        View: "CMS.AuditLog.View"
      },
      CompanyMaster: {
        View: "CMS.CompanyMaster.View",
        Create: "CMS.CompanyMaster.Create",
        Edit: "CMS.CompanyMaster.Edit",
        Delete: "CMS.CompanyMaster.Delete"
      },
      DocumentMaster: {
        View: "CMS.DocumentMaster.View",
        Create: "CMS.DocumentMaster.Create",
        Edit: "CMS.DocumentMaster.Edit",
        Delete: "CMS.DocumentMaster.Delete"
      },
      ApostilleMaster: {
        View: "CMS.ApostilleMaster.View",
        Create: "CMS.ApostilleMaster.Create",
        Edit: "CMS.ApostilleMaster.Edit",
        Delete: "CMS.ApostilleMaster.Delete"
      },
      ApprovalMatrixMOU: {
        View: "CMS.ApprovalMatrixMOU.View",
        Create: "CMS.ApprovalMatrixMOU.Create",
        Edit: "CMS.ApprovalMatrixMOU.Edit",
        Delete: "CMS.ApprovalMatrixMOU.Delete"
      },
      ApprovalMatrixContract: {
        View: "CMS.ApprovalMatrixContract.View",
        Create: "CMS.ApprovalMatrixContract.Create",
        Edit: "CMS.ApprovalMatrixContract.Edit",
        Delete: "CMS.ApprovalMatrixContract.Delete"
      },
      ApprovalMatrixClassified: {
        View: "CMS.ApprovalMatrixClassified.View",
        Create: "CMS.ApprovalMatrixClassified.Create",
        Edit: "CMS.ApprovalMatrixClassified.Edit",
        Delete: "CMS.ApprovalMatrixClassified.Delete"
      },
      EscalationMatrixMOU: {
        View: "CMS.EscalationMatrixMOU.View",
        Create: "CMS.EscalationMatrixMOU.Create",
        Edit: "CMS.EscalationMatrixMOU.Edit",
        Delete: "CMS.EscalationMatrixMOU.Delete"
      },
      EscalationMatrixContract: {
        View: "CMS.EscalationMatrixContract.View",
        Create: "CMS.EscalationMatrixContract.Create",
        Edit: "CMS.EscalationMatrixContract.Edit",
        Delete: "CMS.EscalationMatrixContract.Delete"
      },
      EscalationMatrixClassified: {
        View: "CMS.EscalationMatrixClassified.View",
        Create: "CMS.EscalationMatrixClassified.Create",
        Edit: "CMS.EscalationMatrixClassified.Edit",
        Delete: "CMS.EscalationMatrixClassified.Delete"
      },
      ContractType: {
        View: "CMS.ContractType.View",
        Create: "CMS.ContractType.Create",
        Edit: "CMS.ContractType.Edit",
        Delete: "CMS.ContractType.Delete"
      }
    }
    
  
}

export const allowedOrganization = [
  { id: 12, name: "Thane Hospital" },
  { id: 14, name: "Indore Hospital" },
  { id: 13, name: "Pune Hospital" },
  { id: 21, name: "QA Hospital" },
  { id: 15, name: "Pimple Nilak" },
  { id: 22, name: "QA_Org" },
];

export const adminUserRoleId = 50