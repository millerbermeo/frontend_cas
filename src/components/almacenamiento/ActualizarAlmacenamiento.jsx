import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';
import { SweetAlert } from '../../configs/SweetAlert';

export const ActualizarAlmacenamiento = ({ fetchData, almacenamiento }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    nombre_alm: almacenamiento.nombre_alm,
    cantidad_alm: almacenamiento.cantidad_alm
  });

  const [formErrors, setFormErrors] = useState({
    nombre_alm: false,
    cantidad_alm: false
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
    if (formData.cantidad_alm === "") {
      newFormErrors.cantidad_alm = true;
    }

    if (Object.keys(newFormErrors).length > 0) {
      // Actualizar estado de errores
      setFormErrors(newFormErrors);
      console.log("Hay campos requeridos vacíos");
      return;
    }

    try {
      await axiosClient.put(`almacenamiento/actualizar/${almacenamiento.id_almacenamiento}`, formData).then(() => {
        fetchData();
        onOpenChange(false);
        setFormData({
          nombre_alm: "",
          cantidad_alm: 0
        });
        setMessage('Almacenamiento Actualizado Con Exito');
      });

      setIsSuccess(true);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSuccess(false);
      setMessage('Almacenamiento No registrado');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button color="" className='w-10 text-blue-600' onPress={onOpen}>
        <EditIcon />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Actualizar Almacenamiento</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre"
                  placeholder="Enter nombre"
                  variant="bordered"
                  name="nombre_alm"
                  value={formData.nombre_alm}
                  onChange={handleChange}
                />
                {formErrors.nombre_alm && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Nombre requerido
                  </div>
                )}

                <Input
                className='hidden'
                  label="Cantidad"
                  placeholder="Enter cantidad"
                  variant="bordered"
                  name="cantidad_alm"
                  value={formData.cantidad_alm}
                  onChange={handleChange}
                />
                {formErrors.cantidad_alm && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Cantidad requerida
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
                <Button color="primary" onClick={handleSubmit}>Actualizar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <SweetAlert type={isSuccess ? 'success' : 'error'} message={message} />
    </div>
  );
};
