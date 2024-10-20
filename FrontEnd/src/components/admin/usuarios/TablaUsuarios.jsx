import { useId } from "react";
import { MagicMotion } from "react-magic-motion";
import "./styles.css";
import { calcularContador } from "@utils/calcularContador";
export const MostrarTabla = ({
  listaUsuarios,
  borrarUsuario,
  edicionUsuario,
  currentPage,
  pageSize,
  showModal,
}) => {
  const id = useId();
  return (
    <section>
      <table
        id={`tabla-usuarios-${id}`}
        className="table table-striped table-hover mb-0"
        style={{ filter: showModal && "blur(0.7px)" }}
      >
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
            {listaUsuarios.map((usuario, index) => {
              const primerNombre = usuario.nombre.split(" ")[0];
              const primerApellido = usuario.apellido.split(" ")[0];
              const contador = calcularContador({
                index,
                currentPage,
                pageSize,
              });
              return (
                <tr key={usuario.id}>
                  {/* <th className=' pt-0 pb-0'><img className='usuario-imagen p-0 m-0' src={usuario.imagen ? usuario.imagen : 'https://w7.pngwing.com/pngs/807/180/png-transparent-user-account-resume-curriculum-vitae-europe-others-service-resume-logo-thumbnail.png'} alt='imagen' /></th> */}
                  <td>{contador}</td>
                  <td>{usuario.rut}</td>
                  <td className="text-capitalize">{primerNombre}</td>
                  <td>{primerApellido}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.email}</td>
                  {/** Aqui se asignara un icono dependiendo del estado de la usuario, por horario y si esta activo */}
                  <td className="text-capitalize">{usuario.rol}</td>
                  {usuario.jornada === "vespertino" && (
                    <td className="text-center animacion-i">
                      <i className="bi bi-moon text-info" />
                    </td>
                  )}
                  {usuario.jornada === "duirno" && (
                    <td className="text-center animacion-i">
                      <i className="bi bi-sun text-warning" />
                    </td>
                  )}
                  {usuario.jornada === "mixto" && (
                    <td className="text-center animacion-i">
                      <i className="bi bi-moon text-info"></i>
                      <i className="bi bi-sun text-warning"></i>
                    </td>
                  )}
                  <td className="text-center animacion-i">
                    {usuario.is_active === true ? (
                      <i className="bi bi-building-fill-up text-success" />
                    ) : (
                      <i className="bi bi-building-fill-slash text-danger" />
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-info animacion-boton"
                      onClick={() => edicionUsuario(usuario.id)}
                    >
                      Editar <i className="bi bi-pencil text-white" />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger animacion-boton"
                      onClick={() => borrarUsuario(usuario.id)}
                    >
                      <i className="bi bi-person-x" /> Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </MagicMotion>
        </tbody>
      </table>
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
export const ValidarUsuarios = ({ listaUsuarios, ...props }) => {
  const usuario = listaUsuarios?.length > 0;
  // si usuario es igual a true o false
  return usuario ? (
    <MostrarTabla listaUsuarios={listaUsuarios} {...props} />
  ) : (
    <SinUsuarios />
  );
};
