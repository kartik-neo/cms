import React from "react";

const CustodianDetailsViews = ({ data }) => {
  return (
    <>
        <p className="text-xl font-semibold mb-4">Custodian Details</p>

        <div className="grid grid-cols-12 gap-x-8 gap-y-5">
            <div className="col-span-12 md:col-span-4">
                <label for="" className="inline-block text-gray-500 text-lg mb-1">Custodian Name</label>
                <p className="text-lg font-medium">{data?.contractCustodianDetailsModel?.custodianName ?? "-"}</p>
            </div>
            <div className="col-span-12 md:col-span-4">
                <label for="" className="inline-block text-gray-500 text-lg mb-1">File Location</label>
                <p className="text-lg font-medium">{data?.contractCustodianDetailsModel?.custodianFileLocation ?? "-"}</p>
            </div>
            <div className="col-span-12 md:col-span-4">
                <label for="" className="inline-block text-gray-500 text-lg mb-1">Add Details</label>
                <p className="text-lg font-medium">{data?.contractCustodianDetailsModel?.custodianDetails ?? "-"}</p>
            </div>
        </div>
    </>
  );
};

export default CustodianDetailsViews;
