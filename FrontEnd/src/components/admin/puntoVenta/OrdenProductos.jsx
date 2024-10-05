import { ordenPorProductosVenta } from "@constants/defaultOptionsFilter";
import { ButtonRefresh } from "../../shared/ButtonSpecialAccion";
const OrdenProductos = ({
  handleOrdenarChange,
  ordenActual,
  cambiarModo,
  modoTabla,
}) => {
  return (
    <div className="col-md-4 d-flex justify-content-end align-items-center gap-2">
      <label htmlFor="orden">Orden:</label>

      {!ordenActual && <i className="bi bi-arrow-down-up"></i>}
      {ordenPorProductosVenta.map((option) => {
 
        if (option.value === ordenActual) {
          return <i key={option.value} className={option.classIcon} />;
        }
        return null;
      })}
      <select
        id="orden"
        name="orden"
        className="form-select"
        onChange={(e) => handleOrdenarChange(e.target.value)}
        value={ordenActual ?? ""}
      >
        <option value="all">Ninguno</option>
        {ordenPorProductosVenta.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ButtonRefresh
        onClick={cambiarModo}
        className={modoTabla && "btn btn-primary"}
      >
        {modoTabla ? (
          <i className="bi bi-table text-white"></i>
        ) : (
          <i className="bi bi-table"></i>
        )}
      </ButtonRefresh>
    </div>
  );
};
export default OrdenProductos;
