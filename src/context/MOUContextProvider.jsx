import React, {useState} from "react";
import MOUContext from "./MOUContext";

const MOUContextProvider = ({children}) =>{
    const [MOUDetails,setMOUDetails] = useState({})
   
    return(
        <MOUContext.Provider value={{MOUDetails,setMOUDetails}}>
              {children}
        </MOUContext.Provider>
    )
};

export default MOUContextProvider;

