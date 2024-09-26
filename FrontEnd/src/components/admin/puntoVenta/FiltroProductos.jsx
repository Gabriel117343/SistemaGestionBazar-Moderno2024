import { CategoriaSelect } from "../../shared/CategoriaSelect";
import { SeccionButton } from "../../shared/SeccionButton";
import { ordenPorProductosVenta } from "@constants/defaultOptionsFilter";

import { InputSearch } from '../../shared/InputSearch'
import { ButtonPrint, ButtonRefresh } from '../../shared/ButtonSpecialAccion'

export const FiltroProductos = ({
  categoriaRef,
  buscadorRef,
  filtrarPorCategoria,
  debounceFiltrarPorNombre,
  handleOrdenarChange,
  searchParams,
  secciones,
  filtrarPorSeccion,
  productos,
}) => {
  return (
    <>
      <div className="row pb-1">
        <div className="col-md-3 d-flex justify-content-center align-items-center gap-2">
          <label htmlFor="categoriaSelect">Categoría </label>
          <CategoriaSelect
            parametroCategoria={searchParams.get("categoria")}
            ref={categoriaRef}
            filtroCategoria={filtrarPorCategoria}
          />
        </div>
        <div className="col-md-9 d-flex justify-content-center align-items-center gap-2">
          <label htmlFor="filtro">
            <i className="bi bi-search"></i>
          </label>
          <InputSearch
            ref={buscadorRef}
            id="filtro"
            defaultValue={searchParams.get("filtro")}
            placeholder="Ej: Arroz Miraflores"
            onChange={e => debounceFiltrarPorNombre(e.target.value)}
          />
          <label htmlFor="orden">Orden:</label>

          {!searchParams.get("orden") && <i className="bi bi-arrow-down-up"></i>}
          {ordenPorProductosVenta.map((option) => {
            const ordenActual = searchParams.get("orden") ?? "";
            if (option.value === ordenActual) {
              return <i key={option.value} className={option.classIcon} />;
            }
            return null;
          })}
          <select
            id="orden"
            name="orden"
            className="form-select w-auto"
            onChange={(e) => handleOrdenarChange(e.target.value)}
            defaultValue={searchParams.get("orden")}
          >
            <option value="">Ninguno</option>
            {ordenPorProductosVenta.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pb-1 d-flex gap-1 contenedor-secciones">
        <button
          onClick={filtrarPorSeccion}
          className={`border rounded btn-seleccion ${
            productos?.length === parseInt(searchParams.get("page_size"))
              ? "btn-filtro"
              : ""
          }`}
        >
          Todos
        </button>
        <SeccionButton
          filtrarPorSeccion={filtrarPorSeccion}
          productos={productos}
          secciones={secciones}
          productosPorPagina={parseInt(searchParams.get("page_size"))}
        />
      </div>
    </>
  );
};
