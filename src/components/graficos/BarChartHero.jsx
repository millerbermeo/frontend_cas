import { BarChart } from '@tremor/react';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Select, SelectItem, Button } from '@nextui-org/react';

export const BarChartHero = () => {
  const currentYear = dayjs().year().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showFirstHalf, setShowFirstHalf] = useState(true);

  const staticData = [
    { nombre_mes: 'Enero', cantidad_movimientos: 120, cantidad_entradas: 70, cantidad_salidas: 50 },
    { nombre_mes: 'Febrero', cantidad_movimientos: 150, cantidad_entradas: 90, cantidad_salidas: 60 },
    { nombre_mes: 'Marzo', cantidad_movimientos: 100, cantidad_entradas: 50, cantidad_salidas: 50 },
    { nombre_mes: 'Abril', cantidad_movimientos: 200, cantidad_entradas: 110, cantidad_salidas: 90 },
    { nombre_mes: 'Mayo', cantidad_movimientos: 180, cantidad_entradas: 95, cantidad_salidas: 85 },
    { nombre_mes: 'Junio', cantidad_movimientos: 170, cantidad_entradas: 100, cantidad_salidas: 70 },
    { nombre_mes: 'Julio', cantidad_movimientos: 130, cantidad_entradas: 80, cantidad_salidas: 50 },
    { nombre_mes: 'Agosto', cantidad_movimientos: 140, cantidad_entradas: 90, cantidad_salidas: 50 },
    { nombre_mes: 'Septiembre', cantidad_movimientos: 160, cantidad_entradas: 110, cantidad_salidas: 50 },
    { nombre_mes: 'Octubre', cantidad_movimientos: 190, cantidad_entradas: 120, cantidad_salidas: 70 },
    { nombre_mes: 'Noviembre', cantidad_movimientos: 210, cantidad_entradas: 130, cantidad_salidas: 80 },
    { nombre_mes: 'Diciembre', cantidad_movimientos: 220, cantidad_entradas: 140, cantidad_salidas: 80 },
  ];

  const firstHalfData = staticData.slice(0, 6);
  const secondHalfData = staticData.slice(6, 12);

  const years = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2030', label: '2030' },
  ];

  return (
    <div className='relative w-[85%] 2xl:w-full'>
      <div className="mb-4 w-72 -top-6 2xl:-top-5 left-4 absolute">
        <Select
          color='primary'
          className='w-full z-10'
          placeholder="Selecciona un año"
          onChange={(e) => setSelectedYear(e.target.value)}
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
        className='w-full p-2 bg-zinc-100 pb-14'
        data={showFirstHalf ? firstHalfData : secondHalfData}
        index="nombre_mes"
        categories={['cantidad_movimientos', 'cantidad_entradas', 'cantidad_salidas']}
        yAxisWidth={48}
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
  );
};
