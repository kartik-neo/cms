import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
const LatestModalPopUp = ({
  open,
  setOpen,
  icon,
  title,
  description,
  buttons,
}) => {
  return (
    <Transition show={open}>
      <Dialog className="fixed inset-0 z-50" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pb-8 pt-5">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="text-center">
                    {/* <div className="mx-auto flex  items-center justify-start rounded-full"> */}
                    <figure className="flex justify-center mb-4">{icon}</figure>
                    {/* </div> */}
                    <div className="">
                      <DialogTitle
                        as="h2"
                        className="font-medium text-2xl text-gray-900"
                      >
                        {title || ""}
                      </DialogTitle>
                      <div className="mt-2">
                        <h4 className="text-xl">
                          {description || ""}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse justify-center gap-3 sm:px-6">
                  {buttons?.map((button, key) => (
                    <>{button}</>
                  ))}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LatestModalPopUp;
