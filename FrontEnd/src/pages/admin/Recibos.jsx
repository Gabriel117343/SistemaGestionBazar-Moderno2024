import { FaTruckRampBox } from "react-icons/fa6"
import GradualSpacing from '../../components/shared/magic_ui/GradualSpacing'
import "./stylepages.css";
export const Recibos = () => {
  return (
    <section className='container-fluid'>
        <div className="d-flex align-items-center justify-content-left gap-3  pt-3 titulo-page">
          <div style={{fontSize: '40px'}} className='d-flex align-items-center p-0 m-0 ms-2'>
            <FaTruckRampBox />
          </div>
          <GradualSpacing text="Ordenes Recibidas" className='m-0' type='h2'/>
        </div>
      </section>
  )
}
