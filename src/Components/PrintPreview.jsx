import React from 'react';

const PrintPreview = ({ content, onClose, onPrint }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="preview-content mt-4">
          {content}
        </div>
        <div className="preview-actions mt-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2">Cancel</button>
          <button onClick={onPrint} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Print</button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
