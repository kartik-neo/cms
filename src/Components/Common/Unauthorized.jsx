import React from 'react';

const Unauthorised = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Unauthorised Access</h2>
        <p className="text-gray-700">You are not authorised to access this page.</p>
        <p className="text-gray-700">Please contact your administrator for assistance.</p>
      </div>
    </div>
  );
};

export default Unauthorised;
