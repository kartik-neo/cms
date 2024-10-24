import React, { useState } from "react";
import { useForm } from "react-hook-form";
import VerifyModalBox from "../Common/ModalPopups/VerifyModalBox";
import AlertModal from "../Common/ModalPopups/AlertModal";
import DepartmentViews from "../Common/contractViews/DepartmentViews";
import PartDetailsViews from "../Common/contractViews/PartDetailsViews";
import KeyDatesViews from "../Common/contractViews/KeyDatesViews";
import CustodianDetailsViews from "../Common/contractViews/CustodianDetailsViews";

const ApprovalOne = () => {
  const [isReject, setIsReject] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    handleSubmit,
  } = useForm({ defaultValues: "" });


  
  const onSubmit = (data) => {
    // console.log(":::::::::data:::::::", data);
  };

 

  const handleReject = () => {
    setIsReject(true);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <div className="content-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border px-8 py-8 rounded-lg bg-white shadow relative">
            <DepartmentViews />

            <KeyDatesViews />
            <PartDetailsViews />
            <CustodianDetailsViews />
          </div>
          <div className="flex justify-end my-8">
            <button
              onClick={handleOpen}
              type="button"
              class="py-2.5 px-8 me-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-blue-600 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded text-md px-5 py-2.5 focus:outline-none"
            >
              Reject
            </button>
          </div>
        </form>

        {isReject && (
          <VerifyModalBox
            modalHeading={"Reject"}
            title={"Are you sure you want to reject contract?"}
            setIsOpen={setIsReject}
            isOpen={isReject}
            description={description}
            setDescription={setDescription}
            handleVerify={""}
          />
        )}
        {isOpen && (
          <AlertModal
            title="You are about to approve the following contract <$Contract Name$>

            <$Contract Name$> will be sent for L2 Approval"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setShowSuccessModal={setShowSuccessModal}
            confirmPost={onSubmit}
          />
        )}
      </div>
    </>
  );
};

export default ApprovalOne;
