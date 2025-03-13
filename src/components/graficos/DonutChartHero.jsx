import { DonutChart } from '@tremor/react';
import React from 'react';

export const DonutChartHero = () => {
  // Datos estáticos
  const chartData = [
    { name: 'Plástico', value: 150 },
    { name: 'Papel', value: 120 },
    { name: 'Vidrio', value: 80 },
    { name: 'Metal', value: 50 },
  ];

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
