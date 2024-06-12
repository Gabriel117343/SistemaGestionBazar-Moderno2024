import React, { useContext, useEffect } from "react";
import "./styless.css";
import { UsuariosContext } from "../../../context/UsuariosContext";
import { StocksContext } from "../../../context/StocksContext";
import { PedidosContext } from "../../../context/PedidosContext";
import { VentasContext } from "../../../context/VentasContext";
import { ClientesContext } from "../../../context/ClientesContext";
import ContadorAnimado from "../../shared/magic_ui/ContadorAnimado";
import { TargetasDashboard } from "../../shared/TargetasDashboard";

export const ListaDeOpciones = () => {
  const {
    stateUsuario: { usuarios },
    getUsuarios,
  } = useContext(UsuariosContext);
  const {
    stateStock: { stocks },
    getStocksContext,
  } = useContext(StocksContext);
  const {
    statePedido: { pedidos },
    getPedidosContext,
  } = useContext(PedidosContext);
  const {
    stateVenta: { ventas },
    getVentasContext,
  } = useContext(VentasContext);
  const {
    stateCliente: { clientes },
    getClientesContext,
  } = useContext(ClientesContext);

  useEffect(() => {
    const cargar = () => {
      getUsuarios(); // llamando a la funcion para obtener los usuarios
      getStocksContext(); // llamando a la funcion para obtener los stocks
      getPedidosContext(); // llamando a la funcion para obtener los pedidos
      getVentasContext(); // llamando a la funcion para obtener las ventas
      getClientesContext(); // llamando a la funcion para obtener los clientes
    };
    cargar();
  }, []);

  const stocksContados = stocks
    .map((stock) => stock.cantidad)
    .reduce((a, b) => a + b, 0); // sumando los stocks

  return (
    <div >
      <article className="container-card">
        <div className="tamaño-card">
          <div className="card card-body color-card-1 text-white">
            <div className="row">
              <div className="col-md-9">
                <h4 className="texto-nowrap">Ordenes de Compra</h4>
                <p> Total</p>
              </div>
              <div className="col-md-3 d-flex align-items-end justify-content-end">
                <h3 className="p-0 m-0">
                  <ContadorAnimado
                    value={pedidos.length ? pedidos.length : 0}
                    className="text-white"
                  />
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="tamaño-card">
          <div className="card card-body color-card-3 text-white">
            <div className="row">
              <div className="col-md-8">
                <h4 className="texto-nowrap">Ordenes Recibidas</h4>
                <p>Total</p>
              </div>
              <div className="col-md-4 d-flex align-items-end justify-content-end">
              <h3 className="p-0 m-0">
                  <ContadorAnimado
                    value={pedidos.filter(pedido => pedido.estado === 'recibido').length}
                    className="text-white"
                  />
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="tamaño-card">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-body color-card-2 text-white">
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="texto-nowrap">Devoluciones</h4>
                    <p>Total</p>
                  </div>
                  <div className="col-md-4 d-flex align-items-end justify-content-end">
                    <h3 className="p-0 m-0">0</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tamaño-card">
          <div className="card card-body color-card-4 text-white">
            <div className="row">
              <div className="col-md-8">
                <h4 className="texto-nowrap">Clientes Registrados</h4>
                <p>Total</p>
              </div>
              <div className="col-md-4 d-flex align-items-end justify-content-end">
                <h3 className="p-0 m-0">
                  <ContadorAnimado
                    value={clientes.length ? clientes.length : 0}
                    className="text-white"
                  />
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="tamaño-card">
          <div className="card card-body color-card-1 text-white">
            <div className="row">
              <div className="col-md-8">
                <h4 className="texto-nowrap">Stock en Tienda</h4>
                <p>Total</p>
              </div>
              <div className="col-md-4 d-flex align-items-end justify-content-end">
                <h3 className="p-0 m-0">
                  <ContadorAnimado
                    value={stocksContados ? stocksContados : 0}
                    className="text-white"
                  />
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="tamaño-card">
          <div className="card card-body color-card-4 text-white">
            <div className="row">
              <div className="col-md-8">
                <h4 className="texto-nowrap">Ventas</h4>
                <p>Total</p>
              </div>
              <div className="col-md-4 d-flex align-items-end justify-content-end">
                <h3 className="p-0 m-0">
                  <ContadorAnimado
                    value={ventas.length ? ventas.length : 0}
                    className="text-white"
                  />
                </h3>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
