import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import  TrashIcon  from '../iconos/TrashIcon';
import { SweetAlert } from '../../configs/SweetAlert';

export const EliminarArea = ({ fetchData, area }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const handleDelete = async () => {
    setIsSuccess(null);
    setMessage('');

    try {
      await axiosClient.delete(`areas/eliminar/${area.id_lugar}`).then(() => {
        fetchData();
        onOpenChange(false);
        setMessage('Área eliminada con éxito');
      });

      setIsSuccess(true);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting data:', error);
      setIsSuccess(false);
      setMessage('Área no eliminada');
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
              <ModalHeader className="flex flex-col gap-1">Eliminar Área</ModalHeader>
              <ModalBody>
                ¿Estás seguro de que deseas eliminar esta área?
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
