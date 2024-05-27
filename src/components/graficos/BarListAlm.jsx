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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-3 bg-zinc-100 h-96">
      <div className='flex justify-between mb-3'><span>Almacenamiento</span> <span>Cantidad</span></div>
      <BarList
        data={chartData}
        index="name"
        categories={['value']}
        className="mx-auto w-80 2xl:w-96"
      />
    </div>
  );
};
