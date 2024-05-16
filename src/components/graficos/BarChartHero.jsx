import { BarChart } from '@tremor/react';
import React, { useEffect, useState } from 'react'
import axiosClient from '../../configs/axiosClient';




export const BarChartHero = () => {

  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('grafico/listarMovimientosMes');
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (

    <>
      <BarChart
      className='w-full p-2 bg-zinc-100'
      data={chartData}
      index="nombre_mes" // Asegúrate de utilizar el nombre correcto del índice de tus datos
      categories={['cantidad_movimientos', 'cantidad_entradas', 'cantidad_salidas']} // Ajusta las categorías según tus datos
      colors={['blue', 'green', 'red']} // Ajusta los colores según tus preferencias
      yAxisWidth={48}
      onValueChange={(v) => console.log(v)}
    />
    </>
  )
}
