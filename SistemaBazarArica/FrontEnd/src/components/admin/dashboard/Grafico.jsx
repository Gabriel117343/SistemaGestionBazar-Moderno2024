import { useContext, useEffect } from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { VentasContext } from '../../../context/VentasContext'
import { SidebarContext } from '../../../context/SidebarContext'

import React from 'react'

export const Grafico = () => {
  const { stateVenta: { ventas }, getVentasContext } = useContext(VentasContext)

  useEffect(() => {
    const cargar = () => {
      getVentasContext()
    }
    cargar()
  }, [])
  console.log(ventas)
  // Convertir el total a número y la fecha de venta a un objeto Date
  const data = ventas.map(venta => ({
    ...venta,
    total: Number(venta.total),
    fecha_venta: new Date(venta.fecha_venta)
  }))

  // Filtrar las ventas de este mes
  const NOMBRES_MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const ventasEsteMes = data.filter(venta => {
    return venta.fecha_venta.getMonth() === thisMonth && venta.fecha_venta.getFullYear() === thisYear;
  }).slice(-12); // Solo los últimos 12 registros (ventas de los últimos 12 meses)
  
  
  // Calcular el ingreso total de este mes
 

  // Grafico circular
  const ventasPorMes = data.reduce((acumulador, venta) => {
    const mes = venta.fecha_venta.getMonth();
    if (!acumulador[mes]) {
      acumulador[mes] = { mes: mes + 1, total: 0 };
    }
    acumulador[mes].total += venta.total;
    return acumulador;
  }, {});
  // Encontrar la venta más alta
  
  const EXAGONAL_COLORS = [
    '#003f5c', // Azul oscuro
    '#2f4b7c', // Azul medio oscuro
    '#665191', // Púrpura oscuro
    '#a05195', // Púrpura
    '#d45087', // Fucsia
    '#f95d6a', // Coral
    '#ff7c43', // Naranja
    '#ffa600'  // Amarillo
];
  const getExagonalColor = (totalVenta) => {

    const ventaMaxima = Math.max(...ventasEsteMes.map(venta => venta.total));
    
    const porcentajeVenta = Number((totalVenta/ ventaMaxima).toFixed(2));
    
    if (porcentajeVenta === 0) {
      return EXAGONAL_COLORS[0]; // Rojo
    } else if (porcentajeVenta > 0 && porcentajeVenta <= 0.1) {
        return EXAGONAL_COLORS[1]; // Rojo anaranjado
    } else if (porcentajeVenta > 0.1 && porcentajeVenta <= 0.2) {
        return EXAGONAL_COLORS[2]; // Naranja
    } else if (porcentajeVenta > 0.2 && porcentajeVenta <= 0.3) {
        return EXAGONAL_COLORS[3]; // Naranja amarillento
    } else if (porcentajeVenta > 0.3 && porcentajeVenta <= 0.5) {
        return EXAGONAL_COLORS[4]; // Amarillo
    } else if (porcentajeVenta > 0.5 && porcentajeVenta <= 0.7) {
        return EXAGONAL_COLORS[5]; // Amarillo verdoso
    } else if (porcentajeVenta > 0.7 && porcentajeVenta <= 0.85) {
        return EXAGONAL_COLORS[6]; // Verde lima
    } else if (porcentajeVenta > 0.86 && porcentajeVenta <= 1.00) {
      return EXAGONAL_COLORS[7]; // Verde
    } else {
        return EXAGONAL_COLORS[0]; // Rojo
    }
  }
  
  // Convertir el objeto a un array para usar con recharts
  const dataParaGrafico = Object.values(ventasPorMes);
 const v = ventas.at(-1).info_venta_tipo
  console.log(JSON.parse(v))
  // Colores para el gráfico de pastel
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <article className='container-grafico row grafico'>
      <div className="col-md-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            
          
            data={ventasEsteMes} // Usa solo las ventas de este mes
            margin={{
              top: 5, right: 30, left: 12, bottom: 12,
            }}
            
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" label={{ value: 'Ventas', position: 'insideBottom', offset: -12, style: { fontSize: '20px'} }}/>
            <YAxis label={{ value: 'Ingresos', angle: -90, position: 'insideLeft', offset: -7, style: { fontSize: '20px'}  }}/>
            <Tooltip />
            <Legend />
            <Bar  dataKey="total" barSize={40}> 
            {
              ventasEsteMes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getExagonalColor(entry.total)} />
              ))
            }
            </Bar>
          </BarChart>

        </ResponsiveContainer>
      </div>
      <div className="col-md-6 d-flex align-items-center piechart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataParaGrafico}
            cx="50%"
            cy="35%"
            labelLine={true}
            label={({ name, percent }) => `${NOMBRES_MESES[name + 1]}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total"
          >
            {
              dataParaGrafico.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="left" verticalAlign="middle"/>
        </PieChart>

      </ResponsiveContainer>
      
      </div>
      
      
    </article>
  )

}
