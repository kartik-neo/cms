import React from "react";
import { useForm } from "react-hook-form";

const EmailNotificationSection = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitForm = (data) => {
    onSubmit(data); 
  };

  return (
    <div className="w-full flex flex-col py-2">
      <div className="w-full flex items-start justify-start ml-[10%] mb-1 ">
        <p>Email Notification for Assigned Action Items</p>
      </div>
      <div className="w-full">
        <form
          className="w-full max-w-[80%] mx-auto "
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <div className="mb-4 w-full">
            <label
              className="block text-black font-medium mb-2"
              htmlFor="from"
            >
              From Email:
            </label>
            <input
              className={`w-full shadow appearance-none border border-gray-500 rounded py-2 px-3  text-black leading-tight focus:outline-none focus:shadow-outline ${
                errors.from ? "border-red-500" : ""
              }`}
              id="from"
              type="email"
              placeholder="jupiterHospitalNotifiaction@example.com"
              {...register("from", { required: "From email is required" })}
            />
            {errors.from && (
              <span className="text-red-500 text-sm">
                {errors.from.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-black font-medium mb-2" htmlFor="to">
              To Email:
            </label>
            <input
              className={`shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline ${
                errors.to ? "border-red-500" : ""
              }`}
              id="to"
              type="email"
              placeholder="recipient@example.com"
              {...register("to", {
                required: "To email is required",
                pattern: {
                  message: "Invalid email address",
                },
              })}
            />
            {errors.to && (
              <span className="text-red-500 text-sm">{errors.to.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-black font-medium mb-2" htmlFor="cc">
              CC: (Optional)
            </label>
            <input
              className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              id="cc"
              type="email"
              placeholder="cc_recipient@example.com"
              {...register("cc", {
                pattern: {
                  message: "Invalid email address",
                },
              })}
            />
            {errors.cc && (
              <span className="text-red-500 text-sm">{errors.cc.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-black font-medium mb-2"
              htmlFor="subject"
            >
              Subject:
            </label>
            <input
              className={`shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline ${
                errors.subject ? "border-red-500" : ""
              }`}
              id="subject"
              type="text"
              placeholder="Enter subject"
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">
                {errors.subject.message}
              </span>
            )}
          </div>
          <div className="pb-6 border-b-2 border-gray-500 text-black">
            <label
              className="block text-black font-medium mb-2"
              htmlFor="body"
            >
              Email Body:
            </label>
            <textarea
              className="shadow appearance-none border border-gray-500 rounded w-full py-3 px-3 text-black leading-tight focus:outline-none focus:shadow"
              id="emailBody"
              type="text"
              placeholder="Write your email here..."
              {...register("emailBody", { required: "emailBody is required" })}
            />
            {errors.emailBody && (
              <span className="text-red-500 text-sm">
                {errors.emailBody.message}
              </span>
            )}
          </div>


          <div className="mt-4">
            <label
              className="block text-black font-medium mb-2"
              htmlFor="body"
            >
              SMS/Whatsapp Notification for Assigned Action Items:
            </label>
            <textarea
              className="shadow appearance-none border border-gray-500 rounded w-full py-3 px-3 text-black leading-tight focus:outline-none focus:shadow"
              id="sms"
              type="text"
              placeholder="Write your SMS/Whatsapp Notification here..."
              {...register("sms", { required: "emailBody is required" })}
            />
            {errors.sms && (
              <span className="text-red-500 text-sm">
                {errors.sms.message}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center mt-5">
            <button type="submit" className="bg-blue-400 px-2 py-0 rounded-md text-white">
                Next
            </button>
          </div>
      
        </form>
      </div>
    </div>
  );
};

export default EmailNotificationSection;
