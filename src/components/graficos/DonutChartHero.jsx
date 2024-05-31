import { DonutChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';

export const DonutChartHero = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('grafico/listarTipos');
      // Transformar los datos recibidos para que se ajusten al formato esperado por DonutChart
      const transformedData = response.data.map(item => ({
        name: item.tipo_residuo,
        value: parseInt(item.cantidad) // Convertir la cantidad a un entero
      }));
      setChartData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dataFormatter = (number) => Intl.NumberFormat('us').format(number).toString();

  return (
    <div className="flex justify-center w-60 2xl:w-96 h-full items-center bg-zinc-50">
      <div className="space-y-3 w-96 p-8 h-full rounded-lg">

        <div className="flex justify-center relative">
          <span className='text-xl absolute -top-3 -left-2 2xl:left-16 2xl:top-44'>Cantidad de Residuos</span>
          <DonutChart
            className='h-80'
            data={chartData}
            variant="donut"
            valueFormatter={dataFormatter}
            onValueChange={(v) => console.log(v)}
          />
        </div>
      </div>
    </div>
  );
};
