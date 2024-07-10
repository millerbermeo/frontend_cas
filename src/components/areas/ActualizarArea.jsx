import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';
import { SweetAlert } from '../../configs/SweetAlert';

export const ActualizarArea = ({ fetchData, area }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    nombre_area: area.nombre_area
  });

  const [formErrors, setFormErrors] = useState({
    nombre_area: false
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
    if (!formData.nombre_area) {
      newFormErrors.nombre_area = true;
    }

    if (Object.keys(newFormErrors).length > 0) {
      // Actualizar estado de errores
      setFormErrors(newFormErrors);
      console.log("Hay campos requeridos vacíos");
      return;
    }

    try {
      await axiosClient.put(`areas/actualizar/${area.id_lugar}`, formData).then(() => {
        fetchData();
        onOpenChange(false);
        setFormData({
          nombre_area: ""
        });
        setMessage('Área actualizada con éxito');
      });

      setIsSuccess(true);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSuccess(false);
      setMessage('Área no actualizada');
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
              <ModalHeader className="flex flex-col gap-1">Actualizar Área</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre Área"
                  placeholder="Enter nombre área"
                  variant="bordered"
                  name="nombre_area"
                  value={formData.nombre_area}
                  onChange={handleChange}
                />
                {formErrors.nombre_area && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Nombre área requerido
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
