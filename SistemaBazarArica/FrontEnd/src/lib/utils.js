// lib/utils.ts
// Para usar tailwindcss con clsx en React, se necesita una función que combine ambas librerías para poder usarlas en el mismo proyecto.
// Para poder utilizar la libreria de Componentes de Magic UI | componetes/shared/magic_ui|
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}