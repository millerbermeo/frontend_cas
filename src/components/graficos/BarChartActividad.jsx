import { BarChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Select, SelectItem, Button } from '@nextui-org/react';

dayjs.locale('es');

export const BarChartActividad = () => {
    const currentYear = dayjs().year().toString();
    const [chartData, setChartData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [showFirstHalf, setShowFirstHalf] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async (year) => {
        try {
            const response = await axiosClient.get('actividades/listar');
            const activities = response.data;

            // Filtrar actividades por el año seleccionado
            const filteredActivities = activities.filter(activity =>
                dayjs(activity.fecha_actividad).format('YYYY') === year
            );

            // Agrupar actividades por mes y contar total
            const groupedData = filteredActivities.reduce((acc, activity) => {
                const month = dayjs(activity.fecha_actividad).format('MMMM'); // Formatear el mes con nombre
                if (!acc[month]) {
                    acc[month] = {
                        month,
                        total: 0,
                    };
                }
                acc[month].total += 1;
                return acc;
            }, {});

            // Convertir datos agrupados a un array y ordenar por mes
            const monthOrder = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];

            const formattedData = monthOrder.map(month => groupedData[month] || { month, total: 0 });

            setChartData(formattedData);
            setErrorMessage('');
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
    const firstHalfData = chartData.slice(0, 6);
    const secondHalfData = chartData.slice(6, 12);

    return (
        <>
            <div className='relative w-[85%] 2xl:w-full pb-2'>
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
                            index="month"
                            categories={['total']}
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
