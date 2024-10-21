import { toast } from 'react-hot-toast'
const handleBeforePrint = (componentRef) => {
  const table = componentRef.current;
  if (!table) {
   
    toast.error("No hay datos para imprimir.", { duration: 2000 });
    return false; // Previene la impresión
  }
  return true; // Permite la impresión
};
export default handleBeforePrint;