import { useContext, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { VentasContext } from "../../../context/VentasContext";

export const Grafico = () => {
  const {
    stateVenta: { ventas },
    getVentasContext,
  } = useContext(VentasContext);

  useEffect(() => {
    const cargar = () => {
      getVentasContext();
    };
    cargar();
  }, []);
  console.log(ventas);
  // Convertir el total a número y la fecha de venta a un objeto Date
  const data = ventas.map((venta) => ({
    ...venta,
    total: Number(venta.total),
    fecha_venta: new Date(venta.fecha_venta),
  }));

  // Filtrar las ventas de este mes
  const NOMBRES_MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const ventasEsteMes = data
    .filter((venta) => {
      return (
        venta.fecha_venta.getMonth() === thisMonth &&
        venta.fecha_venta.getFullYear() === thisYear
      );
    })
    .slice(-12); // Solo los últimos 12 registros (ventas de los últimos 12 meses)

  // Grafico circular
  const ventasPorMes = data.reduce((acumulador, venta) => {
    const mes = venta.fecha_venta.getMonth();
    const año = venta.fecha_venta.getFullYear();

    if (!acumulador[mes]) {
      if (año !== thisYear) return acumulador; // Ignorar ventas de años anteriores
      acumulador[mes] = { mes: mes + 1, total: 0 };
    }
    acumulador[mes].total += venta.total;
    return acumulador;
  }, {});
  // Encontrar la venta más alta
  
  const rangosYColores = [
    { max: 0.0, color: "#003f5c" }, // Rojo
    { max: 0.1, color: "#2f4b7c" }, // Rojo anaranjado
    { max: 0.2, color: "#665191" }, // Naranja
    { max: 0.3, color: "#a05195" }, // Naranja amarillento
    { max: 0.5, color: "#d45087" }, // Amarillo
    { max: 0.7, color: "#f95d6a" }, // Amarillo verdoso
    { max: 0.85, color: "#ff7c43" }, // Verde lima
    { max: 1.0, color: "#ffa600" }, // Verde
  ];
  const getExagonalColor = (totalVenta) => {
    const ventaMaxima = Math.max(...ventasEsteMes.map((venta) => venta.total));

    const porcentajeVenta = Number((totalVenta / ventaMaxima).toFixed(2));

    // Encontrar el color correspondiente al porcentaje de venta
  for (let rango of rangosYColores) {
    if (porcentajeVenta <= rango.max) {
      return rango.color;
    }
  }
  };

  // Convertir el objeto a un array para usar con recharts
  const dataParaGrafico = Object.values(ventasPorMes);
  console.log(dataParaGrafico);
  //  const v = ventas.at(-1).info_venta_tipo
  //   console.log(JSON.parse(v))
  // Colores para el gráfico de pastel
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <article className="container-grafico row grafico">
      <div className="col-md-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ventasEsteMes} // Usa solo las ventas de este mes
            margin={{
              top: 5,
              right: 30,
              left: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="id"
              label={{
                value: "Ventas",
                position: "insideBottom",
                offset: -12,
                style: { fontSize: "20px" },
              }}
            />
            <YAxis
              label={{
                value: "Ingresos",
                angle: -90,
                position: "insideLeft",
                offset: -7,
                style: { fontSize: "20px" },
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" barSize={40}>
              {ventasEsteMes.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getExagonalColor(entry.total)}
                />
              ))}
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
              cy="48%"
              labelLine={true}
              label={({ mes, percent }) =>
                `${NOMBRES_MESES[mes - 1]}: ${(percent * 100).toFixed(1)}%`
              }
              outerRadius={90}
              fill="#8884d8"
              dataKey="total"
            >
              {dataParaGrafico.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend layout="vertical" align="left" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};
