import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';

export const RegistrarAlmacenamiento = ({ fetchData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    nombre_alm: "",
    cantidad_alm: 0
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
      await axiosClient.post('almacenamiento/registrar', formData).then((response) => {
        setIsSuccess(true);
        fetchData();
        onOpenChange(false);
        setFormData({
          nombre_alm: "",
          cantidad_alm: 0
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
                  <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                    Nombre requerido
                  </div>
                )}

                <Input
                  label="Cantidad"
                  placeholder="Enter cantidad"
                  variant="bordered"
                  name="cantidad_alm"
                  value={formData.cantidad_alm}
                  onChange={handleChange}
                />
                {formErrors.cantidad_alm && (
                  <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                    Cantidad requerida
                  </div>
                )}
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
