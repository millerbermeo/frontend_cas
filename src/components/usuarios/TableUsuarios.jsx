import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, User, Chip, Tooltip, getKeyValue } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import * as XLSX from 'xlsx';
import axiosClient from '../../configs/axiosClient';
import { SearchIcon } from '../iconos/SearchIcon';
import { RegistrarUsuario } from './RegistrarUsuario';
import { ActualizarUsuarios } from './ActualizarUsuarios';

export const TableUsuarios = () => {
  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('usuario/listar');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const convertToCSV = (data) => {
    const headers = ["ID", "NOMBRE", "APELLIDOS", "IDENTIFICACION", "EMAIL", "ROL", "ESTADO"];
    const rows = data.map(item =>
      [item.id_usuario, item.nombre, item.apellidos, item.identificacion, item.email, item.rol, item.estado].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (data) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'usuarios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcel = (data) => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["ID", "NOMBRE", "APELLIDOS", "IDENTIFICACION", "EMAIL", "ROL", "ESTADO"],
      ...data.map(item => [
        item.id_usuario,
        item.nombre,
        item.apellidos,
        item.identificacion,
        item.email,
        item.rol,
        item.estado
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Aplicar estilos a las celdas
    const wscols = [
      { wch: 10 }, // "ID"
      { wch: 20 }, // "NOMBRE"
      { wch: 20 }, // "APELLIDOS"
      { wch: 20 }, // "IDENTIFICACION"
      { wch: 30 }, // "EMAIL"
      { wch: 15 }, // "ROL"
      { wch: 15 }  // "ESTADO"
    ];
    ws['!cols'] = wscols;

    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "FFCCCCCC" } }
    };

    ["A1", "B1", "C1", "D1", "E1", "F1", "G1"].forEach(cell => {
      ws[cell].s = headerStyle;
    });

    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, 'usuarios.xlsx');
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
  const paginatedData = data.filter(item => item.nombre.toLowerCase().includes(filterValue.toLowerCase())).slice(start, end);

  const cambiarEstado = async (id) => {
    await axiosClient.put(`usuario/desactivar/${id}`).then((response) => {
      console.log(response.data)
      fetchData()
    })
  }

  return (
    <>
      <div className='flex justify-between flex-col lg:flex-row lg:items-center w-full'>
        <div className='w-full flex-col lg:flex-row flex gap-3'>
          <Input
            color='white'
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />

          <div className='flex gap-1 mb-2 lg:mb-0'>
            <Button className='bg-[#61B2DC] text-white' auto onClick={() => downloadCSV(data)}>
              Descargar CSV
            </Button>
            <Button className='bg-green-500 text-white px-4 py-2 hover:bg-green-700' auto onClick={() => generateExcel(data)}>
              Descargar Excel
            </Button>
          </div>
        </div>

        <RegistrarUsuario fetchData={fetchData} />
      </div>

      <div className="flex justify-between items-center my-5">
        <span className="text-default-400 text-small">Total {data.length} usuarios</span>
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

      <Table className='z-0 printableTable' aria-label="Example static collection table" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
        <TableHeader>
          <TableColumn className='bg-sky-700 text-white'>ID</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>NOMBRE</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>APELLIDO</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>IDENTIFICACION</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>TELEFONO</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>EMAIL</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>ROL</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>ESTADO</TableColumn>
          <TableColumn className='bg-sky-700 text-white flex justify-center items-center'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map(item => (
            <TableRow key={item.id_usuario}>
              <TableCell>{item.id_usuario}</TableCell>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.apellidos}</TableCell>
              <TableCell>{item.identificacion}</TableCell>
              <TableCell>{item.telefono}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.rol}</TableCell>
              <TableCell>
                <div className='w-14 inline-block'>
                  {item.estado}
                </div>
                <Switch
                  size="sm"
                  defaultSelected={item.estado === 'activo'}
                  color="success"
                  onChange={() => cambiarEstado(item.id_usuario)}
                />
              </TableCell>
              <TableCell className='flex justify-center gap-2'>
                <ActualizarUsuarios usuario={item} fetchData={fetchData} />
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
