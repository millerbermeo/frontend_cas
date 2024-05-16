import { BarChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import moment from 'moment';

export const BarChartActividad = () => {
    const [chartData, setChartData] = useState([]);
    const [colors, setColors] = useState({});

    const dynamicColors = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.6)`; // Ajuste la transparencia según sea necesario
    };

    const fetchData = async () => {
        try {
            const response = await axiosClient.get('actividades/listar');
            const activities = response.data;

            // Group activities by month and count "asignada", "terminada" and total states
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

            // Convert grouped data to an array
            const formattedData = Object.values(groupedData);

            // Generate colors for each category
            const categoryColors = {
                asignada: dynamicColors(),
                terminada: dynamicColors(),
                total: dynamicColors(),
            };

            setChartData(formattedData);
            setColors(categoryColors);
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
                className='w-[60%] p-2 bg-zinc-100'
                data={chartData}
                index="month" // Use the month as the index
                categories={['asignada', 'terminada', 'total']} // Categories for the states
                colors={[colors.asignada, colors.terminada, colors.total]} // Colors for the bars
                yAxisWidth={48}
                onValueChange={(v) => console.log(v)}
            />
        </>
    );
};
