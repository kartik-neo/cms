import React, { useContext, useEffect, useState } from "react";
import TPA from "../../Components/MOU/TPA";
import { useLocation, useSearchParams } from "react-router-dom";
import Aggregator from "./Aggregator";
import PageTitle from "../../Components/Common/PageTitle";
import MOUContext from "../../context/MOUContext";

const NewMOU = () => {
  const location = useLocation();
  const { addendum } = location.state || {};
  const [searchParams, setSearchParams] = useSearchParams({ contractType: 1 });
  const { setMOUDetails } = useContext(MOUContext);


  const [breadCrumbData, setBreadCrumbData] = useState([
    {
      route: "",
      name: "MOU Contract",
    },
    {
      route: "",
      name: "New Contract",
    },
  ]);


  useEffect(()=>{
    setMOUDetails()
  },[])
  useEffect(() => {
    if (addendum) {
      setBreadCrumbData([
        {
          route: "",
          name: "New Mou Addendum",
        },
      ]);
    }
  
  }, [addendum]);

  const handleRadioChange = (contractType) => {
    setSearchParams({ contractType });
    window.location.reload();
  };

  return (
    <div>
      <PageTitle
        title={addendum ? "New Mou Addendum" : "New Mou Contract"}
        buttonTitle=""
        breadCrumbData={breadCrumbData}
        bg={true}
      />
      {/* <StepperBar data={data} step={1} /> */}
      {!addendum && (
        <div className=" flex justify-between items-center">
          <div className="w-full md:w-auto">
            <div className="bg-white shadow rounded-t mt-4 p-4">
              <div className="inline-flex items-center gap-2 cursor-pointer me-12">
                <input
                  type="radio"
                  id="contractType1"
                  className="cursor-pointer border-gray-400 w-5 h-5"
                  checked={searchParams.get("contractType") == 1}
                  // onChange={(e) => setSearchParams({ contractType: 1 })}
                  onChange={() => handleRadioChange(1)}
                />
                <label htmlFor="contractType1">TPA</label>
              </div>
              <div className="inline-flex items-center gap-2 cursor-pointer me-12">
                <input
                  type="radio"
                  id="contractType2"
                  className="cursor-pointer border-gray-400 w-5 h-5"
                  checked={searchParams.get("contractType") == 2}
                  // onChange={(e) => setSearchParams({ contractType: 2 })}
                  onChange={() => handleRadioChange(2)}
                />
                <label htmlFor="contractType2">Corporate</label>
              </div>
              <div className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  id="contractType3"
                  className="cursor-pointer border-gray-400 w-5 h-5"
                  checked={searchParams.get("contractType") == 3}
                  // onChange={(e) => setSearchParams({ contractType: 3 })}
                  onChange={() => handleRadioChange(3)}
                />
                <label htmlFor="contractType3">Aggregator</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchParams.get("contractType") == 1 && <TPA contractType={1} />}
      {searchParams.get("contractType") == 2 && <TPA contractType={2} />}
      {searchParams.get("contractType") == 3 && (
        <Aggregator contractType={3} type="new-aggregator" />
      )}
    </div>
  );
};

export default NewMOU;
