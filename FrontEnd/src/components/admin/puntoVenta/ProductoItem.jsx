import React from "react";
import { CartOutlineSum } from "../../ui/svg/CartSvg";
import { ExclamationCircle } from "../../ui/svg/AlertsSvg";
export const ProductoItemPrimary = ({
  producto,
  cantidadCalculada,
  agregarProducto,
}) => {
  return (
    <li key={producto.id} className="producto">
      {cantidadCalculada <= 5 && (
        <div className="icono-informativo">
          <ExclamationCircle width={20} height={20} fill="#ff7272" />
        </div>
      )}
      <div
        className={`producto-img ${cantidadCalculada === 0 ? "img-blanco-negro" : ""}`}
      >
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={`esto es una imagen de un ${producto.nombre}`}
            loading="lazy"

          />
        ) : (
          <img
            width="100%"
            height="150px"
            src="https://ww.idelcosa.com/img/default.jpg"
            alt="esta es una imagen por defecto"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-0 m-0 producto-info">
        <p className="producto_nombre m-0">{producto.nombre}</p>
        <div className="d-flex justify-content-center">
          <p className="p-0 m-0 text-success precio-num">${producto.precio}</p>
          <div className="d-flex align-items-center stock-num">
            <strong className={`p-0 m-0 ps-2 d-flex align-items-center`}>
              Stock:
            </strong>
            <p className={`${cantidadCalculada === 0 && "text-danger"}`}>
              {cantidadCalculada}
            </p>
          </div>
        </div>
      </div>
      <div className="pt-0 mt-0 btn-agregar">
        <button
          onClick={() => agregarProducto(producto)}
          className="d-flex justify-content-center align-items-center gap-1"
        >
          <CartOutlineSum width="16" height="16" fill='white' />
          <span>Agregar</span>
        </button>
      </div>
    </li>
  );
};

export const ProductoItemSecondary = ({
  producto,
  cantidadCalculada,
  agregarProducto,
}) => {
  return (
    <tr>
      <td>{producto.nombre}</td>
      <td className="text-success precio-num">${producto.precio}</td>
      <td className={`${cantidadCalculada === 0 ? "text-danger" : ""}`}>
        {cantidadCalculada}
      </td>
      <td>
        <button
          onClick={() => agregarProducto(producto)}
          className="btn btn-primary  d-flex align-items-center justify-content-center"
          disabled={cantidadCalculada === 0}
        >
            <CartOutlineSum width="16" height="16" fill='white' />
            <span>Agregar</span>
        </button>
      </td>
    </tr>
  );
};
