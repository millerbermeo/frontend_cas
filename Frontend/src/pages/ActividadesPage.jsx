import React, { useState, useEffect } from 'react';
import useAutocomplete from '@mui/material/useAutocomplete';
import TableActividad from '../actividades/TableActividad'; // Importa el componente TableActividad desde su ubicación correcta


function ActividadesPage() {

  const fetchData = async () => {
    try {
      const responseUsuarios = await axiosClient.get('http://localhost:3000/usuario/listar2');
      setUsuarios(responseUsuarios.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className='bg-blue-300 w-full flex flex-col'>
      {/* Todo el contenedor */}
      <div className='h-1/2 bg-gray-100 flex justify-around'>
        <div className='w-1/2 bg-gray-400 mt-10'>img</div>

        {/* Formulario Nueva Actividad */}
        <div className='w-1/3 bg-white mt-10 h-72'>
          <div className='mt-3 text-center font-mono text-xl'>Nueva Actividad</div>
          <div className='mt-3 '>
            <select className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2'>
              <option value="" disabled selected>Tipo de Actividad</option>
              <option value="option1">Recolección</option>
              <option value="option2">Otras</option>
            </select>
          </div>
          <div className='mt-3'>
            <select className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2' >
              <option value="" disabled selected>Lugar  Actividad</option>
              <option value="option1">Agropecuario</option>
              <option value="option1">Ambiental</option>
              <option value="option2">Tic</option>
              <option value="option3">Biocontrucción</option>
              <option value="option4">Turismo</option>
            </select>
          </div>
          <div className='mt-3'>
            <input type="date" className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2'/>
          </div>
          <div className='mt-3 '>
            <select className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2'>
              <option value="" disabled selected>Personal Encargado</option>
              <option value="option1">Recolección</option>
            </select>
          </div>
          <button className='bg-gradient-to-r from-cyan-400 to-sky-500 text-xl w-80 flex justify-center mx-auto items-center h-8 rounded-md text-white p-2 mt-4'>Registrar</button>
        </div>
      </div>
      <div>

      </div>
      {/* Aquí colocas la tabla */}
      <div className='h-1/2 bg-gray-100 mr-5 ml-5 mt-2'>
        <TableActividad/> {/* Aquí se incluye el componente TableActividad */}
      </div>
    </div>
  );
}

export default ActividadesPage;