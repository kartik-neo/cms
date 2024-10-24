import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { fetchEmpId } from "../../Services/external";
import { toast } from "react-toastify";

export const EscalationInput = ({
  setData,
  data,
  pIndex,
  setPersons,
  setDisableSave,
  viewOnly,
}) => {
  const [suggetions, setSuggetions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const nameKey = `p${pIndex}Name`;
  // const [val, setValue] = useState(`${data[nameKey] ?? ""}`);
  const [val, setValue] = useState("");
  const [selectedPersonDetail, setSelectedPersonDetail] = useState([]);

  useEffect(() => {
    if (data[nameKey]) {
      setValue(data[nameKey]);
    }
  }, [data]);

  useEffect(
    () => () => {
      if (val.trim()) {
        async function getEmployee(val) {
          try {
            const res = await fetchEmpId({ id: val }); // its not working for now
            setSuggetions([...res?.success].slice(0, 5));
          } catch (error) {
            toast.error(error.message ?? "Error while fetching employee id", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
        getEmployee(val);
      } else {
        setSuggetions([]);
      }
    },
    [val]
  );

  useEffect(() => {
    const newPerson = {
      empid: selectedPersonDetail?.empcode,
      name: selectedPersonDetail?.empname,
      email: selectedPersonDetail?.email,
      mobile: selectedPersonDetail?.cellphone,
    };

    if (newPerson?.empid == (null || undefined)) {
      return;
    } else {
      setPersons(newPerson);
    }
  }, [selectedPersonDetail]);

  return (
    <>
      <td className="p-3">
        <div className="form-field relative">
          <input
            type="text"
            className={`${
              viewOnly && "bg-gray-200"
            } w-full py-3 border-gray-300 rounded-md shadow-sm form-input pe-4 ps-10`}
            placeholder="Search Person"
            name={`person${pIndex}`}
            value={val}
            disabled={viewOnly}
            // onChange={handleInputChange}
            onChange={(e) => {
              setShowDropdown(true);
              setValue(e.target.value);
            }}
            autoComplete="off"
            required={true}
            // {...register(`personName${pIndex}`)}
          />
          {showDropdown && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-3 w-80 shadow-md">
              {suggetions.length > 0 ? (
                suggetions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-black  cursor-pointer hover:bg-gray-200"
                    onClick={(e) => {
                      setDisableSave(false);
                      // setData({ ...data, [`person${pIndex}`]: suggestion?.empname});
                      setValue(e.target.innerHTML);
                      // setValue(suggestion.empname);
                      setPersons({
                        empCode: suggestion?.empcode,
                        name: suggestion?.empname,
                        email: suggestion?.email,
                        phone: suggestion?.cellphone,
                      });
                      // setSelectedPersonDetail(suggestion);
                      setShowDropdown(false);
                    }}
                  >
                    {` ${suggestion?.empcode}- ${suggestion?.empname}`}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No matches found</div>
              )}
            </div>
          )}

          <IoIosSearch className="absolute top-4 left-4 mt-0.5" />
        </div>
      </td>
      <td className="p-3">
        <div className="form-field relative">
          <select
            name={`triggerTime${pIndex}`}
            value={data[`triggerTime${pIndex}`]}
            disabled={viewOnly}
            onChange={(e) => {
              setDisableSave(false);
              setData({ ...data, [e.target.name]: e.target.value });
            }}
            required={true}
            className={`${
              viewOnly && "bg-gray-200"
            } block w-full py-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          >
            <option>Select Hours</option>
            {Array.from({ length: 100 }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>
                {value.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </td>
    </>
  );
};
