import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, Switch } from "@nextui-org/react";
import * as XLSX from 'xlsx';
import axiosClient from '../../configs/axiosClient';
import { SearchIcon } from '../iconos/SearchIcon';
import { ActualizarActividad } from './ActualizarActividad';

export const TableActividades = () => {
  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('actividades/listar');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const convertToCSV = (data) => {
    const headers = ["ID", "TIPO", "NOMBRE", "LUGAR", "FECHA", "ESTADO"];
    const rows = data.map(item =>
      [item.id_actividad, item.tipo_actividad, item.nombre_act, item.nombre_lugar, item.fecha_actividad, item.estado].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (data) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'actividades.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcel = (data) => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["ID", "TIPO", "NOMBRE", "LUGAR", "FECHA", "ESTADO"],
      ...data.map(item => [
        item.id_actividad,
        item.tipo_actividad,
        item.nombre_act,
        item.nombre_lugar,
        item.fecha_actividad,
        item.estado
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Aplicar estilos a las celdas
    const wscols = [
      { wch: 10 }, // "ID"
      { wch: 20 }, // "TIPO"
      { wch: 30 }, // "NOMBRE"
      { wch: 20 }, // "LUGAR"
      { wch: 15 }, // "FECHA"
      { wch: 15 }  // "ESTADO"
    ];
    ws['!cols'] = wscols;

    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "FFCCCCCC" } }
    };

    ["A1", "B1", "C1", "D1", "E1", "F1"].forEach(cell => {
      ws[cell].s = headerStyle;
    });

    XLSX.utils.book_append_sheet(wb, ws, "Actividades");
    XLSX.writeFile(wb, 'actividades.xlsx');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return formattedDate;
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

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.filter(item => 
    item.id_actividad.toString().includes(filterValue.toLowerCase()) ||
    item.nombre_act.toLowerCase().includes(filterValue.toLowerCase()) ||
    formatDate(item.fecha_actividad).includes(filterValue.toLowerCase())
  ).slice(start, end);


  const cambiarEstado = async (id) => {
    await axiosClient.put(`actividades/actualizar/${id}`).then((response) => {
      console.log("actividades",response.data)
      fetchData()
    })
  }

  return (
    <>
      <div className='flex justify-between  items-center w-full'>
        <div className='w-full flex-col lg:flex-row flex gap-3'>
          <Input
            color='white'
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por ID, nombre o fecha..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />

          <div className='flex gap-1'>
            <Button className='bg-[#61B2DC] text-white' auto onClick={() => downloadCSV(data)}>
              Descargar CSV
            </Button>
            <Button className='bg-green-500 text-white px-4 py-2 hover:bg-green-700' auto onClick={() => generateExcel(data)}>
              Descargar Excel
            </Button>
          </div>
          
        </div>
      </div>

      <div className="flex justify-between items-center my-5">
        <span className="text-default-400 text-small">Total {data.length} actividades</span>
        <label className="flex items-center text-default-400 text-small">
          Filas por página:
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

      <Table className='z-0 printableTable' aria-label="Tabla de actividades" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
        <TableHeader>
          <TableColumn className='bg-sky-700 text-white'>ID</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>TIPO</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>NOMBRE</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>LUGAR</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>FECHA</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>ESTADO</TableColumn>
          <TableColumn className='bg-sky-700 text-white flex justify-center items-center'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map(item => (
            <TableRow key={item.id_actividad}>
              <TableCell>{item.id_actividad}</TableCell>
              <TableCell>{item.tipo_actividad}</TableCell>
              <TableCell>{item.nombre_act}</TableCell>
              <TableCell>{item.nombre_lugar ? item.nombre_lugar : 'NA'}</TableCell>
              <TableCell>{formatDate(item.fecha_actividad)}</TableCell>
              <TableCell>
                <div className='w-20 inline-block'>
                  {item.estado_actividad}
                </div>
                <Switch
                  size="sm"
                  defaultSelected={item.estado_actividad === 'asignada'}
                  color="success"
                  onChange={() => cambiarEstado(item.id_actividad)}
                />
              </TableCell>
              <TableCell className='flex justify-center gap-2'>
                <ActualizarActividad actividad={item} fetchData={fetchData} />
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
  );
}
