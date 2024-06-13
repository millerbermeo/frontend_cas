import { BarChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';

export const BarChartElemento = () => {
    const [chartData, setChartData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            const response = await axiosClient.get('elemento/listar');
            const formattedData = response.data.map(item => ({
                name: item.nombre_elemento, // Usar el nombre del elemento
                value: item.cantidad // Usar la cantidad
            }));

            // Ordenar datos por valor
            const sortedData = formattedData.sort((a, b) => b.value - a.value);

            // Obtener los cinco con más cantidad y los cinco con menos cantidad
            const topFive = sortedData.slice(0, 5);
            const bottomFive = sortedData.slice(-5);

            setChartData([...topFive, ...bottomFive]);
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('No hay datos registrados');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='relative w-[85%] 2xl:w-full'>
            {errorMessage ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">{errorMessage}</p>
                </div>
            ) : (
                <BarChart
                    className='w-full p-2 bg-zinc-100 pb-14'
                    data={chartData}
                    index="name"
                    categories={['value']}
                    yAxisWidth={60}
                />
            )}
        </div>
    );
};
