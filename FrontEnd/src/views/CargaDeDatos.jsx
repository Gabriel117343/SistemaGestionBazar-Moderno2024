import "./views.css";

// Mientras se cargan los datos, se muestra un spinner de carga de datos en el centro de la pantalla
export default function CargaDeDatos() {
  return (
    <div className="d-flex justify-content-center pt-5">
      <svg className="svg-carga-datos" viewBox="0 0 100 100">
        <g
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        >
          <path d="M 21 40 V 59">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 21 59; 180 21 59"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          <path d="M 79 40 V 59">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 79 59; -180 79 59"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          <path d="M 50 21 V 40">
            <animate
              attributeName="d"
              values="M 50 21 V 40; M 50 59 V 40"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          <path d="M 50 60 V 79">
            <animate
              attributeName="d"
              values="M 50 60 V 79; M 50 98 V 79"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          <path d="M 50 21 L 79 40 L 50 60 L 21 40 Z">
            <animate
              attributeName="stroke"
              values="rgba(255,255,255,1); rgba(100,100,100,0)"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          <path d="M 50 40 L 79 59 L 50 79 L 21 59 Z" />

          <path d="M 50 59 L 79 78 L 50 98 L 21 78 Z">
            <animate
              attributeName="stroke"
              values="rgba(100,100,100,0); rgba(255,255,255,1)"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0 0; 0 -19"
            dur="2s"
            repeatCount="indefinite"
          />
        </g>
      </svg>
    </div>
  );
}
