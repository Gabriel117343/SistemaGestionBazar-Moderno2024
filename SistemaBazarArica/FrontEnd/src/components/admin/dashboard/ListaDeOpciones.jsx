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
    <div className="container-card-1">
      <article className="container-card">
        <div className="tamaño-card color-card-1">
          <div className="icono-card color-card-11">
            <i class="bi bi-house-door"></i>
          </div>
          <div className="card-info">
            <div className="contenido-card">
              <h4>Ordenes de Compra</h4>
              <p> Total</p>
            </div>
            <div className="contador-card">
              <h3 className="p-0 m-0 contador-card">
                <ContadorAnimado
                  value={pedidos.length ? pedidos.length : 0}
                  className="text-white"
                />
              </h3>
            </div>
          </div>
        </div>
        <div className="tamaño-card color-card-3">
          <div className="icono-card color-card-33">
            <i class="bi bi-card-checklist"></i>
          </div>
          <div className="card-info">
            <div className="contenido-card">
              <h4>Ordenes Recibidas</h4>
              <p>Total</p>
            </div>
            <div className="contador-card">
              <h3>
                <ContadorAnimado
                  value={
                    pedidos.filter((pedido) => pedido.estado === "recibido")
                      .length
                  }
                  className="text-white"
                />
              </h3>
            </div>
          </div>
        </div>

        <div className="tamaño-card color-card-2">
          <div className="icono-card color-card-22">
            <i class="bi bi-person"></i>
          </div>
          <div className="card-info">
            <div className="contenido-card">
              <h4>Usuarios Registrados</h4>
              <p>Total</p>
            </div>
            <div className="contador-card">
              <h3 className="p-0 m-0">
                <ContadorAnimado
                  value={usuarios.length ? usuarios.length : 0}
                  className="text-white"
                />
              </h3>
            </div>
          </div>
        </div>
        <div className="tamaño-card color-card-4">
          <div className="icono-card color-card-44">
            <i class="bi bi-person-rolodex"></i>
          </div>
          <div className="card-info">
            <div className="contenido-card">
              <h4>Clientes Registrados</h4>
              <p>Total</p>
            </div>
            <div className="contador-card">
              <h3 className="p-0 m-0">
                <ContadorAnimado
                  value={clientes.length ? clientes.length : 0}
                  className="text-white"
                />
              </h3>
            </div>
          </div>
        </div>
        <div className="tamaño-card color-card-1">
          <div className="icono-card color-card-11">
            <i class="bi bi-box"></i>
          </div>
          <div className="card-info">
            <div className="contenido-card">
              <h4>Productos en Stock</h4>
              <p>Total</p>
            </div>
            <div className="contador-card">
              <h3 className="p-0 m-0">
                <ContadorAnimado
                  value={stocks.length ? stocks.length : 0}
                  className="text-white"
                />
              </h3>
            </div>
          </div>
        </div>
        <div className="tamaño-card color-card-3">
          <div className="icono-card color-card-33">
            <i class="bi bi-cash"></i>
          </div>
          <div className="card-info">
            <div className="contenido-card">
              <h4>Ventas</h4>
              <p>Total</p>
            </div>
            <div className="contador-card">
              <h3 className="p-0 m-0">
                <ContadorAnimado
                  value={ventas.length ? ventas.length : 0}
                  className="text-white"
                />
              </h3>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
