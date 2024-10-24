import React from "react";

const PartDetailsViews = ({ data }) => {

  return (
    <>
      <p className="text-xl font-semibold mb-8">
        Point of Contact for Agreement (2nd Party)
      </p>

      <div className="grid grid-cols-12 gap-x-8 gap-y-5">
        {/* first party details */}
        <div className="col-span-12 md:col-span-4 md:border-r">
            <div className="grid grid-cols-12 gap-x-8 gap-y-5">
                <div className="col-span-12">
                    <p className="text-xl font-semibold text-blue-600">Jupiter</p>
                </div>
                <div className="col-span-12">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Emp Name
                    </label>
                    <p className="text-lg font-medium">
                        {data?.empName ? data?.empName : "-"}
                    </p>
                </div>
                <div className="col-span-12">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Emp Code
                    </label>
                    <p className="text-lg font-medium">
                        {data?.empCode ? data?.empCode : "-"}
                    </p>
                </div>
                <div className="col-span-12">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Contact No
                    </label>
                    <p className="text-lg font-medium">
                        {data?.empPhone ? data?.empPhone : "-"}
                    </p>
                </div>
                <div className="col-span-12">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Email ID
                    </label>
                    <p className="text-lg font-medium">
                        {data?.empEmail ? data?.empEmail : "-"}
                    </p>
                </div>
                <div className="col-span-12">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Designation
                    </label>
                    <p className="text-lg font-medium">
                        {data?.designation ? data?.designation : "-"}
                    </p>
                </div>
                <div className="col-span-12">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Department
                    </label>
                    <p className="text-lg font-medium">
                        {data?.empDepartment ? data?.empDepartment : "-"}
                    </p>
                </div>
                <div className="col-span-12">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Location
                    </label>
                    <p className="text-lg font-medium">
                        {data?.empLocation ? data?.empLocation : "-"}
                    </p>
                </div>
            </div>
        </div>

        {/* second party details */}
        <div className="col-span-12 md:col-span-8 mt-8 md:mt-0">
            <div className="grid grid-cols-12 gap-x-8 gap-y-5">
                <div className="col-span-12">
                    <p className="text-xl font-semibold text-blue-600">
                        2nd Party Details
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Company Contact No
                    </label>
                    <p className="text-lg font-medium">
                        {data?.cmpPhone ? data?.cmpPhone : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Company Email Id
                    </label>
                    <p className="text-lg font-medium">
                        {data?.cmpEmail ? data?.cmpEmail : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Company Address Line 1
                    </label>
                    <p className="text-lg font-medium">
                        {data?.cmpAdd1 ? data?.cmpAdd1 : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Company Address Line 2
                    </label>
                    <p className="text-lg font-medium">
                        {data?.cmpAdd2 ? data?.cmpAdd2 : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Company Address Line 3
                    </label>
                    <p className="text-lg font-medium">
                        {data.cmpAdd3 ? data.cmpAdd3 : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Pin Code / Zip Code
                    </label>
                    <p className="text-lg font-medium">
                        {data.cmpPincode ? data.cmpPincode : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        State
                    </label>
                    <p className="text-lg font-medium">
                        {data.cmpState ? data.cmpState : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        City
                    </label>
                    <p className="text-lg font-medium">
                        {data.cmpCity ? data.cmpCity : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        Country
                    </label>
                    <p className="text-lg font-medium">
                        {data.cmpCountry ? data.cmpCountry : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        POC Name
                    </label>
                    <p className="text-lg font-medium">
                        {data.pocName ? data.pocName : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        POC Contact No
                    </label>
                    <p className="text-lg font-medium">
                        {data.pocContactNo ? data.pocContactNo : "-"}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <label htmlFor="" className="inline-block text-gray-500 text-lg mb-1">
                        POC Email Id
                    </label>
                    <p className="text-lg font-medium">
                        {data.pocEmailID ? data.pocEmailID : "-"}
                    </p>
                </div>
            </div>
        </div>
      </div>

    </>
  );
};

export default PartDetailsViews;
