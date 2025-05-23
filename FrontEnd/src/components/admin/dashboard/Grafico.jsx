
import * as React from "react"
import '../../../styles/tailwind-component.css'; // Añade el archivo CSS específico y tailwindcss

import { useSearchParams } from 'react-router-dom'
import { cn } from "@/lib/utils"; // Importa la función `cn`
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {

  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import useDatosVentas from '../../../context/store/useDatosVentas'
import { toast } from 'react-hot-toast'
import { format, sub,  } from 'date-fns'

export const description = "An interactive area chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} 
export const Grafico = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { ventasPorProducto, getVentasPorProducto } = useDatosVentas()

  const date = new Date() // fecha de hoy

  const obtenerParametros = () => {
    return {
      fecha_inicio: searchParams.get('fecha_inicio') || format(sub(date, { days: 30 }), "yyyy-MM-dd"),
      fecha_fin: searchParams.get('fecha_fin') || format(date, "yyyy-MM-dd"),
      dias: searchParams.get('dias') || 30
    }
  }
  
  React.useEffect(() => {

    async function cargarDatos () {
      toast.loading('Obteniendo ventas por producto', { id: 'loading' })

      const parametros = obtenerParametros()
      const { success, message } = await getVentasPorProducto(parametros)
      if (!success) {
        toast.error(message, { id: 'loading' })
      }
      toast.success(message, { id: 'loading' })

    }
    cargarDatos()
    // obtener la primera fecha formateada 
 
  }, [searchParams])

  const handleRangoTiempo = (value) => {

    const fechaDeHoy = format(date, 'yyyy-MM-dd')
    const fechaAnterior = format(sub(date, { days: value }), "yyyy-MM-dd") // fecha de hoy menos los días que se quieren restar

    setSearchParams({
      fecha_inicio: fechaAnterior,
      fecha_fin: fechaDeHoy,
      dias: value
    })
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select defaultValue={searchParams.get('dias')} onValueChange={handleRangoTiempo}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={15} className="rounded-lg">
              Últimos 15 días
            </SelectItem>
            <SelectItem value={3} className="rounded-lg">
              Últimos 3 días
            </SelectItem>
            <SelectItem value={7} className="rounded-lg">
              Últimos 7 días
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={ventasPorProducto}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
        
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-CL", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-CL", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="nombre"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <Area
              dataKey="fecha"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
      
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
