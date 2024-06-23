import { ListaSeccionesContenedor } from '../../components/admin/secciones/ListaSeccionesContenedor'
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
export const Secciones = () => {
  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-1 pb-1 titulo-page">
          <div style={{fontSize: '35px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
            <i class="bi bi-layers-fill"></i><i className='bi bi-section-fill'></i>
          </div>
          <GradualSpacing text="Secciones Registradas" className='m-0' type='h2'/>
        </div>
        <ListaSeccionesContenedor />
      </section>
  )
}
