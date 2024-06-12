import './views.css'
export const CargaDePagina = () => {
  return (
  <section style={{height:'100vh', paddingTop:'10rem'}} className="fondo-carga">
    <div>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      

    </div>
    <strong className="btn-shine mt-5">Espere un momento porfavor...</strong>
      
    </section>
  )
}