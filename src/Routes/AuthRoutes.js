
import React from 'react'
import { Outlet } from 'react-router-dom'
import EmergencyContextProvider from '../context/EmergencyContextProvider'
import MOUContextProvider from '../context/MOUContextProvider'

const AuthRoutes = () => {

  // Authentication Logic
  return (
    <>
   
    <MOUContextProvider>
      <EmergencyContextProvider>
        <Outlet />
      </EmergencyContextProvider>
      </MOUContextProvider>
    </>
  )
}

export default AuthRoutes