import React from "react";
import {
  formatDurationFromUnixTimestamp,
} from "../../../utils/functions";

const KeyDatesViews = ({ data }) => {

  return (
    <>
      <div className="form-two">
        <div className="grid grid-cols-12 gap-x-8 gap-y-5">
          <div className="col-span-12 md:col-span-6">
            <p className="text-xl font-semibold mb-4">
              Key Dates <span className="text-red-600 font-medium">*</span>
            </p>
            <div className="grid grid-cols-12">
              <div className="col-span-6">
                <label
                  for=""
                  className="inline-block text-gray-500 text-lg mb-1"
                >
                  Effective Date
                </label>
                <p className="text-lg font-medium">
                  {formatDurationFromUnixTimestamp(data?.keyEffectiveDate) ??
                    "-"}
                  {/* {convertUnixToDatee(data?.keyEffectiveDate) ?? "-"} */}
                </p>
              </div>
              <div className="col-span-6">
                <label
                  for=""
                  className="inline-block text-gray-500 text-lg mb-1"
                >
                  Expiry Date
                </label>
                <p className="text-lg font-medium">
                  {formatDurationFromUnixTimestamp(data?.keyExpiryDate) ?? "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            {data?.renewalEffectiveDate !== "-" &&
              data?.renewalExpiryDate !== "-" && (
                <>
                  <p className="text-xl font-semibold mb-4">Renewal Dates</p>
                  <div className="grid grid-cols-12">
                    <div className="col-span-6">
                      <label
                        for=""
                        className="inline-block text-gray-500 text-lg mb-1"
                      >
                        Effective Date
                      </label>
                      <p className="text-lg font-medium">
                        {formatDurationFromUnixTimestamp(
                          data?.renewalEffectiveDate
                        ) ?? "-"}
                      </p>
                    </div>
                    <div className="col-span-6">
                      <label
                        for=""
                        className="inline-block text-gray-500 text-lg mb-1"
                      >
                        Expiry Date
                      </label>
                      <p className="text-lg font-medium">
                        {formatDurationFromUnixTimestamp(
                          data?.renewalExpiryDate
                        ) ?? "-"}
                      </p>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyDatesViews;
