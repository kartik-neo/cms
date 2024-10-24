import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fetchEmpId } from "../../Services/external";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";

export const Input = ({
  setData,
  data,
  pIndex,
  setPersons,
  persons,
  person2,
  person3,
  setDisableSave,
  viewOnly,
}) => {
  const {
   
    control,
    formState: { errors },
  } = useForm({ defaultValues: {} });
  const [suggetions, setSuggetions] = useState([]);
  // const [val, setValue] = useState(`${data[nameKey] ?? ""}`);
  const [val, setValue] = useState("");
  const [selectedPersonDetail, setSelectedPersonDetail] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const dataValue =
      data?.data && data?.data[0]?.escalationMatrixModel?.length > 0
        ? data?.data[0]?.escalationMatrixModel[pIndex == 0 ? 0 : pIndex - 1]
        : null;
    if (dataValue && dataValue["empName"]) {
      setValue(dataValue["empName"]);
      setSelectedPersonDetail(dataValue);
    }
  }, [data,pIndex]);

  useEffect(() => {
    const getEmployee = async (query) => {
      try {
        const res = await fetchEmpId({ id: query });
        setSuggetions(res?.success?.slice(0, 10) || []);
      } catch (error) {
        toast.error(error.message ?? "Error while fetching employee", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    if (val) {
      getEmployee(val);
    } else {
      setSuggetions([]);
    }
  }, [val]);

  useEffect(() => {
    const newPerson = {
      id: selectedPersonDetail?.id,
      empId: selectedPersonDetail?.empId,
      empCode: selectedPersonDetail?.empCode,
      empName: selectedPersonDetail?.empName,
      empEmail: selectedPersonDetail?.empEmail,
      empPhone: selectedPersonDetail?.empPhone,
      level: selectedPersonDetail?.level,
      // isActive: selectedPersonDetail?.isActive,
      skipDays: selectedPersonDetail?.skipDays,
    };

    if (newPerson?.empId == (null || undefined)) {
      return;
    } else {
      setPersons(newPerson);
    }
  }, [selectedPersonDetail]);

  const handleInputChange = (inputValue) => {
    setValue(inputValue);
  };

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setDisableSave(false);
      setValue(selectedOption?.value?.empName);
      setPersons({
        id:
          data?.data &&
          data?.data[0]?.escalationMatrixModel?.length > 0 &&
          data?.data[0]?.escalationMatrixModel[pIndex == 0 ? 0 : pIndex - 1]
            ? data?.data &&
              data?.data[0]?.escalationMatrixModel?.[
                pIndex == 0 ? 0 : pIndex - 1
              ].id
            : 0,
        empId: selectedOption?.value?.empcode,
        empCode: selectedOption?.value?.empcode,
        empName: selectedOption?.value?.empname,
        empEmail: selectedOption?.value?.email,
        empPhone: selectedOption?.value?.cellphone,
        level: parseInt(pIndex),
      });
    } else {
      setValue("");
      setPersons();
    }
  };

  const options = suggetions?.map((suggestion) => ({
    value: suggestion,
    label: `${suggestion.empcode} - ${suggestion.empname}`,
  }));

  const selectedOption = options?.find((option) =>
    option?.value?.empname !== data?.data &&
    data?.data[0]?.escalationMatrixModel?.length > 0
      ? data?.data[0]?.escalationMatrixModel[pIndex == 0 ? 0 : pIndex - 1]
          ?.empName
      : null
  );

  useEffect(() => {
    const initialValue =
      data?.data && data?.data[0]?.escalationMatrixModel?.length > 0
        ? data?.data[0]?.escalationMatrixModel[pIndex === 0 ? 0 : pIndex - 1]
            ?.skipDays
        : undefined;
    if (initialValue !== undefined) {
      setSelectedValue(initialValue);
    }
  }, [data, pIndex]);

  const handleChangeHours = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setDisableSave(false);
    setPersons((prevPersons) => ({
      ...prevPersons,
      skipDays: newValue,
    }));
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOptions);
    }, 1000);
  };

  return (
    <>
      <td className="p-3">
        <div className="form-field relative">
          <Controller
            name={`person${pIndex}`}
            control={control}
            rules={{ required: pIndex == 1 ? "This field is required" : "" }}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                cacheOptions
                loadOptions={loadOptions}
                // defaultOptions={options}
                classNamePrefix="react-select"
                placeholder="Search"
                required={pIndex == 1 || (pIndex == 2 && person3)}
                onInputChange={(inputValue) => {
                  handleInputChange(inputValue);
                  return inputValue;
                }}
                onChange={(selectedOption) => {
                  setSelectedPersonDetail(selectedOption?.value);
                  handleChange(selectedOption);
                  setSelectedValue("");
                }}
                isDisabled={viewOnly}
                value={selectedOption}
                isClearable={true}
              />
            )}
          />

          {errors?.[`person${pIndex}`] && (
            <span className="text-red-500 absolute top-full mt-1">
              {errors[`person${pIndex}`].message}
            </span>
          )}
        </div>
      </td>
      <td className="p-3">
        <div className="form-field relative">
          <select
            name={`triggerTime${pIndex}`}
            value={selectedValue}
            disabled={viewOnly}
            required={
              selectedPersonDetail != null && selectedPersonDetail != undefined
            }
            onChange={handleChangeHours}
            // required={selectedPersonDetail ? true : false}
            className={`${
              viewOnly && "bg-gray-200"
            } block w-full py-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          >
            <option value="">Select Days</option>
            {Array.from({ length: 100 }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>
                {value.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        {/* )} */}
      </td>
    </>
  );
};
