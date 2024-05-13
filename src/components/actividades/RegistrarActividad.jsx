import React, { useState, useEffect } from 'react';
import { Checkbox, Input } from '@nextui-org/react';
import { Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { SweetAlert } from '../../configs/SweetAlert';


import { DateInput } from "@nextui-org/react";
import { now, parseAbsoluteToLocal } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";


export const RegistrarActividad = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [lugarActividad, setLugarActividad] = useState('');
  const [fechaActividad, setFechaActividad] = useState('');
  const [horaInicial, setHoraInicial] = useState('');
  const [horaFinal, setHoraFinal] = useState('');
  const [cantidades, setCantidades] = useState({});
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [mostrarElementos, setMostrarElementos] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
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
    { label: "Area 1", value: "1", },
    { label: "Area 2", value: "2", },
    { label: "Area 3", value: "3", },
    { label: "Area 4", value: "4", },
  ]

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


  const handleCantidadChange = (elementoId, cantidad) => {
    setCantidades({ ...cantidades, [elementoId]: cantidad });
  };



  const handleActividad = async () => {
    const usuariosSeleccionados = usuarios.filter(usuario => usuario.isChecked);
    const elementosSeleccionados = elementos.filter(elemento => elemento.isChecked && cantidades[elemento.id_elemento] > 0);

    if (!usuariosSeleccionados) {
      setError('Debe seleccionar al menos un usuario');
      return;
    }

    if (!elementosSeleccionados) {
      setError('Debe seleccionar al menos un elemento');
      return;
    }

    if (!lugarActividad) {
      setError('Se debe seleccionar el lugar.');
      return;
    }

    if (!fechaActividad) {
      setError('Se de seleccionar una fecha');
      return;
    }

    setError('');
    const datos = {
      lugar_actividad: lugarActividad,
      fecha_actividad: fechaActividad,
      hora_inicial: horaInicial.toString(),
      hora_final: horaFinal.toString(),
      usuarios: usuariosSeleccionados.map(u => u.id_usuario),
      elementos: elementosSeleccionados.map(e => ({ elemento_id: e.id_elemento, cantidad: cantidades[e.id_elemento] }))
    };

    try {
      const response = await axiosClient.post('actividades/registrar', datos);
      setIsSuccess(true);
      setUsuarios([])
      setElementos([])
      setMostrarUsuarios(false)
      setMostrarElementos(false)
      setLugarActividad('')
      setFechaActividad('')
      setCantidades('')
    } catch (error) {
      console.error('Error registering activity:', error);
      setIsSuccess(false);
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
                  <Checkbox
                    checked={usuario.isChecked}
                    onChange={(e) => handleUsuarioCheckboxChange(usuario.id_usuario, e.target.checked)}
                    color="success"
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

        <div className='bg-zinc-100 p-3 my-10 rounded'>
          <div className='mb-4 flex gap-x-3'>
            <span className='text-lg w-48'>Seleccionar Elementos:</span>
            <Button color="primary" onClick={toggleElementos}>
              {mostrarElementos ? 'Ocultar Elementos' : 'Desplegar Elementos'}
            </Button>
          </div>
          {mostrarElementos && (
            <form className='grid-cols-1 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 2xl:flex justify-between my-5'>
              {elementos.map(elemento => (
                <div key={elemento.id_elemento} className={`mb-2 w-full ${elemento.cantidad == 0 ? 'hidden' : ''}`}>

                  <Checkbox
                    checked={elemento.isChecked}
                    onChange={(e) => handleElementoCheckboxChange(elemento.id_elemento, e.target.checked)}
                    color="success"
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
                    disabled={elemento.cantidad === 0}
                  />
                </div>
              ))}
            </form>
          )}
        </div>

        <div className='w-full flex flex-col bg-white'>
          <form className='flex justify-between gap-x-3 w-full'>
            {/* <div>
                  <label htmlFor="tipoActividad">Tipo de Actividad:</label>
                  <input
                    type="text"
                    id="tipoActividad"
                    value={tipoActividad}
                  
                  />
                </div>

                




                <div>
                  <label htmlFor="lugarActividad">Lugar de la Actividad:</label>
                  <input
                    type="text"
                    id="lugarActividad"
                    value={lugarActividad}
                    onChange={e => setLugarActividad(e.target.value)}
                  />
                </div> */}


            {/* <div className='w-full'>
                <label htmlFor="lugarActividad">Lugar de la Actividad:</label>
                <Input
                  type="text"
                  id="lugarActividad"
                  className="max-w-xs"
                  value={lugarActividad}
                  onChange={e => setLugarActividad(e.target.value)}
                />
              </div> */}








            <Select
              id="lugarActividad"
              label="Lugar de la Actividad"
              name='lugarActividad'
              className="w-full"
              value={lugarActividad}
              onChange={(e) => setLugarActividad(e.target.value)} // Utiliza e.target.value para obtener el valor seleccionado
            >
              {lugares.map((lugar) => (
                <SelectItem key={lugar.value} value={lugar.value}>
                  {lugar.label}
                </SelectItem>
              ))}
            </Select>




            {/* <div>
                <label htmlFor="fechaActividad">Fecha de la Actividad:</label>
                <input
                  type="date"
                  id="fechaActividad"
                  value={fechaActividad}
                  onChange={e => setFechaActividad(e.target.value)}
                />
              </div> */}

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

            <div className='w-full'>
              <TimeInput
                label="Hora Inicial"
                value={horaInicial}
                onChange={setHoraInicial} // Directamente establece el nuevo valor
              />            </div>

            <div className='w-full'>
              <TimeInput
                label="Hora Final"
                value={horaFinal}
                onChange={setHoraFinal} // Directamente establece el nuevo valor
              />

            </div>







          </form>
        </div>

        {error && <div className='text-lg font-normal w-full mt-8 bg-red-600 text-white px-2 py-0.5 my- rounded'>{error}</div>}


        <Button className='my-5' onClick={handleActividad} color="primary">
          Registrar Actividad
        </Button>
      </section>

      <SweetAlert isSuccess={isSuccess} />
    </>
  )
}
