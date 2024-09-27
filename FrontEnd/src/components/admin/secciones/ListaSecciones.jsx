import { MagicMotion } from "react-magic-motion";
import "./secciones.css";
import { WithoutResults } from "../../shared/WithoutResults";
import { ItemSeccion } from "./ItemSeccion";
const MostrarSecciones = ({
  listaSecciones,
  borrarSeccion,
  edicionSeccion,
  showModal,
  currentPage,
  pageSize,
}) => {

  const calcularContador = (index) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  return (
    <>
      <table
        className="table table-striped table-hover table-bordered mt-2 mb-0"
        style={{ filter: showModal && "blur(0.7px)" }}
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Número</th>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Cuando hay un cambio anima la tabla */}
          <MagicMotion>
            {listaSecciones.map((seccion, index) => {
              const contador = calcularContador(index);
              console.log({ contador: contador })
              return (
                <ItemSeccion
                  key={seccion.id}
                  seccion={seccion}
                  contador={contador}
                  borrarSeccion={borrarSeccion}
                  edicionSeccion={edicionSeccion}
                />
              );
            })}
          </MagicMotion>
        </tbody>
      </table>
    </>
  );
};
const SinSecciones = () => {
  return (
    <>
      <table className="table table-striped table-hover table-bordered mt-2">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Número</th>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
      </table>
      <WithoutResults message="No se han encontrado Secciones" />
    </>
  );
};
export const ValidarSecciones = ({ listaSecciones, ...props }) => {
  const validacion = listaSecciones?.length > 0; // valida si hay secciones , el resultado sera true o false
  return validacion ? (
    <MostrarSecciones listaSecciones={listaSecciones} {...props} />
  ) : (
    <SinSecciones />
  );
};
