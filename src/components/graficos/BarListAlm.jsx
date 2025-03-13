import React, { useEffect, useState } from 'react';
import { BarList } from '@tremor/react';
import axiosClient from '../../configs/axiosClient';

export const BarListAlm = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('grafico/listarAlm');
      setChartData(response.data.map(item => ({
        name: item.nombre_alm,
        value: item.cantidad_alm
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const staticData = [
    { name: 'Almacén A', value: 120 },
    { name: 'Almacén B', value: 90 },
    { name: 'Almacén C', value: 150 },
    { name: 'Almacén D', value: 60 },
    { name: 'Almacén E', value: 200 }
  ];




  return (
    <div className="p-3 bg-zinc-100 h-96">
      <div className='flex justify-between mb-3'><span>Almacenamiento</span> <span>Cantidad</span></div>
      <BarList
        data={staticData} index="name"
        categories={['value']}
        className="mx-auto w-80 2xl:w-96"
      />
    </div>
  );
};
