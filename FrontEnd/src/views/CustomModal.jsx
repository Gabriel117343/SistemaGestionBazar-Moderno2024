import React, { useEffect, forwardRef } from "react";
import "./views.css";

// recibe el Header y el Body como hijos

const CustomModal = forwardRef(({ children, show, onHide }, ref) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
    }
  }, [show]);

  // Convertir children a un array y filtrar Header y Body
  const childrenArray = React.Children.toArray(children);
  const header = childrenArray.find(
    (child) => child.type === CustomModal.Header
  );
  const body = childrenArray.find((child) => child.type === CustomModal.Body);

  return (
    <>
      {show && (
        <>
          <div open={show} className="modal-overlay" onClick={onHide} />
        </>
      )}
      <dialog
        aria-atomic="true"
        ref={ref}
        open={show}
        onClose={onHide}
        tabIndex="-1"
        className="custom-modal"
      >
        {header}
        {/** Dado que el contenido del body puede recibir props  puede causar errores, se condiciona para mostrarlo si se llamo con show*/}
        {show && <div className="modal-content">{body}</div>}
      </dialog>{" "}
    </>
  );
});

// Estos componentes son una propiedad estática de CustomModal (propiedad de la función o clase CustomModal)
CustomModal.Header = ({ children }) => {
  return <div className="modal-header">{children}</div>;
};

CustomModal.Body = ({ children }) => {
  return <div className="modal-body">{children}</div>;
};

export default CustomModal;
