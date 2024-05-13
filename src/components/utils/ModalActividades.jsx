// ModalActividades.js
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

// ModalActividades.js
export const ModalActividades = ({ isOpen, onOpenChange, selectedEvent, id_actividad }) => {
    return (
      <>
        <div className='absolute left-2 w-14 h-7 rounded-full' onClick={() => onOpenChange(true)}>Open</div>
        <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
          <ModalContent>
            <ModalHeader>Info de la Actividad</ModalHeader>
            <ModalBody>
              <h2>Estas seguro de cerrar sesión</h2>
              <p>Activity ID: {id_actividad}</p>
            </ModalBody>
            <ModalFooter>
              <Button flat auto color="error" onClick={() => onOpenChange(false)}>Atrás</Button>
              <Button auto onClick={() => onOpenChange(false)}>Cerrar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  