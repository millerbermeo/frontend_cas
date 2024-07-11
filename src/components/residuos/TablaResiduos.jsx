import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, Select, SelectItem } from "@nextui-org/react";
import * as XLSX from 'xlsx';
import axiosClient from '../../configs/axiosClient';
import { SearchIcon } from '../iconos/SearchIcon';
import { ModalRegisterResiduo } from './ModalRegisterResiduo';
import { ModalActualizarResiduos } from './ModalActualizarResiduos';

export const TablaResiduos = () => {
  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState(''); 

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('residuo/listar');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const convertToCSV = (data) => {
    const headers = ["ID", "NOMBRE", "RESIDUO", "TIPO", "CANTIDAD", "UNIDAD MEDIDA", "ALMACENAMIENTO"];
    const rows = data.map(item =>
      [item.id_residuo, item.nombre_residuo, item.residuo, item.tipo_residuo, item.cantidad, item.unidad_medida, item.alm].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (data) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'residuos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcel = (data) => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["ID", "NOMBRE", "RESIDUO", "TIPO", "CANTIDAD", "UNIDAD MEDIDA", "ALMACENAMIENTO"],
      ...data.map(item => [
        item.id_residuo,
        item.nombre_residuo,
        item.residuo,
        item.tipo_residuo,
        item.cantidad,
        item.unidad_medida,
        item.alm
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Aplicar estilos a las celdas
    const wscols = [
      { wch: 10 }, // "ID"
      { wch: 20 }, // "NOMBRE"
      { wch: 20 }, // "RESIDUO"
      { wch: 20 }, // "TIPO"
      { wch: 10 }, // "CANTIDAD"
      { wch: 15 }, // "UNIDAD MEDIDA"
      { wch: 25 }  // "ALMACENAMIENTO"
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

    XLSX.utils.book_append_sheet(wb, ws, "Residuos");
    XLSX.writeFile(wb, 'residuos.xlsx');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearchChange = (value) => {
    setFilterName(value);
    setPage(1); // Reset page number when changing search filter
  };

  const onClear = () => {
    setFilterName('');
    setFilterType(''); // Clear type filter as well
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
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const filteredData = data.filter(item => {
    const nameMatches = item.nombre_residuo.toLowerCase().includes(filterName.toLowerCase());
    const typeMatches = filterType ? item.residuo.toLowerCase() === filterType.toLowerCase() : true;
    return nameMatches && typeMatches;
  });

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = filteredData.slice(start, end);

  const handleFilterByType = (type) => {
    setFilterType(type);
    setPage(1);
  };

  return (
    <>
      <div className='flex flex-col lg:flex-row justify-between lg:items-center w-full'>
        <div className='w-full flex-col lg:flex-row flex gap-3'>
          <Input
            color='white'
            isClearable
            className="w-96 sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterName}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <select
            placeholder="Filter by type"
            className="w-40 2xl:w-96 sm:max-w-[44%] border rounded-md overflow-hidden"
            value={filterType}
            onChange={(e) => handleFilterByType(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="peligrosos">Peligrosos</option>
            <option value="no peligrosos">No Peligrosos</option>
          </select>

          <div className='flex gap-1 mb-2 lg:mb-0'>
            <Button className='bg-[#61B2DC] text-white' auto onClick={() => downloadCSV(filteredData)}>
              Descargar CSV
            </Button>
            <Button className='bg-green-500 text-white px-4 py-2 hover:bg-green-700' auto onClick={() => generateExcel(filteredData)}>
              Descargar Excel
            </Button>
          </div>
        </div>

        <ModalRegisterResiduo fetchData={fetchData} />
      </div>

      <div className="flex justify-between items-center my-5">
        <span className="text-default-400 text-small">Total {filteredData.length} residuos</span>
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

      <Table className='z-0 printableTable' aria-label="Example static collection table" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
        <TableHeader>
          <TableColumn className='bg-sky-700 text-white'>ID</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>NOMBRE</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>RESIDUO</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>TIPO</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>DESCRIPCION</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>CANTIDAD</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>UNIDAD MEDIDA</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>ALMACENAMIENTO</TableColumn>
          <TableColumn className='bg-sky-700 text-white flex justify-center items-center'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map(item => (
            <TableRow key={item.id_residuo}>
              <TableCell>{item.id_residuo}</TableCell>
              <TableCell>{item.nombre_residuo}</TableCell>
              <TableCell>{item.residuo}</TableCell>
              <TableCell>{item.tipo_residuo}</TableCell>
              <TableCell>{item.descripcion ? item.descripcion : 'NA'}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>{item.unidad_medida}</TableCell>
              <TableCell>{item.alm}</TableCell>
              <TableCell className='flex justify-center gap-2'>
                <ModalActualizarResiduos fetchData={fetchData} residuos={item} />
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
          total={Math.ceil(filteredData.length / rowsPerPage)}
          onChange={onPageChange}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={page === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={page === Math.ceil(filteredData.length / rowsPerPage)} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};
