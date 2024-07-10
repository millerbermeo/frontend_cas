import React, { useState, useEffect } from 'react';
import { Input, Button, Checkbox } from '@nextui-org/react';
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';


export const RegistrarActividadElm = () => {
  const [elementos, setElementos] = useState([]);
  const [fechaActividad, setFechaActividad] = useState('');
  const [cantidades, setCantidades] = useState({});
  const [mostrarElementos, setMostrarElementos] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  const toggleElementos = () => {
    setMostrarElementos(!mostrarElementos);
  };

  const fetchData = async () => {
    try {
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

    const elementosSeleccionados = elementos.filter(elemento => elemento.isChecked && cantidades[elemento.id_elemento] > 0);

    if (elementosSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un elemento');
      return;
    }

    if (!fechaActividad) {
      setError('Se debe seleccionar una fecha');
      return;
    }

    setError('');
    const datos = {
      fecha_actividad: fechaActividad,
      elementos: elementosSeleccionados.map(e => ({ elemento_id: e.id_elemento, cantidad: cantidades[e.id_elemento] }))
    };

    try {
      const response = await axiosClient.post('actividades/registrarActElm', datos);
      setIsSuccess(true);
      setElementos([]);
      setMostrarElementos(false);
      setFechaActividad('');
      setCantidades({});
      setIsSuccess(true);
      fetchData()
      setMessage('Actividad Registrada Con Exito');
    } catch (error) {
      console.error('Error registering activity:', error);
      setIsSuccess(false);
      setMessage('Actividad No registrada');
    }
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
        <div className='p-3 my-10 rounded flex flex-col items-'>
          <div className='mb-4 flex gap-x-3'>
            <span className='text-lg w-48'>Seleccionar Elementos:</span>
            <Button className='bg-sky-600 text-white' onClick={toggleElementos}>
              {mostrarElementos ? 'Ocultar Elementos' : 'Desplegar Elementos'}
            </Button>
          </div>
          
          {mostrarElementos && (
            <form className='grid-cols-1 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 place-items-center w-full m-auto my-5 bg-zinc-200 p-2 rounded-md'>
              {elementos.map(elemento => (
                <div key={elemento.id_elemento} className={`mb-2 w-full ${elemento.cantidad === 0 ? 'hidden' : ''}`}>
                  <Checkbox
                    isSelected={elemento.isChecked || false}
                    onChange={(e) => handleElementoCheckboxChange(elemento.id_elemento, e.target.checked)}
                    id={`elemento-${elemento.id_elemento}`}
                    name={`elemento-${elemento.id_elemento}`}
                    value={elemento.id_elemento}
                    className="mr-2"
                    disabled={elemento.cantidad === 0}
                  >
                    <label htmlFor={`elemento-${elemento.id_elemento}`} className="mr-4">
                      {elemento.nombre_elm} - {elemento.tipo_elm} {elemento.cantidad}
                    </label>
                  </Checkbox>
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
            <div className='w-full'>
              <Input
                label="Fecha de la Actividad:"
                type="date"
                id="fechaActividad"
                className="w-full"
                value={fechaActividad}
                onChange={(e) => setFechaActividad(e.target.value)}
              />
            </div>
          </form>
        </div>

        {error && <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>{error}</div>}

        <Button className='my-5 bg-sky-600 text-white' onClick={handleActividad} color="primary">
          Registrar Actividad
        </Button>
      </section>

      <SweetAlert type={isSuccess ? 'success' : 'error'} message={message} />
    </>
  );
};
