import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, User, Chip, Tooltip, getKeyValue } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SearchIcon } from '../iconos/SearchIcon';
import { RegistrarElemento } from './RegistrarElemento';
import { ActualizarElemento } from './ActualizarElemento';


export const TableElementos = () => {

  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('elemento/listar');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const convertToCSV = (data) => {
    const headers = ["ID", "NOMBRE", "TIPO", "CANTIDAD"];
    const rows = data.map(item =>
      [item.id_elemento, item.nombre_elm, item.tipo_elm, item.cantidad].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (data) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'elementos.csv');
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
  const paginatedData = data.filter(item => item.nombre_elm.toLowerCase().includes(filterValue.toLowerCase())).slice(start, end);


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
    <div className='flex flex-col lg:flex-row justify-between lg:items-center w-full'>
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
      <Button className='' auto onClick={printTable}>
        Imprimir Tabla
      </Button>
        </div>
    </div>

<RegistrarElemento fetchData={fetchData}/>

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

     <Table className='z-0 printableTable' aria-label="Example static collection table" selectedKeys={selectedKeys}  onSelectionChange={setSelectedKeys}>
     <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>TIPO</TableColumn>
          <TableColumn>CANTIDAD</TableColumn>
          <TableColumn className='flex justify-center items-center'>ACCIONES</TableColumn>
        </TableHeader>
       <TableBody>
         {paginatedData.map(item => (
          <TableRow key={item.id_elemento}>
          <TableCell>{item.id_elemento}</TableCell>
          <TableCell>{item.nombre_elm}</TableCell>
          <TableCell>{item.tipo_elm}</TableCell>
          <TableCell>{item.cantidad}</TableCell>


          <TableCell className='flex justify-center gap-2'>

<ActualizarElemento fetchData={fetchData} elemento={item}/>
            {/* <ActualizarUsuarios usuario={item} fetchData={fetchData} /> */}

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

