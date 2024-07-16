import { BarChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import dayjs from 'dayjs';
import { Select, SelectItem, Button } from '@nextui-org/react';

export const BarChartHero = () => {
  const currentYear = dayjs().year().toString();
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showFirstHalf, setShowFirstHalf] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async (year) => {
    try {
      const response = await axiosClient.post('grafico/listarMovimientosMes', { anio: year });
      if (response.data.message === 'No se encontraron registros de movimientos') {
        setChartData([]);
        setErrorMessage(response.data.message);
      } else {
        setChartData(response.data);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('No hay datos registrados');
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchData(selectedYear);
    }
  }, [selectedYear]);

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

  // Dividir los datos en dos mitades
  const firstHalfData = chartData.filter((item, index) => index < 6);
  const secondHalfData = chartData.filter((item, index) => index >= 6);

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
        {errorMessage ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">{errorMessage}</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
};
