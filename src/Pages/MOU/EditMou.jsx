import React, { useContext, useEffect, useState } from "react";
import TPA from "../../Components/MOU/TPA";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import Aggregator from "./Aggregator";
import PageTitle from "../../Components/Common/PageTitle";
import MOUContext from "../../context/MOUContext";
import { getMouById } from "../../Services/mouServices";
import { toast } from "react-toastify";
import { makeItProperObject } from "../../utils/other";
import { convertFromUnix } from "../../utils/functions";

const EditMOU = () => {
  const { mouId } = useParams();
  const location = useLocation();
  const { addendum, renew } = location.state || {};
  const [contractType, setContractType] = useState();
  const [contractName, setContractName] = useState();
  const [breadCrumb, setBreadCrumb] = useState();
  const [mouName, setMouName] = useState();
  const { setMOUDetails } = useContext(MOUContext);
  const [globalObjectId, setGlobalObjectId] = useState();
  const [aggregatorId, setAggregatorId] = useState();
  const [creditCompany, setCreditCompany] = useState();

  const getMouDetails = async (id) => {
    try {
      const mouDetail = await getMouById({ id: id });

      if (mouDetail?.success) {
        const response = mouDetail?.data?.length ? mouDetail?.data[0] : {};
        setContractName(response?.contractName);

        setMouName(response?.mouId);
        if (response?.categoryTypeName == "TPA") {
          const defaultValue = makeItProperObject(response, 1);
          // setDefaultData(defaultValue);
         
          if(renew){

            setMOUDetails({
              ...defaultValue,
              minValidityDate: response?.statusName === "Expired" ? convertFromUnix(+response?.validityDateTo + 86400) : convertFromUnix(+response?.validityDateFrom + 86400) ,
              validityDateFrom: null,
              validityDateTo: null,
              renewalFrom:null,
              renewalTo:null
            });
          }
          else{
            setMOUDetails({
              ...defaultValue,
              minValidityDate: response?.contractStatusTypeName === "Renew" ? convertFromUnix(+response?.validityDateFrom + 86400) : null,
            });
          }
          setGlobalObjectId(response?.globalObjectId);
          setContractType(1);
        }
        if (response?.categoryTypeName == "Corporate") {
          const defaultValue = makeItProperObject(response, 2);
          // setDefaultData(defaultValue);
          if(renew){
            setMOUDetails({
              ...defaultValue,
              minValidityDate: convertFromUnix(+response?.validityDateTo + 86400),
              validityDateFrom: null,
              validityDateTo: null,
              renewalFrom:null,
              renewalTo:null
            });
          }
          else{
            setMOUDetails({
              ...defaultValue,
              minValidityDate: convertFromUnix(+response?.validityDateFrom + 86400),
            });
          }

          setGlobalObjectId(response?.globalObjectId);
          setContractType(2);
        }
        if (response?.categoryTypeName == "Aggregator") {
          const defaultValue = makeItProperObject(response, 3);
          // setDefaultData(defaultValue);
          const globalObjectIds = []
          const aggregatorIds = []
          defaultValue?.aggregators?.map((item) => {
            globalObjectIds.push( {
              aggregatorNumber: item?.aggregatorNumber,
              globalObjectId: item?.globalObjectId,
            })

            aggregatorIds.push(item?.aggregatorId)

          });
          setCreditCompany({
            value: response?.creditCompanyId,
            label: response?.contractName,
          });
          setAggregatorId(aggregatorIds)
          setGlobalObjectId(globalObjectIds);
          if(renew){
            setMOUDetails({
              ...defaultValue,
              aggregators: defaultValue.aggregators.map((item) => ({
                ...item,
                minValidityDate: convertFromUnix(+response?.validityDateTo + 86400),
                validityDateFrom: null,
                validityDateTo: null,
                renewalFrom:null,
                renewalTo:null
              }))
            });
          }
          else{
            setMOUDetails(defaultValue);
          }
          setContractType(3);
        }
      }
    } catch (error) {
      toast.error(
        error.message ?? "Error while fetching mou contract details",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  useEffect(() => {
    if (mouId) {
      getMouDetails(mouId);
    }
  }, [mouId]);

  useEffect(() => {
    if(renew){
      setBreadCrumb([
        {
          route: "",
          name: " Mou Contract",
        },
        {
          route: "",
          name: `Renew Mou Contract ${mouName}`,
        },
      ]);
    }
    else if (addendum) {
      setBreadCrumb([
        {
          route: "",
          name: `Add Addendum ${mouName}`,
        },
      ]);
    } else {
      setBreadCrumb([
        {
          route: "",
          name: " Mou Contract",
        },
        {
          route: "",
          name: `Edit Mou Contract ${mouName}`,
        },
      ]);
    }
  }, [mouName, addendum]);

  return (
    <div>
      <PageTitle
        title={`${
          renew ? `Renew Mou Contract ${mouName}` :  addendum ? `Add Addendum ${mouName}` : `Mou Contract ${mouName}`
        }`}
        buttonTitle=""
        breadCrumbData={breadCrumb}
        bg={true}
      />
      <div className="mb-4">{/* <StepperBar data={data} step={1} /> */}</div>
      <div className=" flex justify-between items-center">
        {/* <div className="">
            <div className="bg-white shadow rounded-t mt-4 p-4">
                <div className="inline-flex items-center gap-2 cursor-pointer me-12">
                    <input
                        type="radio"
                        id="contractType1"
                        className="cursor-pointer border-gray-400 w-5 h-5"
                        checked={searchParams.get("contractType") == 1}
                        onChange={(e) => setSearchParams({ contractType: 1 })}
                    />
                    <label htmlFor="contractType1">TPA</label>
                </div>
                <div className="inline-flex items-center gap-2 cursor-pointer me-12">
                    <input
                        type="radio"
                        id="contractType2"
                        className="cursor-pointer border-gray-400 w-5 h-5"
                        checked={searchParams.get("contractType") == 2}
                        onChange={(e) => setSearchParams({ contractType: 2 })}
                    />
                    <label htmlFor="contractType2">Corporate</label>
                </div>
                <div className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        id="contractType3"
                        className="cursor-pointer border-gray-400 w-5 h-5"
                        checked={searchParams.get("contractType") == 3}
                        onChange={(e) => setSearchParams({ contractType: 3 })}
                    />
                    <label htmlFor="contractType3">Aggregator</label>
                </div>
            </div>
        </div> */}
      </div>

      <div className="grid grid-cols-12 py-4 px-4 bg-white shadow ">
        <div className="col-span-12">
          <p className="text-xl font-semibold">
            {contractType == 1 ? "TPA" : contractType == 2 ? "Corporate" : ""}
          </p>
        </div>
        {renew && (
          <div className="col-span-12 mt-4">
            <label
              htmlFor="creditCompany"
              className="inline-block  font-medium  text-lg"
            >
              MOU Renewed From{" "}
              <Link
                to={`/mou-view/${mouId}`}
                className="ml-4 cursor-pointer text-blue-600 text-lg"
              >
                #{mouName}
              </Link>
            </label>
            <hr className="my-8" />
          </div>
        )}
      </div>
      {contractType && contractType == 1 && (
        <TPA contractType={1} globalObjectIdVal={globalObjectId} />
      )}
      {contractType && contractType == 2 && (
        <TPA contractType={2} globalObjectIdVal={globalObjectId} />
      )}
      {contractType && contractType == 3 && (
        <Aggregator
          contractType={3}
          globalObjectIdVal={globalObjectId}
          aggregatorIdVal={aggregatorId}
          getMouDetail={getMouDetails}
          creditCompanyProp={creditCompany}
        />
      )}
    </div>
  );
};

export default EditMOU;
