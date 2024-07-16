import { BarChart } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import dayjs from 'dayjs';
import { Button, Select, SelectItem } from '@nextui-org/react';

export const BarChartElemento = () => {
    const currentYear = dayjs().year().toString();
    const [chartData, setChartData] = useState({ firstHalfData: [], secondHalfData: [] });
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [showFirstHalf, setShowFirstHalf] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async (year) => {
        try {
            const response = await axiosClient.post('grafico/elementosmES/', { year });
            const data = response.data;

            // Ordenar y estructurar los datos
            const orderedData = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ].map(mes => ({
                mes,
                ...(data[mes] || []).reduce((acc, item, index) => {
                    acc[`elemento_${index + 1}`] = `${item.nombre_elm}: ${item.cantidad}`;
                    acc[`nombre_cantidad_${index + 1}`] = `${item.nombre_elm}: ${item.cantidad}`;
                    acc[item.nombre_elm] = item.cantidad; // Usar nombre del elemento como categoría
                    return acc;
                }, {})
            }));

            const firstHalfData = orderedData.slice(0, 6);
            const secondHalfData = orderedData.slice(6, 12);

            setChartData({ firstHalfData, secondHalfData });
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('No hay datos registrados');
        }
    };

    useEffect(() => {
        fetchData(selectedYear);
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

    const currentData = showFirstHalf ? chartData.firstHalfData : chartData.secondHalfData;

    const generateColors = (data) => {
        const colors = ['sky', 'indigo', 'rose', 'lime', 'amber', 'emerald', 'purple', 'pink', 'cyan', 'teal', 'orange', 'blue'];
        const colorMap = {};
        let colorIndex = 0;

        (data || []).forEach(item => {
            if (!colorMap[item.nombre_elm]) {
                colorMap[item.nombre_elm] = colors[colorIndex % colors.length];
                colorIndex++;
            }
        });

        return (data || []).map(item => ({
            ...item,
            color: colorMap[item.nombre_elm]
        }));
    };

    const coloredData = generateColors(currentData);
    const categories = Array.from(new Set(coloredData.flatMap(item => Object.keys(item).filter(key => key.startsWith('elemento_')).map(key => item[key].split(':')[0]))));

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
                            className='w-full p-2 bg-zinc-100 pb-14 flex justify-center items-center'
                            data={currentData}
                            index="mes"
                            categories={categories}
                            yAxisWidth={60}
                            barSpacing={0.5} // Aumentar el espacio entre las barras
                            barGroupWidth="90%" // Aumentar el ancho del grupo de barras
                            showLegend={true}
                            tooltip={(item) => `${item.mes}: ${item.nombre_cantidad_1 || ''} ${item.nombre_cantidad_2 || ''} ${item.nombre_cantidad_3 || ''}`} // Ajustar el tooltip para mostrar nombre y cantidad
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
