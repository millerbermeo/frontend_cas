import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import  TrashIcon  from '../iconos/TrashIcon';
import { SweetAlert } from '../../configs/SweetAlert';

export const EliminarAlmacenamiento = ({ fetchData, almacenamiento }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const handleDelete = async () => {
    setIsSuccess(null);
    setMessage('');

    try {
      await axiosClient.delete(`almacenamiento/eliminar/${almacenamiento.id_almacenamiento}`).then(() => {
        fetchData();
        onOpenChange(false);
        setMessage('Almacenamiento Eliminado Con Exito');
      });

      setIsSuccess(true);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting data:', error);
      setIsSuccess(false);
      setMessage('Almacenamiento No eliminado');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button color="transparent" className='w-10 text-red-600' onPress={onOpen}>
        <TrashIcon />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Eliminar Almacenamiento</ModalHeader>
              <ModalBody>
                ¿Estás seguro de que deseas eliminar este almacenamiento?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onClick={handleDelete}>Eliminar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <SweetAlert type={isSuccess ? 'success' : 'error'} message={message} />
    </div>
  );
};
