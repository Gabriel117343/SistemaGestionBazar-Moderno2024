"use client";
// TAREA - USAR LA ULTIMA VERSION DE REACT PARA SOLO CARGAR TAILWINDCSS EN ESTE COMPONENTE
import { cn } from "@/lib/utils";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export default function ContadorAnimado({
  value,
  direction = "up",
  delay = 0,
  className,
}) {

  const ref = useRef(null); // Cambiado aquí
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(
            latest.toFixed(0),
          );
        }
      }),
    [springValue],
  );
 
  return (
    <span
      className={cn(
        "inline-block tabular-nums",
        className,
      )}
      ref={ref}
    />
  );
}
