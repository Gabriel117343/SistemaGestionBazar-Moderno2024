import { createContext, useState } from 'react'


export const SidebarContext = createContext()
// Para saber si el sidebar esta abierto o cerrado, util para el responsive design de la sidebar en dispositivos moviles y tablets
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
