import React, { useState, useEffect, useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNavigate } from "react-router-dom";

import { usePermission } from "../App";
import {
  MENU_PERMISSIONS,
} from "../Constant/permissionConstant";
import { BsFilePdf } from "react-icons/bs";
import {
  fetchDashboard,
  fetchDashboardContract,
} from "../Services/dashboardServiceMou";
import MOUPendingList from "../Components/MOU/MOUPendingList";
import ContractPendingList from "../Components/Contract/ContractPendingList";
import { downloadPdf } from "../utils/pdfGenerator";
import useDays from "../hooks/useDays";
import UserContext from "../context/UserContext";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Dashboard = () => {
 
  const [mouData, setMouData] = useState([]);
  const [contract, setContract] = useState([]);
  const [contractData, setContractData] = useState(null);
  const [contractTypeData, setContractTypeData] = useState(null);

  const [mouContractData, setMouContractData] = useState(null);
  const [moucontractTypeData, setMoucontractTypeData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dateFromUnix, dateToUnix } = useDays(30);
  const { dateFromUnix: dateFromUnix1, dateToUnix: dateToUnix1 } = useDays(1);
  const { dateFromUnix: dateFromUnix60, dateToUnix: dateToUnix60 } = useDays(60);
  const { dateFromUnix: dateFromUnix90, dateToUnix: dateToUnix90 } = useDays(90);

  const Navigate = useNavigate();
  const {isAdmin} = useContext(UserContext) 
  const permissions = {
    viewMouPendingPermission: usePermission(MENU_PERMISSIONS?.CMS.MOUContract?.ViewPendingApproval),
    viewContractClassified: usePermission(MENU_PERMISSIONS?.CMS?.ContractClassified?.ViewAll),
    viewContractPendingPermission: usePermission(MENU_PERMISSIONS?.CMS.Contract?.ViewPendingApproval),
    viewContractPermission: usePermission(MENU_PERMISSIONS?.CMS.Contract?.ViewAll),
    viewMouPermission: usePermission(MENU_PERMISSIONS?.CMS.MOUContract?.ViewAll)
  };
  // const viewMouPendingPermission = usePermission(
  //   MENU_PERMISSIONS?.CMS.MOUContract?.ViewPendingApproval
  // );

  // const viewContractClassified = usePermission(
  //   MENU_PERMISSIONS?.CMS?.ContractClassified?.ViewAll
  // );

  // const viewContractPendingPermission = usePermission(
  //   MENU_PERMISSIONS?.CMS.Contract?.ViewPendingApproval
  // );

  // const viewContractPermission = usePermission(
  //   MENU_PERMISSIONS?.CMS.Contract?.ViewAll
  // );
  // const viewMouPermission = usePermission(
  //   MENU_PERMISSIONS?.CMS.MOUContract?.ViewAll
  // );

  // const active = ;
  const [activeTab, setActiveTab] = useState(permissions?.viewContractPermission
    ? "all"
    : permissions?.viewMouPermission
    ? "codeBlue"
    : null);


   
  
    const handleDocumentList = async (queryString = "") => {
      try {
        const documentList = await fetchDashboard(isAdmin);
        setMouData(documentList?.data);
        const mouSummaryData = {
          labels: [
            "Pending Approval",
            "Active MOU",
            "Inactive MOU",
            "Terminated MOU",
          ],
          datasets: [
            {
              data: [
                documentList?.data?.totalPendingApproval || null,
                documentList?.data?.totalActive || null,
                documentList?.data?.totalExpired || null,
                documentList?.data?.totalTerminated || null,
              ],
              backgroundColor: ["#6495ED", "#32CD32", "#D3D3D3", "#FF6347"],
            },
          ],
        };
        const mouTypeSummaryData = {
          labels: [
            "TPA Contracts",
            "Corporate Contracts",
            "Aggregator Contracts",
            "Addendum Contracts",
          ],
          datasets: [
            {
              data: [
                documentList?.data?.tpaCategoryType || null,
                documentList?.data?.corporateCategoryType || null,
                documentList?.data?.aggregatorCategoryType || null,
                documentList?.data?.addendumContractType || null,
              ],
              backgroundColor: ["#00a3ee", "#a891f7", "#ff7273", "#ff9d00"],
            },
          ],
        };
        setMouContractData(mouSummaryData);
        setMoucontractTypeData(mouTypeSummaryData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
  
  

    const handleDashboardContract = async (queryString = "") => {
      try {
        const documentList = await fetchDashboardContract(isAdmin);
        setContract(documentList?.data);
  
        const contractSummaryData = {
          labels: [
            "Pending Approval",
            "Active Contract",
            "Expired Contracts",
            "Terminated Contracts",
          ],
          datasets: [
            {
              data: [
                documentList?.data?.summaryPendingApproval || null,
                documentList?.data?.summaryActiveContract || null,
                documentList?.data?.summaryExpiredContract || null,
                documentList?.data?.summaryTerminatedContract || null,
              ],
              backgroundColor: ["#6495ED", "#32CD32", "#D3D3D3", "#FF6347"],
            },
          ],
        };
        const contractTypeSummaryData = {
          labels: [
            "Original Contracts",
            "Renewed Contracts",
            "Addendum Contracts",
          ],
          datasets: [
            {
              data: [
                documentList?.data?.orignalContract || null,
                documentList?.data?.renewdContract || null,
                documentList?.data?.addendumContract || null,
              ],
              backgroundColor: ["#00a3ee", "#a891f7", "#ff7273", "#ff9d00"],
            },
          ],
        };
        setContractData(contractSummaryData);
        setContractTypeData(contractTypeSummaryData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
  
  
  
  

  useEffect(() => {
    if(isAdmin != null){
      handleDocumentList();
      handleDashboardContract();
    }
  }, [isAdmin,activeTab]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
      datalabels: {
        display: true,
        color: "black",
        font: {
          weight: "bold",
        },
        formatter: (value) => value, // Display the value
      },
    },
  };
  const hasData = (data) => {
    return data?.datasets[0]?.data?.some((value) => value > 0);
  };
  // const totalContract = () => {
  //   Navigate(`/contract-list`, { state: { cameFrom: "dashboard" } });
  // };

  // const handleClick = () => {
  //   Navigate(`/contract-list-expired`, { state: { cameFrom: "dashboard" } });
  // };
  // const handleClickClissified = () => {
  //   Navigate(`/contract-classified-list?status=Expired`, {
  //     state: { cameFrom: "dashboard" },
  //   });
  // };
  // const totalContractClassified = () => {
  //   Navigate(`/contract-classified-list`, { state: { cameFrom: "dashboard" } });
  // };
  // const activeContractClassified = () => {
  //   Navigate(`/contract-classified-list?status=Active`, {
  //     state: { cameFrom: "dashboard" },
  //   });
  // };
  // const terminatedContract = () => {
  //   Navigate(`/contract-list-terminated`, { state: { cameFrom: "dashboard" } });
  // };
  // const activeContract = () => {
  //   Navigate(`/contract-list-active`, { state: { cameFrom: "dashboard" } });
  // };

  // const terminatedContractClassified = () => {
  //   Navigate(`/contract-classified-list?status=Terminated`, {
  //     state: { cameFrom: "dashboard" },
  //   });
  // };

  // const handleClickMou = () => {
  //   Navigate(`/mou-contract-list?status=Expired`, {
  //     state: { cameFrom: "dashboard" },
  //   });
  // };

  // const totalMou = () => {
  //   Navigate(`/mou-contract-list`, { state: { cameFrom: "dashboard" } });
  // };
  // const activeMou = () => {
  //   Navigate(`/mou-contract-list-active`, { state: { cameFrom: "dashboard" } });
  // };
  // const terminatedMou = () => {
  //   Navigate(`/mou-contract-list-terminated`, {
  //     state: { cameFrom: "dashboard" },
  //   });
  // };

  // const { dateFromUnix60, dateToUnix60 } = getUnixTimestamps(60);
  // const { dateFromUnix90, dateToUnix90 } = getUnixTimestamps(90);
  const TabContentContract = () => (
    <>
      <div id="dashboardPdf">
        {/* today's reported emergencies */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <h3 className="text-xl font-medium mt-3 mb-5">
              Contract at a glance
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-5">
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/contract-list`, { state: { cameFrom: "dashboard" } });
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Total <br />
                    Contracts
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {contract?.totalCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/contract-list-active`, { state: { cameFrom: "dashboard" } });
            }}
          >
            {/* <a href = "/cms/contract-list-active"> */}
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-success-100">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Active <br />
                    Contracts
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    <button className="text-success">
                      {contract?.totalActive}
                    </button>
                  </span>
                </div>
              </div>
            </div>
            {/* </a> */}
          </div>
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/contract-list-terminated`, { state: { cameFrom: "dashboard" } });
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-danger-100">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Terminated <br />
                    Contracts
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    <button className="text-danger">
                      {contract?.totalTerminated}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/contract-list-expired`, { state: { cameFrom: "dashboard" } });
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-gray-200">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Expired <br />
                    Contracts
                  </span>
                  <span class="text-4xl tracking-[-0.115rem] font-bold">
                    <button className="text-gray-500">
                      {contract?.totalExpired}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-10">
          <div className="col-span-6 md:col-span-4 lg:col-span-2 glance-card">
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5 pr-0">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Active <br />
                    Termination Notice
                  </span>
                  <span class="text-warning text-4xl tracking-[-0.115rem] font-bold">
                    {contract?.totalActiveTerminationNotice}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              // Navigate(`/contract-list?contractOptionId=3&status=Active&dateFrom=${dateFromUnix}&dateTo=${dateToUnix}&titleName=Expiring in 30 days`, { state: { cameFrom: "dashboard" } });
              Navigate(
                `/contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix}&dateTo=${dateToUnix}&titleName=Expiring in 30 days`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix,
                    dateTo: dateToUnix,
                    // status: "Active",
                    titleName: "Expiring in 30 days",
                    contractOptionId: 3,
                  },
                }
              );
            }}
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Expiring in <br />
                    &lt; 30 Days
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold text-warning">
                    {contract?.totalExpriringInThirtyDays}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              Navigate(
                `/contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix60}&dateTo=${dateToUnix60}&titleName=Expiring in 60 days`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix,
                    dateTo: dateToUnix,
                    // status: "Active",
                    titleName: "Expiring in 60 days",
                    contractOptionId: 3,
                  },
                }
              );
            }}
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Expiring in <br />
                    &lt; 60 Days
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {contract?.totalExpriringInSixtyDays}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              Navigate(
                `/contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix90}&dateTo=${dateToUnix90}&titleName=Expiring in 90 days`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix,
                    dateTo: dateToUnix,
                    // status: "Active",
                    titleName: "Expiring in 90 days",
                    contractOptionId: 3,
                  },
                }
              );
            }}
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Expiring in <br />
                    &lt; 90 Days
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {contract?.totalExpriringInNinetyDays}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              Navigate(
                `/contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix1}&dateTo=${dateToUnix1}&titleName=Expiring Today`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix,
                    dateTo: dateToUnix,
                    // status: "Active",
                    titleName: "Expiring today",
                    contractOptionId: 3,
                  },
                }
              );
            }}
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Contract <br />
                    Expiring Today
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {contract?.totalExpriringToday}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {permissions?.viewContractClassified && (
          <>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12">
                <h3 className="text-xl font-medium mt-3 mb-5">
                  Contract classified at a glance
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-5 mb-5">
              <div
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
                onClick={() => {
                  Navigate(`/contract-classified-list`, { state: { cameFrom: "dashboard" } });
                }}
              >
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal w-30">
                        Total <br />
                        Contracts
                      </span>
                      <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                        {contract?.totalCountClassified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
                onClick={() => {
                  Navigate(`/contract-classified-list?status=Active`, {
                    state: { cameFrom: "dashboard" },
                  });
                }}
              >
                {/* <a href = "/cms/contract-list-active"> */}
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-success-100">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal w-30">
                        Active <br />
                        Contracts
                      </span>
                      <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                        <button className="text-success">
                          {contract?.totalActiveClassified}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                {/* </a> */}
              </div>
              <div
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
                onClick={() => {
                  Navigate(`/contract-classified-list?status=Terminated`, {
                    state: { cameFrom: "dashboard" },
                  });
                }}
              >
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-danger-100">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal w-30">
                        Terminated <br />
                        Contracts
                      </span>
                      <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                        <button className="text-danger">
                          {contract?.totalTerminatedClassified}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
                onClick={() => {
                  Navigate(`/contract-classified-list?status=Expired`, {
                    state: { cameFrom: "dashboard" },
                  });
                }}
              >
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-gray-200">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal w-30">
                        Expired <br />
                        Contracts
                      </span>
                      <span class="text-4xl tracking-[-0.115rem] font-bold">
                        <button className="text-gray-500">
                          {contract?.totalExpiredClassified}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-5 mb-10">
              <div className="col-span-6 md:col-span-4 lg:col-span-2 glance-card">
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
                  <div class="flex flex-col items-start justify-between flex-auto p-5 pr-0">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal">
                        Active <br />
                        Termination Notice
                      </span>
                      <span class="text-warning text-4xl tracking-[-0.115rem] font-bold">
                        {contract?.totalActiveTerminationNoticeClassified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  Navigate(
                    `/contract-classified-list?status=Active&contractOptionId=3&dateFrom=${dateFromUnix}&dateTo=${dateToUnix}&titleName=Expiring in 30 days`,
                    {
                      state: {
                        cameFrom: "dashboard",
                        dateFrom: dateFromUnix,
                        dateTo: dateToUnix,
                        status: "Active",
                        titleName: "Expiring in 30 days",
                        contractOptionId: 3,
                      },
                    }
                  );
                }}
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
              >
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal">
                        Expiring in <br />
                        &lt; 30 Days
                      </span>
                      <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold text-warning">
                        {contract?.totalExpriringInThirtyDaysClassified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  Navigate(
                    `/contract-classified-list?status=Active&contractOptionId=3&dateFrom=${dateFromUnix60}&dateTo=${dateToUnix60}&titleName=Expiring in 60 days`,
                    {
                      state: {
                        cameFrom: "dashboard",
                        dateFrom: dateFromUnix60,
                        dateTo: dateToUnix60,
                        status: "Active",
                        titleName: "Expiring in 60 days",
                        contractOptionId: 3,
                      },
                    }
                  );
                }}
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
              >
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal">
                        Expiring in <br />
                        &lt; 60 Days
                      </span>
                      <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                        {contract?.totalExpriringInSixtyDaysClassified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  Navigate(
                    `/contract-classified-list?status=Active&contractOptionId=3&dateFrom=${dateFromUnix90}&dateTo=${dateToUnix90}&titleName=Expiring in 90 days`,
                    {
                      state: {
                        cameFrom: "dashboard",
                        dateFrom: dateFromUnix90,
                        dateTo: dateToUnix90,
                        status: "Active",
                        titleName: "Expiring in 90 days",
                        contractOptionId: 3,
                      },
                    }
                  );
                }}
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
              >
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal">
                        Expiring in <br />
                        &lt; 90 Days
                      </span>
                      <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                        {contract?.totalExpriringInNinetyDaysClassified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  Navigate(
                    `/contract-classified-list?status=Active&contractOptionId=3&dateFrom=${dateFromUnix1}&dateTo=${dateToUnix1}&titleName=Expiring Today`,
                    {
                      state: {
                        cameFrom: "dashboard",
                        dateFrom: dateFromUnix1,
                        dateTo: dateToUnix1,
                        status: "Active",
                        titleName: "Expiring Today",
                        contractOptionId: 3,
                      },
                    }
                  );
                }}
                className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
              >
                <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
                  <div class="flex flex-col items-start justify-between flex-auto p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-secondary-dark text-lg/normal">
                        Contract <br />
                        Expiring Today
                      </span>
                      <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                        {contract?.totalExpriringTodayClassified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <hr />

          <div id="removedashboardPdf" className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              {permissions?.viewContractPendingPermission && (
                <ContractPendingList
                  type="Pending Approval"
                  contractType="Contract"
                  isPaginated={false}
                  entriesPerPage={false}
                  filter={false}
                  showDownload={false}
                  title={false}
                  isDashBoard="true"
                  pageNumber={1}
                  pageSize={10}
                />
              )}
            </div>
          </div>
        

        <hr />
        <div className="page-break"></div>

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <h3 className="text-xl font-medium mt-8 mb-3">
              Category Breakdown
            </h3>
          </div>
          {contractData && (
            <div className="col-span-12 md:col-span-6 border-r border-dashed">
              <h3 className="font-medium text-lg text-center mb-4">
                Contract - Summary
              </h3>
              <div className="p-8">
                {hasData(contractData) ? (
                  <Pie data={contractData} options={options} />
                ) : (
                  <p className="text-center text-gray-500">No data available</p>
                )}
              </div>
            </div>
          )}
          {contractTypeData && (
            <div className="col-span-12 md:col-span-6 border-r border-dashed">
              <h3 className="font-medium text-lg text-center mb-4">
                Contract Type - Summary
              </h3>
              <div className="p-8">
                {hasData(contractTypeData) ? (
                  <Pie data={contractTypeData} options={options} />
                ) : (
                  <p className="text-center text-gray-500">No data available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const TabContentMOU = () => (
    <>
      <div id="dashboardPdf">
        {/* today's reported emergencies */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <h3 className="text-xl font-medium mt-3 mb-5">MOU at a glance</h3>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-5">
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/mou-contract-list`, { state: { cameFrom: "dashboard" } });
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Total <br />
                    Contracts
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {mouData?.totalCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/mou-contract-list-active`, { state: { cameFrom: "dashboard" } });
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-success-100">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Active <br />
                    Contracts
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    <button className="text-success">
                      {mouData.totalActive}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/mou-contract-list-terminated`, {
                state: { cameFrom: "dashboard" },
              });
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-danger-100">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Terminated <br />
                    Contracts
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    <button className="text-danger">
                      {mouData.totalTerminated}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(`/mou-contract-list?status=Expired`, {
                state: { cameFrom: "dashboard" },
              });
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-gray-200">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal w-30">
                    Expired <br />
                    Contracts
                  </span>
                  <span class="text-4xl tracking-[-0.115rem] font-bold">
                    <button className="text-gray-500">
                      {mouData.totalExpired}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-10">
          <div className="col-span-6 md:col-span-4 lg:col-span-2 glance-card">
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5 pr-0">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Active <br />
                    Termination Notice
                  </span>
                  <span class="text-warning text-4xl tracking-[-0.115rem] font-bold">
                    {mouData.totalTerminated}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
            onClick={() => {
              Navigate(
                `/mou-contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix}&dateTo=${dateToUnix}&titleName=Expiring in 30 days`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix,
                    dateTo: dateToUnix,
                    // status: "Active",
                    titleName: "Expiring in 30 days",
                    contractOptionId: 3,
                  },
                }
              );
            }}
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Expiring in <br />
                    &lt; 30 Days
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold text-warning">
                    {mouData.totalExpriringInThirtyDays}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              Navigate(
                `/mou-contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix60}&dateTo=${dateToUnix60}&titleName=Expiring in 60 days`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix60,
                    dateTo: dateToUnix60,
                    // status: "Active",
                    titleName: "Expiring in 60 days",
                    contractOptionId: 3,
                  },
                }
              );
            }}
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Expiring in <br />
                    &lt; 60 Days
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {mouData.totalExpriringInSixtyDays}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              Navigate(
                `/mou-contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix90}&dateTo=${dateToUnix90}&titleName=Expiring in 90 days`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix90,
                    dateTo: dateToUnix90,
                    // status: "Active",
                    titleName: "Expiring in 90 days",
                    contractOptionId: 3,
                  },
                }
              );
            }}
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Expiring in <br />
                    &lt; 90 Days
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {mouData.totalExpriringInNinetyDays}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              Navigate(
                `/mou-contract-list-active?contractOptionId=3&status=Active&dateFrom=${dateFromUnix1}&dateTo=${dateToUnix1}&titleName=Expiring Today`,
                {
                  state: {
                    cameFrom: "dashboard",
                    dateFrom: dateFromUnix1,
                    dateTo: dateToUnix1,
                    // status: "Active",
                    titleName: "Expiring Today",
                    contractOptionId: 3,
                  },
                }
              );
            }}
            className="col-span-6 md:col-span-4 lg:col-span-2 glance-card cursor-pointer"
          >
            <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-primary-50">
              <div class="flex flex-col items-start justify-between flex-auto p-5">
                <div class="flex flex-col">
                  <span class="font-medium text-secondary-dark text-lg/normal">
                    Contract <br />
                    Expiring Today
                  </span>
                  <span class="text-secondary-inverse text-4xl tracking-[-0.115rem] font-bold">
                    {mouData.totalExpriringToday}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        
          <div id="removedashboardPdf" className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              {permissions?.viewMouPendingPermission && (
                <MOUPendingList
                  type="Pending Approval"
                  filter={false}
                  showDownload={false}
                  entriesPerPage={false}
                  isPaginated={false}
                  title={false}
                  isDashBoard="true"
                  pageNumber={1}
                  pageSize={10}
                />
              )}
            </div>
          </div>
        

        <hr />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <h3 className="text-xl font-medium mt-8 mb-3">
              Category Breakdown
            </h3>
          </div>
          {mouContractData && (
            <div className="col-span-12 md:col-span-6 border-r border-dashed">
              <h3 className="font-medium text-lg text-center mb-4">
                MOU - Summary
              </h3>
              <div className="p-8">
                {hasData(mouContractData) ? (
                  <Pie data={mouContractData} options={options} />
                ) : (
                  <p className="text-center text-gray-500">No data available</p>
                )}
              </div>
            </div>
          )}
          {permissions?.moucontractTypeData && (
            <div className="col-span-12 md:col-span-6 border-r border-dashed">
              <h3 className="font-medium text-lg text-center mb-4">
                MOU type - Summary
              </h3>
              <div className="p-8">
                {hasData(permissions?.moucontractTypeData) ? (
                  <Pie data={permissions?.moucontractTypeData} options={options} />
                ) : (
                  <p className="text-center text-gray-500">No data available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
    // <div>
    //   {/* Code Blue Analysis - Adult */}
    //   <div className="grid grid-cols-12 gap-5">
    //     <div className="col-span-12 mt-5">
    //       <h3 className="text-xl font-medium">MOU at a glance</h3>
    //     </div>
    //     <div className="col-span-12"></div>
    //   </div>
    // </div>
  );

  //   const navigate = useNavigate();

  const handleReport = (type) => {
    const pdfName =
      activeTab === "all"
        ? "Dashboard_Contract_Management"
        : "Dashboard_MOU_Management";
    downloadPdf(pdfName);
    if (type === "all") {
      //navigate("/emergency-new");
    } else {
      //navigate("/emergency-new-mock");
    }
  };

  return (
    <div className="content-wrapper w-full">
      <div className="p-4 mb-8 bg-white rounded-lg shadow">
        <div className="mb-4 border-b border-gray-200 flex justify-between">
          <ul className="flex justify-between space-x-4 list-none items-baseline">
            {permissions?.viewContractPermission && (
              <li>
                <button
                  className={`px-4 py-2.5 text-lg border-b-2 font-medium ${
                    activeTab === "all"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 border-transparent hover:text-blue-600"
                  }`}
                  onClick={() => {
                    setActiveTab("all");
                  }}
                >
                  Dashboard - Contract Management
                </button>
              </li>
            )}
            {permissions?.viewMouPermission && (
              <li>
                <button
                  className={`px-4 py-2.5 text-lg border-b-2 font-medium ${
                    activeTab === "codeBlue"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 border-transparent hover:text-blue-600"
                  }`}
                  onClick={() => {
                    setActiveTab("codeBlue");
                  }}
                >
                  Dashboard - MOU Management
                </button>
              </li>
            )}
          </ul>
          <button
            type="button"
            className="mb-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded text-md px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center"
            onClick={() => handleReport("all")}
          >
            <BsFilePdf size={"20px"} className="me-2" /> Download PDF
          </button>
        </div>
        {activeTab === "all" ? TabContentContract() : TabContentMOU()}
      </div>
    </div>
  );
};

export default Dashboard;
