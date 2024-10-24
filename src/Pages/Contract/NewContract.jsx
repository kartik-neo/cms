import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useSearchParams } from "react-router-dom";
import CreateContract from "../../Components/Contract/CreateContract";
import AsyncSelect from "react-select/async";
import AddendumContract from "../../Components/Contract/AddendumContract";
import {
  
  fetchContracts,
} from "../../Services/contractServices";
import PageTitle from "../../Components/Common/PageTitle";

const NewContract = ({ type }) => {
  const {
 
    reset,
    formState: { errors },
  
    setValue,
    control,
  } = useForm({ defaultValues: "" });

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [contractId, setContractId] = useState();
  const location = useLocation();
  const passedData = location.state;
  // const cameFromProps = location.state;

  useEffect(() => {
    const loadOption = async () => {
      if (passedData?.contractId) {
        const option = await fetchOptionById(passedData?.contractId);
        setValue("addendumContract", option);
        setSelectedOption(option);
        setContractId(passedData?.contractId);
      }
    };
    loadOption();
  }, [passedData]);

 

  const customStyles = {
    control: (provided) => ({
      ...provided,
      //height: "1.1rem",
      minWidth: "13.3rem",
      //fontSize: "8px",
      //minHeight: "2.3rem",
      //alignItems: "center",
    }),
  };

  useEffect(() => {
    if (passedData?.contractType) {
      setSearchParams({ contractType: passedData?.contractType });
    } else {
      setSearchParams({ contractType: 1 });
    }
  }, []);

  const breadCrumbData = [
    {
      route:
        type == "Classified" ? "/contract-classified-list" : "/contract-list",
      name: type == "Classified" ? "Contract [Classified] " : "Contract",
    },
    {
      route: "",
      name:
        searchParams.get("contractType") == 1
          ? type == "Classified"
            ? "New Contract [Classified]"
            : "New Contract"
          : type == "Classified"
          ? "Add Addendum [Classified]"
          : "Add Addendum ",
    },
  ];

  const fetchAddendumOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      let hasAddendum = null;
      let addAddendum = true;
      const response = await fetchContracts(inputValue, type, hasAddendum,addAddendum);
      const data = response?.data;
      // const data = response?.data.splice(0, 15);

      return data.map((item) => ({
        label: `${item.contractId} - ${item.companyName}`,
        // label: item.contractId,
        value: item.id,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchOptionById = async (id) => {
    if (!id) return null;
    try {
      const options = await fetchAddendumOptions("c");
      return options.find((option) => option.value == id) || null;
    } catch (error) {
      console.error("Error fetching option by ID:", error);
      return null;
    }
  };

  const handleRadioChange = (value) => {
    setSearchParams({ contractType: value });
    if (value === 2) {
      reset({ addendumContract: null });
      setSelectedOption(null);
      setContractId(null);
    }
  };

  return (
    <div>
      {/* <StepperBar data={data} step={1} /> */}
      <PageTitle
        title={
          searchParams.get("contractType") == 1
            ? type == "Classified"
              ? "New Contract [Classified]"
              : "New Contract"
            : type == "Classified"
            ? "Add Addendum [Classified]"
            : "Add Addendum "
        }
        buttonTitle=""
        breadCrumbData={breadCrumbData}
        bg={true}
      />

      <div className=" flex justify-between items-center">
        <div className="w-full md:w-auto">
          <div className="bg-white shadow rounded-t mt-4 px-4 py-4 md:py-0 md:min-h-[65px] items-center flex flex-col md:flex-row">
            <div className="flex shrink-0">
              <div className="inline-flex items-center gap-2 shrink-0">
                <input
                  type="radio"
                  id="contractType1"
                  className="cursor-pointer border-gray-400 w-5 h-5"
                  checked={searchParams.get("contractType") == 1}
                  // onChange={(e) => setSearchParams({ contractType: 1 })}
                  onChange={() => handleRadioChange(1)}
                />
                <label htmlFor="contractType1">New Contract</label>
              </div>
              <div className="inline-flex items-center gap-2 ml-5 shrink-0 mr-2.5">
                <input
                  type="radio"
                  id="contractType2"
                  className="cursor-pointer border-gray-400 w-5 h-5"
                  checked={searchParams.get("contractType") == 2}
                  // onChange={(e) => setSearchParams({ contractType: 2 })}
                  onChange={() => handleRadioChange(2)}
                />
                <label htmlFor="contractType2">Addendum Contract</label>
              </div>
            </div>

            {searchParams.get("contractType") == 2 && (
              <div className="w-full mt-4 md:mt-0">
                <Controller
                  name={`addendumContract`}
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <AsyncSelect
                      {...field}
                      cacheOptions
                      loadOptions={fetchAddendumOptions}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                        setSelectedOption(selectedOption);
                        setContractId(selectedOption?.value);
                        if (!selectedOption) {
                          // setSearchParams({ contractType: 2 });
                          window.location.reload();
                        }
                      }}
                      isClearable={true}
                      placeholder="Search"
                      styles={customStyles}
                      isRequired={true}
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors.addendumContract && (
                  <span className="text-red-500 mt-1">
                    This field is required
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {searchParams.get("contractType") == 1 ? (
        <CreateContract
          contractType={searchParams.get("contractType")}
          type={type}
        />
      ) : searchParams.get("contractType") == 2 ? (
        <AddendumContract
          contractType={searchParams.get("contractType")}
          type={type}
          contractId={contractId}
          cameFrom="new-contract"
          cameFromProps="NewAddendum"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default NewContract;
