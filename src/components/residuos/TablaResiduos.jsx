import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, User, Chip, Tooltip, getKeyValue } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SearchIcon } from '../iconos/SearchIcon';
import { ModalRegisterResiduo } from './ModalRegisterResiduo';
import { ModalActualizarResiduos } from './ModalActualizarResiduos';





export const TablaResiduos = () => {

  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');


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
  const paginatedData = data.filter(item => item.nombre_residuo.toLowerCase().includes(filterValue.toLowerCase())).slice(start, end);


  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const printTable = () => {
    const printContents = document.querySelector('.printableTable').outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Esto es opcional para restaurar completamente el estado de la página.
  };



  return (
    <>
      <div className='flex justify-between items-center w-full'>
     <div className='w-full flex gap-3'>
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

        <div className='flex gap-1'>
        <Button color="secondary" auto onClick={() => downloadCSV(data)}>
        Descargar CSV
      </Button>
      <Button color="primary" auto onClick={printTable}>
        Imprimir Tabla
      </Button>
        </div>
     </div>

        <ModalRegisterResiduo fetchData={fetchData} />

      </div>

     



      <div className="flex justify-between items-center my-5">
        <span className="text-default-400 text-small">Total {data.length} residuos</span>
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

      <Table className='z-0 printableTable' aria-label="Example static collection table" selectedKeys={selectedKeys} selectionMode="multiple" onSelectionChange={setSelectedKeys}>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>RESIDUO</TableColumn>
          <TableColumn>TIPO</TableColumn>
          <TableColumn>CANTIDAD</TableColumn>
          <TableColumn>UNIDAD MEDIDA</TableColumn>
          <TableColumn>ALMACENAMIENTO</TableColumn>
          <TableColumn className='flex justify-center items-center'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map(item => (
            <TableRow key={item.id_residuo}>
              <TableCell>{item.id_residuo}</TableCell>
              <TableCell>{item.nombre_residuo}</TableCell>
              <TableCell>{item.residuo}</TableCell>
              <TableCell>{item.tipo_residuo}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>{item.unidad_medida}</TableCell>
              <TableCell>{item.alm}</TableCell>
              <TableCell className='flex justify-center gap-2'>


                <ModalActualizarResiduos residuos={item} fetchData={fetchData} />
                {/* <ModalRegistrarSal2 residuos={item} fetchData={fetchData} /> */}

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
