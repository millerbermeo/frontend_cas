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
    <div className="p-2 flex w-1/3 justify-start">
      <div className="space-y-3 w-full">
        <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          donut variant 1
        </span>
        <div className="flex justify-center w-full">
          <DonutChart
            className='w-full'
            data={chartData}
            variant="donut"
            valueFormatter={dataFormatter}
            onValueChange={(v) => console.log(v)}
          />
        </div>
      </div>
      <div className="space-y-3 w-full">
        <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          pie variant
        </span>
        <div className="flex justify-center w-full">
          <DonutChart
            data={chartData}
            variant="pie"
            valueFormatter={dataFormatter}
            onValueChange={(v) => console.log(v)}
          />
        </div>
      </div>
    </div>
  );
};
