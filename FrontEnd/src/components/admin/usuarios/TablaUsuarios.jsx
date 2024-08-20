import { useState } from "react";
import { MagicMotion } from "react-magic-motion";
import "./styles.css";
export const MostrarTabla = ({ listaPersonas, borrarPersona, edicionUsuario, showModal}) => {
 
  const [currentPage, setCurrentPage] = useState(1);

  console.log(listaPersonas)
  // Se define la cantidad de usuarios a mostrar por pagina
  const cantidadUsuarios = 10;
  // Calculando el índice de inicio y fin de la lista actual en función de la página actual y los elementos por página
  const startIndex = (currentPage - 1) * cantidadUsuarios;
  const endIndex = startIndex + cantidadUsuarios;
  // Obtener los elementos a mostrar en la página actual, slice filtrara el inicio a fin

  const usuariosMostrar = listaPersonas.slice(startIndex, endIndex);

  // Servira para calcular el número total de páginas en función de la cantidad total de elementos y los elementos por página ej: el boton 1, 2, 3 etc..
  const totalBotones = Math.ceil(
    listaPersonas.length / cantidadUsuarios
  ); // toReversed crea una copia superficial del array y lo invierte, 
  return (
    <section>
      <table className="table table-striped table-hover mb-0" id="tabla-usuarios" style={{filter: showModal && 'blur(0.7px)'}}>
        <thead className="border-bottom">
          <tr>
            {/* <th>Imagen</th> */}
            <th>#</th>
            <th>Rut</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Rol</th>
            <th className="text-center">Jornada</th>
            <th className="text-center">Estado</th>
            <th colSpan={2} className="text-center">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody>
          <MagicMotion>
            {usuariosMostrar.map((person, index) => (
              <tr key={person.id}>
                {/* <th className=' pt-0 pb-0'><img className='usuario-imagen p-0 m-0' src={person.imagen ? person.imagen : 'https://w7.pngwing.com/pngs/807/180/png-transparent-user-account-resume-curriculum-vitae-europe-others-service-resume-logo-thumbnail.png'} alt='imagen' /></th> */}
                <td>{index + 1}</td>
                <td>{person.rut}</td>
                <td className="text-capitalize">{person.nombre}</td>
                <td>{person.apellido}</td>
                <td>{person.telefono}</td>
                <td>{person.email}</td>
                {/** Aqui se asignara un icono dependiendo del estado de la persona, por horario y si esta activo */}
                <td className="text-capitalize">{person.rol}</td>
                {person.jornada === "vespertino" && (
                  <td className="text-center animacion-i">
                    <i className="bi bi-moon text-info" />
                  </td>
                )}
                {person.jornada === "duirno" && (
                  <td className="text-center animacion-i">
                    <i className="bi bi-sun text-warning" />
                  </td>
                )}
                {person.jornada === "mixto" && (
                  <td className="text-center animacion-i">
                    <i className="bi bi-moon text-info"></i>
                    <i className="bi bi-sun text-warning"></i>
                  </td>
                )}
                <td className="text-center animacion-i">
                  {person.is_active === true ? (
                    <i className="bi bi-building-fill-up text-success" />
                  ) : (
                    <i className="bi bi-building-fill-slash text-danger" />
                  )}
                </td>
                
                <td>
                  <button
                    className="btn btn-sm btn-info animacion-boton"
                    onClick={() => edicionUsuario(person.id)}
                  >
                    Editar <i className="bi bi-pencil text-white" />
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger animacion-boton"
                    onClick={() => borrarPersona(person.id)}
                  >
                    <i className="bi bi-person-x" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </MagicMotion>
        </tbody>
      </table>

      <div className="pagination-buttons mb-3 mt-1 animacion-numeros">
        {/* bucle Array.from() para generar botones según la cantidad de páginas necesarias, solo se usara el indice del array */}
        {Array.from({ length: totalBotones }, (_, index) => (
          <button
            key={index + 1}
            className={`btn ${currentPage === index + 1 ? "btn-info" : "btn-secondary"}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
};
export const SinUsuarios = () => {
  return (
    <section className="pb-5">
      <table className="table table-striped">
        {/* Esto solo se motrara si listaPersonas esta vacia es decir si no  hay usuarios registrados, util para evitar errores cuando la base de datos no responde */}
        <thead className="border-bottom ">
          <tr>
            <th>#</th>
            <th>Rut</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Jornada</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
      </table>
      <div className="alert alert-warning mt-3" role="alert">
        <h5 className="text-center">No se han encontrado Usuarios</h5>
      </div>
    </section>
  );
};
export const ValidarUsuarios = ({
  listaPersonas,
  borrarPersona,
  edicionUsuario,
  showModal
}) => {

  const persona = listaPersonas?.length > 0;
  // si persona es igual a true o false
  return persona ? (
    <MostrarTabla
      listaPersonas={listaPersonas}
      borrarPersona={borrarPersona}
      edicionUsuario={edicionUsuario}
      showModal={showModal}
    />
  ) : (
    <SinUsuarios />
  );
};
