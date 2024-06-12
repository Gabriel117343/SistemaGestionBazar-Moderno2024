import { useContext, useEffect } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { VentasContext } from '../../../context/VentasContext'


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
  });
  
  
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

  // Convertir el objeto a un array para usar con recharts
  const dataParaGrafico = Object.values(ventasPorMes);

  // Colores para el gráfico de pastel
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <article className='row grafico'>
      <div className="col-md-6">
        <BarChart
          width={600}
          height={300}
          data={ventasEsteMes} // Usa solo las ventas de este mes
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#008000" />
        </BarChart>

      </div>
      <div className="col-md-6 d-flex align-items-center">
      <PieChart width={400} height={400}>
        <Pie
          data={dataParaGrafico}
          cx="50%"
          cy="30%"
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
      </div>
      
      
    </article>
  )

}
