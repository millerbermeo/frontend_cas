import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableActividad from '../actividades/TableActividad'; // Asegúrate de importar el componente desde la ubicación correcta

function ActividadesPage() {
  const [usuarios, setUsuarios] = useState([]); // Estado para los datos
  const [nombreActividad, setNombreActividad] = useState(''); // Estado para el nombre de la actividad
  const [tipoActividad, setTipoActividad] = useState('');
  const [estadoActividad, setEstadoActividad] = useState('');
  const [fecha, setFecha] = useState('');

  const fetchData = async () => {
    try {
      const responseUsuarios = await axios.get('http://localhost:3000/actividades/listar');
      // Transformar los datos si es necesario para que coincidan con las columnas
      const formattedData = responseUsuarios.data.map(usuario => [
        usuario.id_actividad,
        usuario.nombre_act,
        usuario.estado,
        usuario.fecha,
        'Acciones' // Aquí puedes agregar botones u otros elementos interactivos si lo deseas
      ]);
      setUsuarios(formattedData); // Guardar los datos en el estado
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegistrar = async () => {
    try {
      const nuevaActividad = {
        nombre_act: nombreActividad,
        tipo_actividad: tipoActividad,
        estado: estadoActividad,
        fecha
      };

      await axios.post('http://localhost:3000/actividades/registrar', nuevaActividad);
      fetchData(); // Refresca los datos después de agregar la nueva actividad
      setNombreActividad(''); // Limpia el formulario
      setTipoActividad('');
      setEstadoActividad('');
      setFecha('');
    } catch (error) {
      console.error('Error registrando actividad:', error);
    }
  };

  return (
    <div className='bg-blue-300 w-full flex flex-col'>
      {/* Todo el contenedor */}
      <div className='h-1/2 bg-gray-100 flex justify-around'>
        <div className='w-1/2 bg-gray-400 mt-10'>img</div>

        {/* Formulario Nueva Actividad */}
        <div className='w-1/3 bg-white mt-10 h-auto'>
          <div className='mt-3 text-center font-mono text-xl'>Nueva Actividad</div>
          <div className='mt-3'>
            <input
              type="text"
              placeholder="Nombre Actividad"
              value={nombreActividad}
              onChange={(e) => setNombreActividad(e.target.value)}
              className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2'
            />
          </div>
          <div className='mt-3'>
            <select
              className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2'
              value={tipoActividad}
              onChange={(e) => setTipoActividad(e.target.value)}
            >
              <option value="" disabled>Tipo de Actividad</option>
              <option value="Recolección">Recolección</option>
              <option value="Otras">Otras</option>
            </select>
          </div>
          <div className='mt-3'>
            <select
              className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2'
              value={estadoActividad}
              onChange={(e) => setEstadoActividad(e.target.value)}
            >
              <option value="" disabled>Lugar Actividad</option>
              <option value="1">Agropecuario</option>
              <option value="2">Ambiental</option>
              <option value="3">Tic</option>
              <option value="4">Bioconstrucción</option>
              <option value="5">Turismo</option>
            </select>
          </div>
          <div className='mt-3'>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className='bg-slate-200 text-xs w-80 h-8 rounded-md flex justify-center mx-auto items-center text-slate-500 p-2'
            />
          </div>
          <Stack spacing={2} direction="row" className='justify-center mx-auto items-center p-2' onChange>
      <Button variant="contained">Registrar</Button>
    </Stack>

        </div>
      </div>
      <div>
        {/* Aquí colocas la tabla */}
        <div className='h-1/2 bg-gray-100 mr-5 ml-5 mt-2'>
          <TableActividad data={usuarios} /> {/* Pasar los datos al componente */}
        </div>
      </div>
    </div>
  );
}

export default ActividadesPage;
