import React, { useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { UsuariosContext } from "../../../../context/UsuariosContext";
import { MagicMotion } from "react-magic-motion";

import { paginaUsuarios } from "@constants/defaultParams.js";
import { InputSearch } from "../../../shared/InputSearch";
import { debounce } from "es-toolkit";
import { ItemSelectVendedor } from "./ItemSelectVendedor";
import calcularContador from "@utils/calcularContador";
import { PaginacionVendedores } from './PaginacionVendedores'

export const SelectVendedor = ({ ventas, setShowModal }) => {
  const {
    stateUsuario: { usuarios, usuarioSeleccionado, cantidad, page, page_size },
    getUsuarios,
  } = useContext(UsuariosContext);

  const [filtroVendedor, setFiltroVendedor] = useState("");
  const inputRef = useRef(null);

  const TIEMPO_ESPERA = 1000; // milisegundos
  console.log({ usuarios })
  async function cargarUsuarios({ page } = {}) {
    // el { page } = {} indica que page es un parametro opcional y si no se pasa se asigna un objeto vacio para que no sea undefined y de error

    const { success, message } = await getUsuarios({
      ...paginaUsuarios.mandatorios,
      ...(page ? { page } : {}), // si hay un page se agrega al objeto, sino se mantienen los parametros por defecto
      filtro: filtroVendedor ?? "",
    });

    if (!success) {
      toast.error(
        message ?? "Ha ocurrido un error inesperado al cargar los usuarios",
        { id: "loading" }
      );
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarPagina = ({ newPage }) => {

    cargarUsuarios({ page: newPage });

  }

  const filtrarVendedores = (filtro) => {
    const filtroLimpio = filtro.trim().toLowerCase();

    if (filtroLimpio.length > 0) {
      setFiltroVendedor(filtroLimpio);
     
    }
    cargarUsuarios()
  };
  const debounceFiltrarVendedores = debounce(filtrarVendedores, 400);

  const vendedoresConMayoresVentas = usuarios?.toSorted(
    (vendedorA, vendedorB) => {
      const ventaTotalVendedorA = ventas.filter(
        (venta) => venta.vendedor.id === vendedorA.id
      );
      const ventaTotalVendedorB = ventas.filter(
        (venta) => venta.vendedor.id === vendedorB.id
      );

      if (ventaTotalVendedorA.length > ventaTotalVendedorB) {
        return 1;
      } else if (ventaTotalVendedorB.length < ventaTotalVendedorB) {
        return -1;
      }
      return 0; // tienen las misma cantidad de ventas
    }
  );

  return (
    <section>
      <div className="d-flex align-items-center gap-3">
        <label htmlFor="filtro" aria-label="Buscar">
          <i className="bi bi-search"></i>
        </label>
        <InputSearch
          id="filtro"
          ref={inputRef}
          placeholder="Buscar por rut, nombre, apellido o correo."
          onChange={(e) => debounceFiltrarVendedores(e.target.value)}
        />
      </div>

      <table className="table table-striped table-hove">
        <thead>
          <tr>
            <th>#</th>
            <th>Vendedor</th>
            <th>Rut</th>
            <th>Total Ventas</th>
          </tr>
        </thead>
        <tbody>
          <MagicMotion>
            {vendedoresConMayoresVentas.map((vendedor, index) => {
              const totalVentas = ventas.filter(
                (venta) => venta.vendedor.id === vendedor.id
              ).length;
              const contador = calcularContador({
                index,
                pageSize: page_size,
                currentPage: page,
              });
              console.log({ page, page_size, index, cantidad })
              return (
                <ItemSelectVendedor
                  key={vendedor.id}
                  contador={contador}
                  vendedor={vendedor}
                  index={index}
                  totalVentas={totalVentas}
                />
              );
            })}
          </MagicMotion>
        </tbody>
      </table>

      <PaginacionVendedores page={page} cambiarPagina={cambiarPagina} cantidad={cantidad} pageSize={page_size}/>


    </section>
  );
};
