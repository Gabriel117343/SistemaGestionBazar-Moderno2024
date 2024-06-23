import { TablaUsuariosContenedor } from '../../components/admin/usuarios/TablaUsuariosContenedor'
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
export const Usuarios = () => {
  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-1 pb-1 titulo-page">
          <div style={{fontSize: '35px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
          <i class="bi bi-people-fill"></i>
          </div>
          <GradualSpacing text="Gestionar Usuarios" className='m-0' type='h2'/>
        </div>
        <TablaUsuariosContenedor />

      </section>
  )
}
