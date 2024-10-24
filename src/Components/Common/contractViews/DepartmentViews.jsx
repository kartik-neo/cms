import React from "react";
import { retainerOptionData } from "../../../Constant/apiConstant";

const DepartmentViews = ({ data }) => {
  // function removeHTMLTagsAndDecodeEntities(str) {
  //   let noTags = str?.replace(/<\/?[^>]+(>|$)/g, "");
  //   let textarea = document.createElement("textarea");
  //   textarea.innerHTML = noTags;
  //   return textarea.value;
  // }

  return (
    <>
      <div className="grid grid-cols-12 gap-x-8 gap-y-5 form-one">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <label for="" class="inline-block text-gray-500 text-lg mb-1">
            Department
          </label>
          <p className="text-lg font-medium">
            {data?.departmentName ? data?.departmentName : "-"}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <label for="" class="inline-block text-gray-500 text-lg mb-1">
            Contract Type
          </label>
          <p className="text-lg font-medium">
            {/* {data?.contractTypeName ? data?.contractTypeName : "-"}  */}
            {data?.contractTypeOther
              ? data?.contractTypeOther
              : data?.contractTypeName}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <label for="" class="inline-block text-gray-500 text-lg mb-1">
            Contract With
          </label>
          <p className="text-lg font-medium">
            {data?.companyName ? data?.companyName : "-"}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <label for="" class="inline-block text-gray-500 text-lg mb-1">
            Ref No
          </label>
          <p className="text-lg font-medium">
            {data?.reference ? data?.reference : "-"}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <label for="" class="inline-block text-gray-500 text-lg mb-1">
            Apostille Type
          </label>
          <p className="text-lg font-medium">
            {data?.apostilleName ? data?.apostilleName : ""}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <label for="" class="inline-block text-gray-500 text-lg mb-1">
            Retainer Contract
          </label>
          <p className="text-lg font-medium">
            {data?.retainerContractId
              ? retainerOptionData[data?.retainerContractId - 1]?.label
              : "-"}
          </p>
        </div>
        <div className="col-span-12">
          <label for="" class="inline-block text-gray-500 text-lg mb-1">
            Terms & Conditions
          </label>
          <p className="text-lg break-words">
            {data?.terms ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.terms,
                }}
              />
            ) : (
              "--"
            )}
          </p>
          {/* <p className="text-lg font-medium">
            {removeHTMLTagsAndDecodeEntities(data?.terms)}
          </p> */}
        </div>
      </div>
    </>
  );
};

export default DepartmentViews;
