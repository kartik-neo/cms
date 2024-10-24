import React, {useState} from "react";
import UserContext from "./UserContext";


const UserContextProvider = ({children}) =>{
    const [organisation,setOrganisations] = useState({})
    const [isAdmin,setIsAdmin] = useState(null)
   
    return(
        <UserContext.Provider value={{
            organisation,
            setOrganisations,
            setIsAdmin,
            isAdmin
            }}>
              {children}
        </UserContext.Provider>
    )
};

export default UserContextProvider;

