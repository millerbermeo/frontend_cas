import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure, Select } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';

export const RegistrarAlmacenamiento = ({ fetchData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    nombre_alm: "",
    cantidad_alm: 0,
    tipo_area: ""
  });

  const [formErrors, setFormErrors] = useState({
    nombre_alm: false,
    tipo_area: false
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    setFormErrors({
      ...formErrors,
      [name]: false
    });
  };

  const handleSubmit = async () => {
    setIsSuccess(null);
    setMessage('');

    const newFormErrors = {};

    // Validar campos
    if (!formData.nombre_alm) {
      newFormErrors.nombre_alm = true;
    }

    if (!formData.tipo_area) {
      newFormErrors.tipo_area = true;
    }

    if (Object.keys(newFormErrors).length > 0) {
      // Actualizar estado de errores
      setFormErrors(newFormErrors);
      console.log("Hay campos requeridos vacíos");
      return;
    }

    try {
      await axiosClient.post('almacenamiento/registrar', formData).then((response) => {
        setIsSuccess(true);
        fetchData();
        onOpenChange(false);
        setFormData({
          nombre_alm: "",
          cantidad_alm: 0,
          tipo_area: ""
        });
        setMessage('Almacenamiento Registrado Con Exito');
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSuccess(false);
      setMessage('Almacenamiento No registrado');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button className="bg-sky-600 text-white" endContent={<PlusIcon />} onPress={onOpen}>Registrar Almacenamiento</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Almacenamiento
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nombre"
                  placeholder="Enter nombre"
                  variant="bordered"
                  name="nombre_alm"
                  value={formData.nombre_alm}
                  onChange={handleChange}
                />
                {formErrors.nombre_alm && (
                  <div className='text-sm font-normal w-full text-red-500 px-2 rounded'>
                    Nombre requerido
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700">Tipo de Área</label>
                  <select
                    name="tipo_area"
                    value={formData.tipo_area}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                  >
                    <option value="">Seleccione el tipo de área</option>
                    <option value="1">Peligrosos</option>
                    <option value="2">No Aprovechables</option>
                    <option value="3">Aprovechables</option>
                  </select>
                  {formErrors.tipo_area && (
                    <div className='text-sm font-normal w-full text-red-500 px-2 rounded'>
                      Tipo de área requerido
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onClick={handleSubmit}>
                  Registrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <SweetAlert type={isSuccess ? 'success' : 'error'} message={message} />
    </div>
  );
};
