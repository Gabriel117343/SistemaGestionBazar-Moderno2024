"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
// ESTO COMPONENTE FUE MODIFICADO DEL GRADUALSPACING ORIGINAL de la WEB DE MAGIC UI
export default function GradualSpacing({
  text,
  duration = 0.5,
  delayMultiple = 0.005,
  framerProps = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  className,
  type = 'h1', // Se agrego un type por ejemplo puedo pasarle etiquetas como: h1, h2, h3, h4, h5, h6, p, span, etc...
}) {
  const MotionComponent = motion[type]; // Obtener el componente de React correspondiente al tipo
  return (
    <div className="flex justify-center space-x-1">
      <MotionComponent
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={framerProps}
        transition={{ duration, delay: text.length * delayMultiple }}
        className={cn("drop-shadow-sm inline-block", className)}
      >
        {text}
      </MotionComponent>
    </div>
  );
}
