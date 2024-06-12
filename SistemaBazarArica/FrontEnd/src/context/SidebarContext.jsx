import React, { createContext, useContext, useState } from 'react'


export const SidebarContext = createContext()
export const SidebarProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(true)
  const cambiarEstadoSidebar = () => {
    setSidebar(!sidebar)
  }
  return (
    <SidebarContext.Provider value={{sidebar, cambiarEstadoSidebar}}>
      {children}
    </SidebarContext.Provider>
  )

}
