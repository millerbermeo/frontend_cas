import { BarChart } from '@tremor/react';
import React, { useState } from 'react';
import { Button, Select, SelectItem } from '@nextui-org/react';
import dayjs from 'dayjs';

export const BarChartElemento = () => {
  const currentYear = dayjs().year().toString();
  const [chartData, setChartData] = useState({
    firstHalfData: [
      { mes: 'Enero', elemento_1: 120, elemento_2: 90, elemento_3: 80 },
      { mes: 'Febrero', elemento_1: 130, elemento_2: 100, elemento_3: 70 },
      { mes: 'Marzo', elemento_1: 150, elemento_2: 80, elemento_3: 110 },
      { mes: 'Abril', elemento_1: 110, elemento_2: 120, elemento_3: 90 },
      { mes: 'Mayo', elemento_1: 100, elemento_2: 110, elemento_3: 120 },
      { mes: 'Junio', elemento_1: 90, elemento_2: 140, elemento_3: 130 }
    ],
    secondHalfData: [
      { mes: 'Julio', elemento_1: 80, elemento_2: 120, elemento_3: 110 },
      { mes: 'Agosto', elemento_1: 140, elemento_2: 130, elemento_3: 90 },
      { mes: 'Septiembre', elemento_1: 100, elemento_2: 80, elemento_3: 150 },
      { mes: 'Octubre', elemento_1: 110, elemento_2: 90, elemento_3: 140 },
      { mes: 'Noviembre', elemento_1: 120, elemento_2: 100, elemento_3: 110 },
      { mes: 'Diciembre', elemento_1: 130, elemento_2: 120, elemento_3: 90 }
    ]
  });

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showFirstHalf, setShowFirstHalf] = useState(false);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const years = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2030', label: '2030' },
  ];

  const currentData = showFirstHalf ? chartData.firstHalfData : chartData.secondHalfData;

  const categories = ['Elemento 1', 'Elemento 2', 'Elemento 3'];

  return (
    <>
      <div className='relative w-[85%] 2xl:w-full'>
        <div className="mb-4 w-72 -top-6 2xl:-top-5 left-4 absolute">
          <Select
            color='primary'
            className='w-full z-10'
            placeholder="Selecciona un año"
            onChange={(e) => handleYearChange(e.target.value)}
            value={selectedYear}
          >
            <SelectItem disabled value="">Seleccionar Año</SelectItem>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <BarChart
          className='w-full p-2 bg-zinc-100 pb-14 flex justify-center items-center'
          data={currentData}
          index="mes"
          categories={categories}
          yAxisWidth={60}
          barSpacing={0.5} // Aumentar el espacio entre las barras
          barGroupWidth="90%" // Aumentar el ancho del grupo de barras
          showLegend={true}
          tooltip={(item) => `${item.mes}: ${item.elemento_1 || ''} ${item.elemento_2 || ''} ${item.elemento_3 || ''}`} // Ajustar el tooltip para mostrar nombre y cantidad
        />
        <div className="flex justify-end -mt-12 pr-4">
          <Button
            onClick={() => setShowFirstHalf(true)}
            disabled={showFirstHalf}
            className={showFirstHalf ? 'bg-blue-500 text-white' : 'bg-gray-200'}
          >
            Mostrar primeros 6 meses
          </Button>
          <Button
            onClick={() => setShowFirstHalf(false)}
            disabled={!showFirstHalf}
            className={!showFirstHalf ? 'bg-blue-500 text-white ml-2' : 'bg-gray-200 ml-2'}
          >
            Mostrar últimos 6 meses
          </Button>
        </div>
      </div>
    </>
  );
};
