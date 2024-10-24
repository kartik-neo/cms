import React from "react";

const Loader = ({ isLoading }) => {
  return isLoading ? (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="w-24 h-24 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
    </div>
  ) : null;
};

export default Loader;
