import axios from "axios";
import React from "react";
import { createRoot } from "react-dom/client";
import Loader from "../Components/Common/Loader"; // Import your Loader component
import {
  APOSTILLE_LIST,
  COMPANY_LIST,
  DOCUMENT_LIST,
  GET_DEPARTMENTS,
  GET_EMPLOYEE_BY_ID,
  GET_FILE_LOCATIONS,
  GET_LOCATIONS,
  GET_MATERIAL_LIST,
  GET_PATIENT_BY_IP,
  GET_PATIENT_BY_MR,
  GET_SERVICES_LIST,
  LOCATION_ID,
} from "../Constant/apiConstant";
import { getUnitId } from "./functions";
// Create a div element for rendering the Loader component
const loaderContainer = document.createElement("div");
document.body.appendChild(loaderContainer);

// Define a loading state to track whether requests are ongoing
let loading = false;

// Create a root
const root = createRoot(loaderContainer);

// Function to render the Loader component
const renderLoader = (isLoading) => {
  root.render(<Loader isLoading={isLoading} />);
};

// Define an array of endpoints where you want to skip the loader
const skipLoaderEndpoints = [
  GET_EMPLOYEE_BY_ID,
  GET_PATIENT_BY_IP,
  GET_PATIENT_BY_MR,
  GET_DEPARTMENTS,
  DOCUMENT_LIST,
  COMPANY_LIST,
  APOSTILLE_LIST,
  GET_LOCATIONS,
  LOCATION_ID,
  GET_FILE_LOCATIONS,
  GET_MATERIAL_LIST,
  GET_SERVICES_LIST
];

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const headers = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "ngrok-skip-browser-warning": "true",
};

const fileHeaders = {
  "Content-Type": "application/octet-stream",
  //"Content-Type": "multipart/form-data", // For file uploads
  "Access-Control-Allow-Origin": "*", // CORS header
  "ngrok-skip-browser-warning": "true",
  // Add other headers if needed
};

let baseURL = process.env.REACT_APP_API_BASE_URL;
const defaultConfiguration = {
  baseURL: baseURL,
  headers,
};

const defaultConfigurationFile = {
  baseURL: baseURL,
  fileHeaders,
};

export const api = axios.create(defaultConfiguration);
export const apiFile = axios.create(defaultConfigurationFile);

api.interceptors.request.use(
  async (config) => {
    // Set loading state to true when a request starts
    const shouldSkipLoader = skipLoaderEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    // If shouldSkipLoader is true, don't show the loader
    if (!shouldSkipLoader) {
      // Set loading state to true when a request starts
      loading = true;
      renderLoader(loading);
    }

    //const token = getCookie("jlhlToken");
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
     //const token = getCookie("jlhlToken");
    // const OrganisationId = localStorage.getItem("OrganizationId");
    // if(OrganisationId){
    //   config.headers.Organizationid = OrganisationId;
    // }else{
      config.headers.Organizationid =  getUnitId() || null
    // }
    return config;
  },
  (error) => {
    loading = false;
    renderLoader(loading);
    return Promise.reject(error);
  }
);

// Add a response interceptor to hide the loader when a response is received
api.interceptors.response.use(
  (response) => {
    // Hide loader when response is received
    loading = false;
    renderLoader(loading);
    return response;
  },
  (error) => {
    // Hide loader if an error occurs
    loading = false;
    renderLoader(loading);
    return Promise.reject(error);
  }
);
