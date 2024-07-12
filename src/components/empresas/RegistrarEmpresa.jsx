import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';

export const RegistrarEmpresa = ({ fetchData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    nombre_empresa: "",
    descripcion_empresa: "",
    contacto_empresa: ""
  });

  const [formErrors, setFormErrors] = useState({
    nombre_empresa: false,
    descripcion_empresa: false,
    contacto_empresa: false
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
    if (!formData.nombre_empresa) {
      newFormErrors.nombre_empresa = true;
    }
    if (!formData.descripcion_empresa) {
      newFormErrors.descripcion_empresa = true;
    }
    // if (!formData.contacto_empresa) {
    //   newFormErrors.contacto_empresa = true;
    // }

    if (Object.keys(newFormErrors).length > 0) {
      // Actualizar estado de errores
      setFormErrors(newFormErrors);
      console.log("Hay campos requeridos vacíos");
      return;
    }

    try {
      await axiosClient.post('empresas_recoleccion/registrar', formData).then((response) => {
        setIsSuccess(true);
        fetchData();
        onOpenChange(false);
        setFormData({
          nombre_empresa: "",
          descripcion_empresa: "",
          contacto_empresa: ""
        });
        setMessage('Empresa Registrada Con Exito');
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSuccess(false);
      setMessage('Empresa No registrada');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button className="bg-sky-600 text-white" endContent={<PlusIcon />} onPress={onOpen}>Registrar Destino</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Empresa
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nombre"
                  placeholder="Enter nombre"
                  variant="bordered"
                  name="nombre_empresa"
                  value={formData.nombre_empresa}
                  onChange={handleChange}
                />
                {formErrors.nombre_empresa && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Nombre requerido
                  </div>
                )}

                <Input
                  label="Descripción"
                  placeholder="Enter descripción"
                  variant="bordered"
                  name="descripcion_empresa"
                  value={formData.descripcion_empresa}
                  onChange={handleChange}
                />
                {formErrors.descripcion_empresa && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Descripción requerida
                  </div>
                )}

                <Input
                  label="Contacto"
                  placeholder="Enter contacto"
                  variant="bordered"
                  name="contacto_empresa"
                  value={formData.contacto_empresa}
                  onChange={handleChange}
                />
                {/* {formErrors.contacto_empresa && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Contacto requerido
                  </div>
                )} */}
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
