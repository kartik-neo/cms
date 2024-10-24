import { Link } from "react-router-dom";
const PageTitleReport = ({
  title = "",
  breadCrumbData = [],
  status = "",
  edit,
  bg=false
}) => {
  return (
    // <div className="text-3xl font-bold mt-14 ml-5">{title}</div>
    <>
      <div className={`${bg ? "" :"bg-white" } -mt-6 -ml-8 -mr-8 mb-1 h-[50px] px-8 flex items-center justify-between`}>
        <span>
          <span className="text-2xl font-medium tracking-tight text-gray-900">
            {title}
          </span>
        </span>
        {/* {enableButton ? (
          <Link
            to={targetUrl}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-0 font-medium rounded text-md px-4 py-2.5 flex items-center"
          >
            <AiOutlineAlert className="mr-2" /> <span>{buttonTitle}</span>
          </Link>
        ) : (
          ""
        )} */}
      </div>
      {!status && !edit && (
        <nav className="w-full mb-6">
          <ol
            className="list-reset flex font-medium"
            style={{ listStyleType: "none" }}
          >
            <li>
              <Link
                to="/notifications"
                className="transition duration-150 ease-in-out text-blue-600"
              >
                Reports
              </Link>
            </li>

            {breadCrumbData &&
              breadCrumbData?.length > 0 &&
              breadCrumbData.map((breadCrumb) => (
                <>
                  <li>
                    <span className="mx-2 text-gray-400">/</span>
                  </li>
                  <li className="text-gray-500">
                    <Link
                      to={`${breadCrumb?.route}`}
                      className="transition duration-150 ease-in-out text-blue-600"
                    >
                      {breadCrumb?.name}
                    </Link>
                  </li>
                </>
              ))}
          </ol>
        </nav>
      )}
    </>
  );
};

export default PageTitleReport;
