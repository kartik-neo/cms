import React, { useEffect, useState } from "react";
import { fetchLocations } from "../../Services/external";

const LocationSection = ({
  register,
  errors,
  watch,
  setLocationId,
  setLocationName,
}) => {
  const [locations, setLocations] = useState();
  const locationDetails = watch("locationDetails");
  const locationName = watch("locationName");
  const characterLimit = 2000;
  const getLocations = async () => {
    try {
      const locations = await fetchLocations({ includeInactive: true });
      setLocations(locations?.success);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    setLocationId(locationName);
  }, [locationName]);

  const handleLocationChange = (e) => {
    const { value } = e.target;
    const location = locations.find((loc) => loc.locationID == value);
    const locationName = location ? location.locationName : "";
    setLocationId(value);
    setLocationName(locationName);
  };
  return (
    <div className="grid grid-cols-12 gap-5 mt-8 pt-6 border-t">
      <div className="col-span-3 md:col-span-2 self-center">
        <p className="text-lg font-semibold">
          Select Location <span className="text-red-600 font-medium">*</span>
        </p>
        {errors.locationName && (
          <label className="error-message text-sm text-red-500 font-medium">
            Location is required
          </label>
        )}
      </div>
      <div className="col-span-9 md:col-span-10">
        <div className="grid grid-cols-12 gap-x-5">
          <div className="col-span-6">
            <select
              name="locationName"
              className="form-input pe-10 ps-4 py-2 border-gray-300 shadow-sm rounded-md w-full"
              {...register("locationName", {
                required: true,
                onChange: handleLocationChange,
                // onChange: (e) => {
                //   const selectedOption =
                //     e.target.options[e.target.selectedIndex];
                //   const selectedLocationName = selectedOption.textContent;
                //   setLocationId(e.target.value);
                //   setLocationName(selectedLocationName);
                // },
              })}
            >
              <option value="">Select ---</option>
              {locations?.map((location, key) => (
                <option value={location.locationID} key={key}>
                  {location.locationName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="col-span-3 md:col-span-2">
        <p className="text-lg font-semibold">
          Location Details <span className="text-red-600 font-medium">*</span>
        </p>
        {errors.locationDetails && (
          <label className="error-message text-sm text-red-500 font-medium">
            Location details are required
          </label>
        )}
      </div>
      <div className="col-span-9 md:col-span-10">
        <div className="grid grid-cols-12 gap-x-5">
          <div className="col-span-6">
            <div className="form-field">
              <textarea
                name="locationDetails"
                id="locationDetails"
                maxLength={characterLimit}
                {...register("locationDetails", {
                  required: true,
                  maxLength: characterLimit,
                })}
                className="resize-none form-input px-4 py-3 border-gray-300 shadow-sm rounded-md w-full"
                rows="4"
              />
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {locationDetails?.length == 2000
                ? "Maximum limit reached"
                : `${
                    characterLimit - locationDetails?.length || 0
                  } characters remaining`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
