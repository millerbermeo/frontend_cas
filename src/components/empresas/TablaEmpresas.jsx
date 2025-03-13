import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, Tooltip } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SearchIcon } from '../iconos/SearchIcon';
import { RegistrarEmpresa } from './RegistrarEmpresa';
import { ActualizarEmpresa } from './ActualizarEmpresa';
import { EliminarEmpresa } from './EliminarEmpresa';

export const TablaEmpresas = () => {
  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('empresas_recoleccion/listar');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearchChange = (value) => {
    setFilterValue(value);
    setPage(1);
  };

  const onClear = () => {
    setFilterValue('');
    setPage(1);
  };

  const onPageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const onRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
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
  const paginatedData = data.filter(item => item.nombre_empresa.toLowerCase().includes(filterValue.toLowerCase())).slice(start, end);

  return (
    <>
      <div className='flex flex-col lg:flex-row justify-between lg:items-center w-full'>
        <div className='w-full flex-col lg:flex-row flex gap-3'>
          <Input
            color='white'
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <RegistrarEmpresa fetchData={fetchData} />
      </div>
      
      <div className="flex justify-between items-center my-5">
        <span className="text-default-400 text-small">Total {data.length} destinos</span>
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

      <Table className='z-0 printableTable' aria-label="Tabla de Empresas" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
        <TableHeader>
          <TableColumn className='bg-sky-700 text-white'>ID</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>NOMBRE</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>DESCRIPCIÓN</TableColumn>
          <TableColumn className='bg-sky-700 text-white'>CONTACTO</TableColumn>
          <TableColumn className='bg-sky-700 text-white flex justify-center items-center'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map(item => (
            <TableRow key={item.id_empresa}>
              <TableCell>{item.id_empresa}</TableCell>
              <TableCell>{item.nombre_empresa}</TableCell>
              <TableCell>{item.descripcion_empresa}</TableCell>
              <TableCell>{item.contacto_empresa}</TableCell>
              <TableCell className='flex justify-center gap-2'>
                <ActualizarEmpresa fetchData={fetchData} empresa={item} />
                <EliminarEmpresa fetchData={fetchData} empresa={item} />
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
};
