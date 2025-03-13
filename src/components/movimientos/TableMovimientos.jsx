import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from "@nextui-org/tabs";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, DatePicker } from "@nextui-org/react";
import * as XLSX from 'xlsx';
import { SearchIcon } from '../iconos/SearchIcon';
import axiosClient from '../../configs/axiosClient';
import { ModalRegistrarMov } from './ModalRegistrarMov';
import { ModalRegistrarSal } from './ModalRegistrarSal';

export const TableMovimientos = () => {
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [page, setPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [movementType, setMovementType] = useState('');

    const staticData = [
        { id_movimiento: 1, tipo_movimiento: 'entrada', cantidad_total: 100, fecha: '2024-03-01', user: 'Juan Pérez', residuo: 'Plástico', actividad: 'Reciclaje', empresa: 'EcoGreen' },
        { id_movimiento: 2, tipo_movimiento: 'salida', cantidad_total: 50, fecha: '2024-03-02', user: 'Ana Gómez', residuo: 'Vidrio', actividad: 'Venta', empresa: 'GlassCorp' },
        { id_movimiento: 3, tipo_movimiento: 'entrada', cantidad_total: 75, fecha: '2024-03-03', user: 'Carlos Ruiz', residuo: 'Papel', actividad: 'Donación', empresa: 'PaperSave' },
        { id_movimiento: 4, tipo_movimiento: 'salida', cantidad_total: 30, fecha: '2024-03-04', user: 'Lucía Fernández', residuo: 'Metal', actividad: 'Fundición', empresa: 'MetalWorks' },
        { id_movimiento: 5, tipo_movimiento: 'entrada', cantidad_total: 120, fecha: '2024-03-05', user: 'Pedro Sánchez', residuo: 'Orgánico', actividad: 'Compostaje', empresa: 'BioCompost' },
        { id_movimiento: 6, tipo_movimiento: 'salida', cantidad_total: 90, fecha: '2024-03-06', user: 'María López', residuo: 'Cartón', actividad: 'Reventa', empresa: 'CardboardX' },
        { id_movimiento: 7, tipo_movimiento: 'entrada', cantidad_total: 40, fecha: '2024-03-07', user: 'Sofía Ramírez', residuo: 'Plástico', actividad: 'Recolección', empresa: 'EcoCollect' },
        { id_movimiento: 8, tipo_movimiento: 'salida', cantidad_total: 80, fecha: '2024-03-08', user: 'Javier Torres', residuo: 'Chatarra', actividad: 'Reciclaje', empresa: 'MetalRecyc' },
        { id_movimiento: 9, tipo_movimiento: 'entrada', cantidad_total: 110, fecha: '2024-03-09', user: 'Laura Méndez', residuo: 'Aceite', actividad: 'Filtrado', empresa: 'OilClean' },
        { id_movimiento: 10, tipo_movimiento: 'salida', cantidad_total: 60, fecha: '2024-03-10', user: 'Fernando Ríos', residuo: 'Baterías', actividad: 'Descarte seguro', empresa: 'BatterySafe' },
        { id_movimiento: 11, tipo_movimiento: 'entrada', cantidad_total: 95, fecha: '2024-03-11', user: 'Elena Castro', residuo: 'Plástico', actividad: 'Reciclaje', empresa: 'EcoGreen' },
        { id_movimiento: 12, tipo_movimiento: 'salida', cantidad_total: 45, fecha: '2024-03-12', user: 'Diego Vargas', residuo: 'Vidrio', actividad: 'Venta', empresa: 'GlassCorp' },
        { id_movimiento: 13, tipo_movimiento: 'entrada', cantidad_total: 85, fecha: '2024-03-13', user: 'Camila Herrera', residuo: 'Papel', actividad: 'Donación', empresa: 'PaperSave' },
        { id_movimiento: 14, tipo_movimiento: 'salida', cantidad_total: 70, fecha: '2024-03-14', user: 'Ricardo Ortega', residuo: 'Metal', actividad: 'Fundición', empresa: 'MetalWorks' },
        { id_movimiento: 15, tipo_movimiento: 'entrada', cantidad_total: 130, fecha: '2024-03-15', user: 'Valeria Navarro', residuo: 'Orgánico', actividad: 'Compostaje', empresa: 'BioCompost' },
        { id_movimiento: 16, tipo_movimiento: 'salida', cantidad_total: 100, fecha: '2024-03-16', user: 'Andrés Fuentes', residuo: 'Cartón', actividad: 'Reventa', empresa: 'CardboardX' },
        { id_movimiento: 17, tipo_movimiento: 'entrada', cantidad_total: 55, fecha: '2024-03-17', user: 'Daniela Paredes', residuo: 'Plástico', actividad: 'Recolección', empresa: 'EcoCollect' },
        { id_movimiento: 18, tipo_movimiento: 'salida', cantidad_total: 75, fecha: '2024-03-18', user: 'Gabriel Rojas', residuo: 'Chatarra', actividad: 'Reciclaje', empresa: 'MetalRecyc' },
        { id_movimiento: 19, tipo_movimiento: 'entrada', cantidad_total: 115, fecha: '2024-03-19', user: 'Isabela Peña', residuo: 'Aceite', actividad: 'Filtrado', empresa: 'OilClean' },
        { id_movimiento: 20, tipo_movimiento: 'salida', cantidad_total: 85, fecha: '2024-03-20', user: 'José Maldonado', residuo: 'Baterías', actividad: 'Descarte seguro', empresa: 'BatterySafe' }
    ];

    const [data, setData] = useState(staticData); 

    function formatDate(dateString) {
        const date = new Date(dateString);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return formattedDate;
    }

    const fetchData = async () => {
        try {
            const response = await axiosClient.get('residuo/listar_mov');
            setData(response.data);
            console.log("mov", response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSearchChange = (value) => {
        setFilterValue(value);
        setPage(1); // Reset page number when changing search filter
    };

    const onClear = () => {
        setFilterValue('');
        setEndDate(null);
        setStartDate(null);
        setMovementType('');
        setPage(1); // Reset page number when clearing search filter
    };

    const onPageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const onRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1); // Reset page number when changing rows per page
    };

    const onPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const onNextPage = () => {
        const totalPages = Math.ceil(data.length / rowsPerPage);
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const filteredData = data
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    const convertToCSV = (data) => {
        const headers = ["ID", "TIPO MOVIMIENTO", "CANTIDAD", "FECHA", "ENCARGADO", "RESIDUO", "ACTIVIDAD", "DESTINO"];
        const rows = data.map(item =>
            [item.id_movimiento, item.tipo_movimiento, item.cantidad_total, item.fecha, item.user, item.residuo, item.actividad || "NA", item.empresa || "NA"].join(',')
        );
        return [headers.join(','), ...rows].join('\n');
    };

    const downloadCSV = (data) => {
        const csvString = convertToCSV(data);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'movimientos.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generateExcel = (data) => {
        const wb = XLSX.utils.book_new();
        const ws_data = [
            ["ID", "TIPO MOVIMIENTO", "CANTIDAD", "FECHA", "ENCARGADO", "RESIDUO", "ACTIVIDAD", "DESTINO"],
            ...data.map(item => [
                item.id_movimiento,
                item.tipo_movimiento,
                item.cantidad_total,
                formatDate(item.fecha),
                item.user,
                item.residuo,
                item.actividad || "NA",
                item.empresa || "NA"
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Aplicar estilos a las celdas
        const wscols = [
            { wch: 10 }, // "ID"
            { wch: 20 }, // "TIPO MOVIMIENTO"
            { wch: 15 }, // "CANTIDAD"
            { wch: 15 }, // "FECHA"
            { wch: 20 }, // "ENCARGADO"
            { wch: 20 }, // "RESIDUO"
            { wch: 30 }, // "ACTIVIDAD"
            { wch: 20 }  // "DESTINO"
        ];
        ws['!cols'] = wscols;

        const headerStyle = {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "FFCCCCCC" } }
        };

        ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"].forEach(cell => {
            ws[cell].s = headerStyle;
        });

        XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
        XLSX.writeFile(wb, 'movimientos.xlsx');
    };

    const handleDateChange = (key, value) => {
        if (key === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    const handleFilterByType = (type) => {
        setMovementType(type);
        setPage(1);
    };

    return (
        <>
            <div className='flex justify-between  gap-10 items-end w-full'>
                <div className='w-full flex flex-col lg:flex-row  gap-3 lg:items-end'>
                    <div className='w-full flex flex-col'>
                        <div className="flex flex-wrap gap-4 w-full">
                            <Tabs className='w-full' size="md" color='primary' aria-label="Tabs sizes">
                                <Tab title="Filtros" className='flex gap-x-2'>
                                    <Input
                                        color='white'
                                        isClearable
                                        className="w-[218px]"
                                        placeholder="Search by name Or Date"
                                        startContent={<SearchIcon />}
                                        value={filterValue}
                                        onClear={() => onClear()}
                                        onValueChange={onSearchChange}
                                    />
                                    <Button className='text-white bg-[#0284C7]' onClick={onClear}>
                                        Clear Filters
                                    </Button>
                                </Tab>
                                <Tab title="Filtrar por Fechas">
                                    <div className='w-full flex gap-x-3'>
                                        <DatePicker
                                            className='w-40'
                                            bordered
                                            color="primary"
                                            placeholder="Start Date"
                                            value={startDate}
                                            onChange={(date) => setStartDate(date)}
                                        />
                                        <DatePicker
                                            className='w-40'
                                            bordered
                                            color="primary"
                                            placeholder="End Date"
                                            value={endDate}
                                            onChange={(date) => setEndDate(date)}
                                        />
                                        <Button className='text-white bg-[#0284C7]' onClick={onClear}>
                                            Clear Filters
                                        </Button>
                                    </div>
                                </Tab>
                                <Tab title="Filtrar por Tipo">
                                    <div className='flex gap-3'>
                                        <Button className={movementType === '' ? 'text-white bg-[#0284C7]' : ''} onClick={() => handleFilterByType('')}>Todos</Button>
                                        <Button className={movementType === 'entrada' ? 'text-white bg-[#0284C7]' : ''} onClick={() => handleFilterByType('entrada')}>Entrada</Button>
                                        <Button className={movementType === 'salida' ? 'text-white bg-[#0284C7]' : ''} onClick={() => handleFilterByType('salida')}>Salida</Button>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    <div className='flex pb-[14px]'>
                        <div className='lg:flex  gap-2 grid grid-cols-2'>
                            <Button className='bg-[#61B2DC] text-white' auto onClick={() => downloadCSV(filteredData)}>
                                Descargar CSV
                            </Button>
                            <Button className='bg-green-500 text-white px-4 py-2 hover:bg-green-700' auto onClick={() => generateExcel(filteredData)}>
                                Descargar Excel
                            </Button>
                            <ModalRegistrarMov fetchData={fetchData} />
                            <ModalRegistrarSal fetchData={fetchData} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center my-5">
                <span className="text-default-400 text-small">Total {data.length} movimientos</span>
                <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        value={rowsPerPage}
                        onChange={onRowsPerPageChange}
                    >
                        <option value="6">6</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
            <Table className='printableTable' aria-label="Example static collection table" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                <TableHeader>
                    <TableColumn className='bg-sky-700 text-white'>ID</TableColumn>
                    <TableColumn className='bg-sky-700 text-white'>TIPO MOVIMIENTO</TableColumn>
                    <TableColumn className='bg-sky-700 text-white'>CANTIDAD</TableColumn>
                    <TableColumn className='bg-sky-700 text-white'>FECHA</TableColumn>
                    <TableColumn className='bg-sky-700 text-white'>ENCARGADO</TableColumn>
                    <TableColumn className='bg-sky-700 text-white'>RESIDUO</TableColumn>
                    <TableColumn className='bg-sky-700 text-white'>ACTIVIDAD</TableColumn>
                    <TableColumn className='bg-sky-700 text-white'>DESTINO</TableColumn>
                </TableHeader>
                <TableBody>
                    {paginatedData.map(item => (
                        <TableRow key={item.id_movimiento}>
                            <TableCell>{item.id_movimiento}</TableCell>
                            <TableCell>{item.tipo_movimiento}</TableCell>
                            <TableCell>{item.cantidad_total}</TableCell>
                            <TableCell>{formatDate(item.fecha)}</TableCell>
                            <TableCell>{item.user}</TableCell>
                            <TableCell>{item.residuo}</TableCell>
                            <TableCell>{item.actividad ? item.actividad : "NA"}</TableCell>
                            <TableCell>{item.empresa ? item.empresa : 'NA'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="py-2 px-2 flex justify-between my-2 items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={Math.ceil(data.length / rowsPerPage)}
                    onChange={onPageChange}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={page === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={page === Math.ceil(data.length / rowsPerPage)} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
};
