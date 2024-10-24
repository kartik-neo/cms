import React, {useState} from "react";

import EmergencyContext from "./EmergencyContext";

const EmergencyContextProvider = ({children}) =>{
    const [currentEmergencyState,setCurrentEmergencySate] = useState(false)
    const [emergencyStatus,setEmergencyStatus] = useState({
        pea:false,
        verify:false,
        actionItem:false,
        actionItemclosure:false
    })
    return(
        <EmergencyContext.Provider value={{currentEmergencyState,setCurrentEmergencySate,emergencyStatus,setEmergencyStatus}}>
              {children}
        </EmergencyContext.Provider>
    )
};

export default EmergencyContextProvider;

