import { BarChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import moment from 'moment';

export const BarChartActividad = () => {
    const [chartData, setChartData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axiosClient.get('actividades/listar');
            const activities = response.data;

            // Agrupar actividades por mes y contar estados "asignada", "terminada" y total
            const groupedData = activities.reduce((acc, activity) => {
                const month = moment(activity.fecha_actividad).format('YYYY-MM');
                if (!acc[month]) {
                    acc[month] = {
                        month,
                        asignada: 0,
                        terminada: 0,
                        total: 0,
                    };
                }
                if (activity.estado_actividad === 'asignada') {
                    acc[month].asignada += 1;
                } else if (activity.estado_actividad === 'terminada') {
                    acc[month].terminada += 1;
                }
                acc[month].total += 1;
                return acc;
            }, {});

            // Convertir datos agrupados a un array
            const formattedData = Object.values(groupedData);

            setChartData(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <BarChart
                className='w-[60%] p-2 bg-zinc-100 h-96'
                data={chartData}
                index="month" // Usar el mes como el índice
                categories={['asignada', 'terminada', 'total']} // Categorías para los estados
                yAxisWidth={48}
                onValueChange={(v) => console.log(v)}
            />
        </>
    );
};
