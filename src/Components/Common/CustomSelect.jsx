import React, { useEffect, useState } from "react";
import Select from "react-select";

const CustomSelect = ({ options, placeholder, setData }) => {
  const [unitType, setUnitType] = useState(null);

  // Add Tailwind CSS width class to control the width of the select component
  // This assumes you have a set width you'd like the select to be. Adjust the class as needed.
  useEffect(() => {
    setData(unitType?.value);
  }, [unitType]);

  return (
    <Select
      options={options}
      required={true}
      className="select-control w-full" // Make sure the Select component itself takes up 100% of the div's width
      classNamePrefix="react-select"
      placeholder={placeholder}
      onChange={setUnitType}
      value={unitType}
      isClearable
    />
  );
};

export default CustomSelect;
