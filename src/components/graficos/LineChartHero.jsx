import { LineChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';

const dataFormatter = (number) => `${number} hrs`;

export const LineChartHero = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('actividades/listar');
      const formattedData = response.data.map(item => ({
        date: new Date(item.fecha_actividad).toISOString().split('T')[0], // Extract the date part
        value: parseFloat(item.hora_inicial.split(':')[0]) // Convert hour to a number
      }));
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LineChart
      className="h-80"
      data={chartData}
      index="date"
      categories={['value']}
      colors={['indigo', 'rose']}
      valueFormatter={dataFormatter}
      yAxisWidth={60}
      onValueChange={(v) => console.log(v)}
    />
  );
}
