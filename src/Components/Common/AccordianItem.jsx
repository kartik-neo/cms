import { useState, useRef } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white shadow relative  rounded-b  flex flex-col gap-y-3 w-full">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <button
            onClick={toggleAccordion}
            className="w-full text-xl font-semibold p-4 bg-blue-600 text-white rounded flex justify-between items-center"
          >
            <span>{title}</span>
            {isOpen ? <BsChevronUp /> : <BsChevronDown />}
          </button>
        </div>
      </div>

      <div
        ref={contentRef}
        className={`accordion-content ${isOpen ? "open" : ""}`}
        style={{
          maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;
