import moment from "moment";
import { jwtDecode } from "jwt-decode";
import {
  documentApproval,
  fetchEmpId,
  fetchMaterialList,
  fetchServicesList,
} from "../Services/external";
import { fetchMOUList } from "../Services/mouServices";
import { fetchAuditEmpList } from "../Services/reportService";
export function filterToYearList(yearFromVal, list) {
  return list.filter((item) => item.value >= yearFromVal.value);
}

export function getUnixTimestamps(days) {
  // Get current date
  const now = new Date();

  // Get tomorrow's date
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  // Get date 30 days from tomorrow
  const dateTo = new Date(tomorrow);
  dateTo.setDate(tomorrow.getDate() + days);

  // Convert to UNIX timestamp (seconds)
  const dateFromUnix = Math.floor(tomorrow.getTime() / 1000);
  const dateToUnix = Math.floor(dateTo.getTime() / 1000);

  return { dateFromUnix, dateToUnix };
}
export function getMonthInNumber(date) {
  const dateString = date.toString();
  const monthString = dateString.substring(4, 7); // Extracting the month part
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const month = monthMap[monthString];

  const parts = dateString.split(" ");
  const year = parts[3];
  return { month, year };
}

export function unixTimestamp(dateString) {
  // Parse the date string using Moment.js and specify the time zone
  const date = moment(dateString, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  // Convert the date to a Unix timestamp
  const unixTimestamp = date.unix();
  return unixTimestamp;
}

export function convertIntoUnix(dateString) {
  // Parsing the date string using Moment.js
  const parsedDate = moment(dateString, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  // Converting parsed date to Unix timestamp
  const unixTimestamp = parsedDate.unix();

  return unixTimestamp.toString();
}

export function convertUnixToDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date?.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formattedDate;
}

export function convertFromUnix(unixTimestamp) {
  // Converting Unix timestamp to milliseconds
  if (isNaN(unixTimestamp) || unixTimestamp < 0) {
    return "";
  }
  const milliseconds = unixTimestamp * 1000;

  // Creating a Moment.js object from the milliseconds
  const date = moment(milliseconds);
  if (!date.isValid()) {
    return "";
  }

  // Formatting the date as desired
  const formattedDate = date.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  return formattedDate;
}

// Format the date to display time as 12 PM
export function reportedOnTime(dateString) {
  // Parse the date string using Moment.js
  const date = moment.unix(dateString);
  // Convert the date to a Unix timestamp
  const formattedTime = date.format("h:mm A");
  return formattedTime;
}
export function reportedOnTimewithoutAMPM(dateString) {
  // Parse the date string using Moment.js
  const date = moment.unix(dateString);
  // Convert the date to a Unix timestamp
  const formattedTime = date.format("HH:mm");
  return formattedTime;
}

export function formatDateTime(timestamp) {
  // Convert Unix timestamp to a Moment.js object
  const date = moment.unix(timestamp);

  // Format the date and time
  const formattedDateTime = date.format("DD/MM/YYYY h:mm A");

  return formattedDateTime;
}

export function formatDurationFromUnixTimestamp(timestamp) {
  // Convert Unix timestamp to a Moment.js object
  if (timestamp == "-" || timestamp == undefined) {
    return "-";
  }
  const formattedDate = moment.unix(timestamp).format("DD/MM/YYYY");

  // const date = moment.unix(timestamp);

  // Get the duration in hours and minutes
  // const durationHours = date.hours();
  // const durationMinutes = date.minutes();

  // Construct the formatted duration string
  // let formattedDuration = "";
  // if (durationHours > 0) {
  //   formattedDuration += durationHours + " Hr";
  // }
  // if (durationMinutes > 0) {
  //   formattedDuration += " " + durationMinutes + " Min";
  // }

  // return testing;
  return formattedDate;
  // return `${date.hours()}:${date.minutes()}`;
  // return formattedDuration.trim();
}

export function DateFromUnixTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);

  const formattedDate = moment(date).isValid()
    ? moment(date).format("dd/MM/yyy")
    : "-";

  return formattedDate;
}

export function DateFromFullToReadable(date) {
  const formattedDate = date ? moment(date).format("DD/MM/YYYY") : "-";

  return formattedDate;
}

export function DateFromUnixTimestampNoti(timestamp) {
  const date = new Date(timestamp * 1000);
  const formattedDate = moment(new Date(date)).format("DD/MM/YYYY");

  return formattedDate;
}

export function DateToUnixTimestamp(timestamp) {
  const momentObj = moment(timestamp);
  if (!momentObj.isValid()) {
    return "-";
  }
  return momentObj.unix().toString();
}
export function TimeFromUnixTimestamp(timestamp) {
  const dateTime = moment.unix(timestamp);
  const formattedTime = dateTime.format("hh:mm A");
  return formattedTime;
}

export function combineDateTimeToUnixTimestamp(dateString, timeString) {
  // Parse the date and time strings using Moment.js
  const date = moment(dateString, "YYYY-MM-DD");
  const time = moment(timeString, "HH:mm");

  // Combine the date and time
  const combinedDateTime = date.set({
    hour: time.hour(),
    minute: time.minute(),
    second: 0, // Reset seconds to 0
    millisecond: 0, // Reset milliseconds to 0
  });

  // Convert the combined date and time to a Unix timestamp
  const unixTimestamp = combinedDateTime.unix();

  return unixTimestamp;
}

export function formatDate(date) {
  return moment(date).format("DD/MM/YYYY hh:mm A");
}

export function calculateDaysDiffWithToday(date) {
  const currentDate = moment();
  return moment.unix(date).diff(currentDate, "days") + 2;
  // return moment(date).diff(currentDate, 'days');
}

export function daysDifference(unixTimestamp) {
  // Convert the Unix timestamp to milliseconds
  const dateFromTimestamp = new Date(unixTimestamp * 1000);
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in time
  const timeDifference = dateFromTimestamp - currentDate;

  // Convert the time difference to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
   return daysDifference < 0 ? 0 : daysDifference+1;
}

export function dayssDifference(unixTimestamp) {
  // Convert the Unix timestamp to milliseconds
  const dateFromTimestamp = new Date(unixTimestamp * 1000);
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in time
  const timeDifference = dateFromTimestamp - currentDate;

  // Convert the time difference to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  //  return daysDifference < 0 ? 0 : daysDifference;
   return  daysDifference;
}

export function getUnitId() {
  //  return 12;
  const token = localStorage.getItem("token");
  // const OrganisationId = localStorage.getItem("OrganizationId");
  const unitId = localStorage.getItem("unitId");
  const currentUrl = window.location.href;
  if (token && !currentUrl.includes("/login")) {
    var decoded = jwtDecode(token);

    if (unitId) {
      return unitId;
    } else {
      if (
        decoded?.AllowedOrganizationIds?.includes(
          decoded?.LoggedInOrganizationId
        )
      ) {
        const loginOptions = JSON.parse(localStorage.getItem("loginOptions"));
        const foundUnit = loginOptions?.find(
          (unit) => unit.id == decoded?.LoggedInOrganizationId
        );
        if (foundUnit) {
          localStorage.setItem("unitName", foundUnit?.name);
          return decoded?.LoggedInOrganizationId;
        } else {
          localStorage.setItem("unitName", loginOptions[0]?.name);
          return loginOptions?.length && loginOptions[0]?.id;
        }
      } else {
        return decoded?.AllowedOrganizationIds[0];
      }
    }
  } else if (!currentUrl.includes("/login")) {
    //window.location.href = "/login";
  }
}

export function userDetails() {
  // const token = getCookie("jlhlToken");
  // const token = localStorage.getItem("token");
  // if (token) {
  //   var decoded = jwtDecode(token);
  //   return {UserId:2584,UserName:"komal"};
  // } else {
  //   return null;
  // }
  // return {UserId:2584,UserName:"komal"}
  const info = localStorage.getItem("loggedInUser");

  if (info) {
    const result = JSON.parse(info);

    return {
      UserId: result?.employeeCode,
      UserName: result?.username,
      user: result?.userId,
      userRoles: result?.roleIds,
    };
  } else {
    return {
      UserId: null,
      UserName: "",
      user: null,
      userRoles: [],
    };
  }
}

export function convertUnixToDatee(unixTimestamp) {
  // Create a new Date object using the Unix timestamp (in milliseconds)
  if (isNaN(unixTimestamp) || unixTimestamp < 0) {
    return "-";
  }
  const date = new Date(unixTimestamp * 1000);

  if (isNaN(date.getTime())) {
    return "-";
  }

  // Extract day, month, and year from the date object
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are zero-based in JavaScript
  const year = date.getUTCFullYear();

  // Format day and month to always have two digits
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Return the formatted date string
  return `${formattedDay}/${formattedMonth}/${year}`;
}

// Example usage
// const unixTimestamp = 1716805695;
// const formattedDate = convertUnixToDate(unixTimestamp);

export function getCodesInfo() {
  const info = localStorage.getItem("codesInfo") || null;

  if (info) {
    const result = JSON.parse(info);
    return result;
  } else {
    return {
      captainCodes: [],
      ownerCodes: [],
      userRoles: [],
    };
  }
}

export function getGroupedMenu(allMenus, menuHeadings) {
  // const allMenus = [
  //   {
  //     "id": 39,
  //     "name": "Dashboard",
  //     "path": "/ecm/dashboard",
  //     "menuGroupId": 1,
  //     "listOrder": 1
  //   },
  //   {
  //             "id": 43,
  //             "name": "Code Master",
  //             "path": "/ecm/codemaster",
  //             "menuGroupId": 2,
  //             "listOrder": 0
  //           },
  //           {
  //             "id": 44,
  //             "name": "Code Team Master",
  //             "path": "/ecm/codeteammaster",
  //             "menuGroupId": 2,
  //             "listOrder": 0
  //           },
  //   // Add all other menu items
  // ];

  // const menuHeadings = [
  //   {
  //     "id": 1,
  //     "name": "Root"
  //   },
  //   {
  //     "id": 2,
  //     "name": "Master Management"
  //   }
  //   // Add all other menu headings
  // ];

  const nestedMenus = menuHeadings.map((heading) => {
    const filteredMenus = allMenus.filter(
      (menu) => menu.menuGroupId === heading.id
    );
    return {
      id: heading.id,
      name: heading.name,
      list: filteredMenus,
    };
  });
  return (
    nestedMenus.map((group) => {
      group.list.sort((a, b) => a.id - b.id);
      return group;
    }) ?? []
  );
  
}

export const handleDownloadCSV = (defaultData, tableName) => {
  const headers = Object.keys(defaultData[0]);

  let csv = headers.join(",") + "\n";

  defaultData.forEach((item) => {
    const row = headers
      .map((header) => {
        return item[header] !== undefined && item[header] !== null
          ? item[header]
          : "";
      })
      .join(",");
    csv += row + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  // link.download = "table_data.csv";
  link.download = tableName ? `${tableName}.csv` : "table_data.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function categorizeFiles(files) {
  const images = [];
  const videos = [];
  const otherFiles = [];

  files.forEach((file) => {
    const fileExtension = file.fileType.toLowerCase();
    const section = file.section;
    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "gif" ||
      section === "Photo"
    ) {
      images.push(file);
    } else if (
      fileExtension === "mp4" ||
      fileExtension === "mov" ||
      fileExtension === "avi" ||
      section === "Video"
    ) {
      videos.push(file);
    } else {
      otherFiles.push(file);
    }
  });

  return { images, videos, otherFiles };
}

export function isPastDate(timestamp) {
  // Convert the given Unix timestamp to a moment object
  // const date = moment.unix(timestamp);

  // Get the current Unix timestamp
  const currentTimestamp = moment().unix();

  // Check if the given timestamp is less than the current timestamp
  return timestamp < currentTimestamp;
}

export function removeLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("unitId");
  localStorage.removeItem("loginOptions");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("unitName");
  localStorage.removeItem("codesInfo");
}

export const fetchEmpNameOptions = async (inputValue) => {
  if (!inputValue) return [];

  try {
    const response = await fetchEmpId({ id: inputValue });

    const data = response?.success.splice(0, 15);

    return data.map((item) => ({
      value: item.empcode,
      label: `${item.empcode} - ${item.empname}`,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
export const fetchAuditLogEmpNameOptions = async (name) => {
  if (!name) return [];

  try {
    const response = await fetchAuditEmpList({ name });

    const data = response?.data.splice(0, 15);

    return data.map((item) => ({
      value: item.byId,
      label: item.displayName,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchApproveDocument = async (inputValue) => {
  if (!inputValue) return [];

  try {
    const response = await documentApproval({ id: inputValue, isActive: true });

    const data = response?.data;

    return data.map((item) => ({
      value: item?.id,
      label: `${item.name}`,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchAddendumToTPACorporate = async (inputValue) => {
  const unitId = getUnitId();
  try {
    // setIsLoaded(true);
    const categoryType = ["TPA", "Corporate"].join(",");

    // Construct the query string
    let hasAddendum = null;
    let query = `searchText=${inputValue}&categoryType=${categoryType}&addAddendum=true&locationId=${unitId}`;
    // let query = `searchText=${inputValue}`;
    const result = await fetchMOUList(query, "Active",hasAddendum);
    const data = result?.data;
    return data?.map((item) => ({
      value: item?.id,
      label: `${item.mouId} - ${item.mouName}`,
      valueToUse: `${item.mouName}`,
    }));

    // setIsLoaded(false);
  } catch (error) {
    console.error("Error:", error);
    // setIsLoaded(false);
  }
};

export const fetchAddendumTo = async (inputValue) => {
  try {
    // setIsLoaded(true);
    let query = `searchText=${inputValue}`;
    const result = await fetchMOUList(query, "Active");
    const data = result?.data;
    return data?.map((item) => ({
      value: item?.id,
      label: `${item.mouId} - ${item.mouName}`,
      valueToUse: `${item.mouName}`,
    }));

    // setIsLoaded(false);
  } catch (error) {
    console.error("Error:", error);
    // setIsLoaded(false);
  }
};
export const fetchMaterialServices = async (inputValue) => {
  if (!inputValue) return [];

  try {
    const [material, services] = await Promise.all([
      fetchMaterialList({ id: inputValue }),
      fetchServicesList({ id: inputValue }),
    ]);
    const combinedData = [
      ...(material?.success || []),
      ...(services?.success || []),
    ];
    const slicedData = combinedData?.slice(0, 500);

    // const data = response?.success;

    return slicedData.map((item) => ({
      value: item?.code,
      label: `${item?.name}`,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export function findRemovedRecords(originalData, updatedData) {
  // Create a set of ids from the updated data
  if (originalData?.length > 0) {
    const updatedIds = new Set(updatedData?.map((record) => record?.empCode));

    // Filter original data to find records not in the updated data
    const missingRecords = originalData?.filter(
      (record) => !updatedIds.has(record?.empCode)
    );
    return missingRecords;
  } else {
    return [];
  }
}
