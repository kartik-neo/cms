import React from "react";
import "../../App.css";

const IncidentDescription = ({ incidentData }) => {
  return (
    <>
      <h3 className="text-xl font-semibold flex items-center mb-3 mt-8">
        Incident Description
      </h3>

      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div className="border px-8 py-8 rounded-lg bg-white shadow">
            {incidentData?.incidentDescription && (
              <div
                className="break-words"
                dangerouslySetInnerHTML={{
                  __html: incidentData?.incidentDescription,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IncidentDescription;
