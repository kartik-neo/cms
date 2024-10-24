import { BsCheckCircle, BsCircle } from "react-icons/bs";
import PageTitle from "./PageTitle";

const PrintMenus = ({ allEmgData, emergencyId }) => {
  return (
    <div className="mb-8">
      <PageTitle
        title={`Emergency ID ${emergencyId || ""} ${
          allEmgData?.EmergencyDetails?.emergencyTypeName === "MockDrill"
            ? "[MOCK DRILL]"
            : ""
        } - View Incident Details`}
        status="print"
      />
      <div className="border px-5 py-5 rounded-lg bg-white shadow relative">
        <div className="flex items-center stepper-container relative">
          <div className={`text-black w-full step relative`}>
            <div
              className={`inline-flex h-10 items-center rounded-md pl-1 pr-5 relative bg-white`}
            >
              <BsCheckCircle
                className={`${
                  allEmgData?.EmergencyDetails?.isActivated
                    ? "text-red-600"
                    : "text-green-600"
                }  text-2xl`}
              />
              <label className="text-black text-lg ml-2 ">Status - {allEmgData?.EmergencyDetails?.isActivated ? "Active" : "Deactivated"} </label>
            </div>
          </div>
          <div className={`text-black w-full step relative`}>
            <div
              className={`inline-flex h-10 items-center rounded-md pl-1 pr-5 relative bg-white`}
            >
              {allEmgData?.EmergencyDetails?.isPostEventAnalysis ? (
                <BsCheckCircle className="text-green-600 text-2xl" />
              ) : (
                <BsCircle className="text-gray-400 text-2xl" />
              )}
              <label className="text-black text-lg ml-2 ">
                Post Event Analysis
              </label>
            </div>
          </div>
          <div className={`text-black w-full step relative`}>
            <div
              className={`inline-flex h-10 items-center rounded-md pl-1 pr-5 relative bg-white`}
            >
              {allEmgData?.EmergencyDetails?.isVerification ? (
                <BsCheckCircle className="text-green-600 text-2xl" />
              ) : (
                <BsCircle className="text-gray-400 text-2xl" />
              )}
              <label className="text-black text-lg ml-2 ">Verification</label>
            </div>
          </div>
          <div className={`text-black w-full step relative`}>
            <div
              className={`inline-flex h-10 items-center rounded-md pl-1 pr-5 relative bg-white`}
            >
              {allEmgData?.EmergencyDetails?.isActionItems ? (
                <BsCheckCircle className="text-green-600 text-2xl" />
              ) : (
                <BsCircle className="text-gray-400 text-2xl" />
              )}
              <label className="text-black text-lg ml-2 ">
                Actionable Items
              </label>
            </div>
          </div>
          <div className={`text-black w-full step relative`}>
            <div
              className={`inline-flex h-10 items-center rounded-md pl-1 pr-5 relative bg-white`}
            >
              {allEmgData?.EmergencyDetails?.isActionItemsClosed ? (
                <BsCheckCircle className="text-green-600 text-2xl " />
              ) : (
                <BsCircle className="text-gray-400 text-2xl" />
              )}
              <label className="text-black text-lg ml-2 ">
                Action Items Closure
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintMenus;
