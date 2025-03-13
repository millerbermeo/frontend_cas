import { BarChart } from '@tremor/react';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Select, SelectItem, Button } from '@nextui-org/react';

dayjs.locale('es');

export const BarChartActividad = () => {
    const currentYear = dayjs().year().toString();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [showFirstHalf, setShowFirstHalf] = useState(false);

    const years = [
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        { value: '2026', label: '2026' },
        { value: '2027', label: '2027' },
        { value: '2028', label: '2028' },
        { value: '2030', label: '2030' },
    ];

    const staticData = [
        { month: 'enero', total: 5 },
        { month: 'febrero', total: 8 },
        { month: 'marzo', total: 12 },
        { month: 'abril', total: 6 },
        { month: 'mayo', total: 10 },
        { month: 'junio', total: 7 },
        { month: 'julio', total: 9 },
        { month: 'agosto', total: 11 },
        { month: 'septiembre', total: 13 },
        { month: 'octubre', total: 4 },
        { month: 'noviembre', total: 6 },
        { month: 'diciembre', total: 8 },
    ];

    const firstHalfData = staticData.slice(0, 6);
    const secondHalfData = staticData.slice(6, 12);

    return (
        <div className='relative w-[85%] 2xl:w-full pb-2'>
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
        </div>
    );
};
