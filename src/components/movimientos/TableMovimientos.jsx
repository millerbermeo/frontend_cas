import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from "@nextui-org/tabs";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, User, Chip, Tooltip, getKeyValue, DatePicker } from "@nextui-org/react";
import { SearchIcon } from '../iconos/SearchIcon';
import axiosClient from '../../configs/axiosClient';
import { ModalRegistrarMov } from './ModalRegistrarMov';
import { ModalRegistrarSal } from './ModalRegistrarSal';



export const TableMovimientos = () => {

    const [data, setData] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [page, setPage] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [movementType, setMovementType] = useState('');



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
        setEndDate(null)
        setStartDate(null)
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

    const filteredData = data.filter(item => {
        const itemDate = new Date(item.fecha);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        const typeMatch = movementType ? item.tipo_movimiento.toLowerCase() === movementType.toLowerCase() : true;
        const dateMatches = formatDate(item.fecha).includes(filterValue);
        const nameMatches = item.nombre_residuo.toLowerCase().includes(filterValue.toLowerCase());
        return (!start || itemDate >= start) && (!end || itemDate <= end) && typeMatch && (nameMatches || dateMatches);
    });


    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    const statusColorMap = {
        active: "success",
        paused: "danger",
        vacation: "warning",
    };

    const convertToCSV = (data) => {
        const headers = ["ID", "TIPO MOVIMIENTO", "CANTIDAD", "FECHA", "ENCARGADO", "RESIDUO", "ACTIVIDAD", "DESTINO"];
        const rows = data.map(item =>
            [item.id_movimiento, item.tipo_movimiento, item.cantidad_total, item.fecha, item.user, item.residuo, item.actividad].join(',')
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

    const printTable = () => {
        const printContents = document.querySelector('.printableTable').outerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Esto es opcional para restaurar completamente el estado de la página.
    };

    const handleDateChange = (key, value) => {
        if (key === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    const filterData = () => {
        return data.filter(item => {
            const date = new Date(item.fecha);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || date >= start) && (!end || date <= end);
        });
    };


    const handleFilterByType = (type) => {
        setMovementType(type);
        setPage(1);
    };

    const sizes = [
        "sm",
        "md",
        "lg",
    ];



    return (
        <>

            <div className='flex justify-between gap-10 items-end w-full'>

                <div className='w-full flex gap-3 items-end'>
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
                                    <Button className='text-white' color="primary" onClick={onClear}>
                                        Clear Filters
                                    </Button>

                                </Tab>

                                <Tab title="Filtrar por Fechas">

                                    <div className='w-full flex gap-x-3'>
                                        <DatePicker
                                            // label="Fecha Inicial"
                                            className='w-40'
                                            bordered
                                            color="primary"
                                            placeholder="Start Date"
                                            value={startDate}
                                            onChange={(date) => setStartDate(date)}
                                        />
                                        <DatePicker
                                            // label="Fecha Final"
                                            className='w-40'
                                            bordered
                                            color="primary"
                                            placeholder="End Date"
                                            value={endDate}
                                            onChange={(date) => setEndDate(date)}
                                        />

                                        <Button className='text-white' color="primary" onClick={onClear}>
                                            Clear Filters
                                        </Button>
                                    </div>
                                </Tab>
                                <Tab title="Filtrar por Tipo">
                                    <div className='flex gap-3'>
                                    <Button className='text-white' color="primary" onClick={onClear}>
                                            Todos
                                        </Button>
                                        <Button color="default" onPress={() => handleFilterByType('entrada')}>Entrada</Button>
                                        <Button color="success" onPress={() => handleFilterByType('salida')}>Salida</Button>
                                    </div>
                                </Tab>
                            </Tabs>

                        </div>








                    </div>

                    <div className='flex pb-[14px]'>
                        <div className='flex gap-2'>
                            <Button color="secondary" auto onClick={() => downloadCSV(data)}>
                                Descargar CSV
                            </Button>
                            <Button color="primary" auto onClick={printTable}>
                                Imprimir Tabla
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
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>

            <Table className='printableTable' aria-label="Example static collection table" selectedKeys={selectedKeys} selectionMode="multiple" onSelectionChange={setSelectedKeys}>
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>TIPO MOVIMIENTO</TableColumn>
                    <TableColumn>CANTIDAD</TableColumn>
                    <TableColumn>FECHA</TableColumn>
                    <TableColumn>ENCARGADO</TableColumn>
                    <TableColumn>RESIDUO</TableColumn>
                    <TableColumn>ACTIVIDAD</TableColumn>
                    <TableColumn>DESTINO</TableColumn>
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

                            <TableCell>
                      


                                {item.empresa ? item.empresa : 'NA'}
                            </TableCell>
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
    )
}
