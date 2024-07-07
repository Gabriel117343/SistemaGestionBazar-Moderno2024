import { TablaProductosContenedor } from '../../components/admin/productos/TablaProductosContenedor'
import { ProveedoresProvider } from '../../context/ProveedoresContext'
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
import "./stylepages.css";
export const Productos = () => {
  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-0 titulo-page">
          <div style={{fontSize: '35px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
            <i class="bi bi-boxes"></i>
          </div>
          <GradualSpacing text="Agregar Productos" className='m-0' type='h2'/>
        </div>
        <ProveedoresProvider>
          <TablaProductosContenedor />

        </ProveedoresProvider>
        

      </section>
  )
}
