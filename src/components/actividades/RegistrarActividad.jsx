import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem, TimeInput } from '@nextui-org/react';
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';

export const RegistrarActividad = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [lugarActividad, setLugarActividad] = useState('');
  const [fechaActividad, setFechaActividad] = useState('');

  const [cantidades, setCantidades] = useState({});
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [mostrarElementos, setMostrarElementos] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  const toggleUsuarios = () => {
    setMostrarUsuarios(!mostrarUsuarios);
    fetchData();
  };

  const toggleElementos = () => {
    setMostrarElementos(!mostrarElementos);
    fetchData();
  };

  const lugares = [
    { label: "Area 1", value: "1" },
    { label: "Area 2", value: "2" },
    { label: "Area 3", value: "3" },
    { label: "Area 4", value: "4" },
  ];

  const fetchData = async () => {
    try {
      const responseUsuarios = await axiosClient.get('usuario/listar2');
      setUsuarios(responseUsuarios.data);
      const responseElementos = await axiosClient.get('elemento/listar');
      setElementos(responseElementos.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCantidadChange = (elementoId, nuevaCantidad) => {
    const cantidadMaxima = elementos.find(e => e.id_elemento === elementoId).cantidad;
    if (nuevaCantidad > cantidadMaxima) {
      setCantidades({ ...cantidades, [elementoId]: cantidadMaxima });
    } else {
      setCantidades({ ...cantidades, [elementoId]: nuevaCantidad });
    }
  };

  const handleActividad = async () => {
    setIsSuccess(null);
    setMessage('');

    const usuariosSeleccionados = usuarios.filter(usuario => usuario.isChecked);
    const elementosSeleccionados = elementos.filter(elemento => elemento.isChecked && cantidades[elemento.id_elemento] > 0);

    if (usuariosSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un usuario');
      return;
    }

    if (elementosSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un elemento');
      return;
    }

    if (!lugarActividad) {
      setError('Se debe seleccionar el lugar.');
      return;
    }

    if (!fechaActividad) {
      setError('Se debe seleccionar una fecha');
      return;
    }


    setError('');
    const datos = {
      lugar_actividad: lugarActividad,
      fecha_actividad: fechaActividad,

      usuarios: usuariosSeleccionados.map(u => u.id_usuario),
      elementos: elementosSeleccionados.map(e => ({ elemento_id: e.id_elemento, cantidad: cantidades[e.id_elemento] }))
    };

    try {
      const response = await axiosClient.post('actividades/registrar', datos);
      setIsSuccess(true);
      setUsuarios([]);
      setElementos([]);
      setMostrarUsuarios(false);
      setMostrarElementos(false);
      setLugarActividad('');
      setFechaActividad('');
      setCantidades({});
      setIsSuccess(true);
      setMessage('Actividad Registrada Con Exito');
    } catch (error) {
      console.error('Error registering activity:', error);
      setIsSuccess(false);
      setMessage('Actividad No registrada');
    }
  };

  const handleUsuarioCheckboxChange = (id_usuario, isChecked) => {
    setUsuarios(usuarios.map(usuario => {
      if (usuario.id_usuario === id_usuario) {
        return { ...usuario, isChecked };
      }
      return usuario;
    }));
  };

  const handleElementoCheckboxChange = (id_elemento, isChecked) => {
    setElementos(elementos.map(elemento => {
      if (elemento.id_elemento === id_elemento) {
        return { ...elemento, isChecked };
      }
      return elemento;
    }));
  };

  return (
    <>
      <section className='w-full z-10'>
        <div className='bg-zinc-100 p-3 rounded'>
          <div className='mb-4 flex gap-x-3'>
            <span className='text-lg w-48'>Seleccionar Usuarios:</span>
            <Button color="primary" onClick={toggleUsuarios}>
              {mostrarUsuarios ? 'Ocultar Usuarios' : 'Desplegar Usuarios'}
            </Button>
          </div>
          {mostrarUsuarios && (
            <form className='grid grid-cols-5 mb-10'>
              {usuarios.map(usuario => (
                <div key={usuario.id_usuario}>
                  <input
                    type="checkbox"
                    checked={usuario.isChecked || false}
                    onChange={(e) => handleUsuarioCheckboxChange(usuario.id_usuario, e.target.checked)}
                    id={usuario.id_usuario}
                    name={usuario.id_usuario}
                    value={usuario.id_usuario}
                    className="mr-2"
                  />
                  <label htmlFor={usuario.id_usuario} className="mr-4">{usuario.nombre}</label>
                </div>
              ))}
            </form>
          )}
        </div>

        <div className='bg-zinc-100 p-3 my-10 rounded flex flex-col items-'>
          <div className='mb-4 flex gap-x-3'>
            <span className='text-lg w-48'>Seleccionar Elementos:</span>
            <Button color="primary" onClick={toggleElementos}>
              {mostrarElementos ? 'Ocultar Elementos' : 'Desplegar Elementos'}
            </Button>
          </div>
          {mostrarElementos && (
            <form className='grid-cols-1 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 place-items-center w-full m-auto my-5'>
              {elementos.map(elemento => (
                <div key={elemento.id_elemento} className={`mb-2 w-full ${elemento.cantidad === 0 ? 'hidden' : ''}`}>
                  <input
                    type="checkbox"
                    checked={elemento.isChecked || false}
                    onChange={(e) => handleElementoCheckboxChange(elemento.id_elemento, e.target.checked)}
                    id={`elemento-${elemento.id_elemento}`}
                    name={`elemento-${elemento.id_elemento}`}
                    value={elemento.id_elemento}
                    className="mr-2"
                    disabled={elemento.cantidad === 0}
                  />
                  <label htmlFor={`elemento-${elemento.id_elemento}`} className="mr-4">
                    {elemento.nombre_elm} - {elemento.tipo_elm} {elemento.cantidad}
                  </label>
                  <Input
                    placeholder="Cantidad"
                    className="max-w-xs"
                    type="number"
                    id={`cantidad-${elemento.id_elemento}`}
                    value={cantidades[elemento.id_elemento] || ''}
                    onChange={(e) => handleCantidadChange(elemento.id_elemento, e.target.value)}
                    min="0"
                    max={elemento.cantidad}
                    disabled={elemento.cantidad === 0}
                  />
                </div>
              ))}
            </form>
          )}
        </div>

        <div className='w-full flex flex-col bg-white'>
          <form className='flex justify-between gap-x-3 w-full'>
            <Select
              id="lugarActividad"
              label="Lugar de la Actividad"
              name='lugarActividad'
              className="w-full"
              value={lugarActividad}
              onChange={(e) => setLugarActividad(e.target.value)}
            >
              {lugares.map((lugar) => (
                <SelectItem key={lugar.value} value={lugar.value}>
                  {lugar.label}
                </SelectItem>
              ))}
            </Select>

            <div className='w-full'>
              <Input
                label="Fecha de la Actividad:"
                type="date"
                id="fechaActividad"
                className="w-full"
                value={fechaActividad}
                onChange={e => setFechaActividad(e.target.value)}
              />
            </div>

       
          </form>
        </div>

        {error && <div className='text-lg font-normal w-full mt-8 bg-red-600 text-white px-2 py-0.5 my- rounded'>{error}</div>}

        <Button className='my-5' onClick={handleActividad} color="primary">
          Registrar Actividad
        </Button>
      </section>

      <SweetAlert type={isSuccess ? 'success' : 'error'} message={message} />
    </>
  );
};
