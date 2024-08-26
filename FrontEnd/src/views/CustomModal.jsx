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

  const handleDialogClick = (e) => {
    // detiene la propagación del evento onClick para que no se cierre el modal
    e.stopPropagation();
  };

  return (
    show && (
      <div className="modal-overlay" onClick={onHide}>
        <dialog
          aria-atomic="true"
          ref={ref}
          open={show}
          onClose={onHide}
          tabIndex="-1"
          className="custom-modal"
          onClick={e => handleDialogClick(e)}
        >
          {children}
        </dialog>
      </div>
    )
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
