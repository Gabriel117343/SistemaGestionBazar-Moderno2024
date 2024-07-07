import { BsPersonVcardFill } from "react-icons/bs"
import { TablaProveedoresContenedor } from '../../components/admin/proveedores/TablaProveedoresContenedor'
import { ProveedoresProvider } from '../../context/ProveedoresContext'
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
import "./stylepages.css";
export const Proveedores = () => {
  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-2 titulo-page">
          <div style={{fontSize: '35px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
            <BsPersonVcardFill />
          </div>
          <GradualSpacing text="Proveedores" className='m-0' type='h2'/>
        </div>
        <ProveedoresProvider>{/* ProveedoresProvider es un componente que contiene el estado global de los proveedores */}
          <TablaProveedoresContenedor/> { /* TablaProveedoresContenedor es un componente que contiene la tabla de proveedores */}
        </ProveedoresProvider>
        
      </section>
  )
}
