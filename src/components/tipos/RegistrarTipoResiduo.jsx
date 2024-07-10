import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';

export const RegistrarTipoResiduo = ({ fetchData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    tipo_residuo: "",
    tipo: ""
  });

  const [formErrors, setFormErrors] = useState({
    tipo_residuo: false,
    tipo: false
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

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      tipo: value
    });

    setFormErrors({
      ...formErrors,
      tipo: false
    });
  };

  const handleSubmit = async () => {
    setIsSuccess(null);
    setMessage('');

    const newFormErrors = {};

    // Validar campos
    if (!formData.tipo_residuo) {
      newFormErrors.tipo_residuo = true;
    }
    if (!formData.tipo) {
      newFormErrors.tipo = true;
    }

    if (Object.keys(newFormErrors).length > 0) {
      // Actualizar estado de errores
      setFormErrors(newFormErrors);
      console.log("Hay campos requeridos vacíos");
      return;
    }

    try {
      await axiosClient.post('tipos_residuos/registrar', formData).then((response) => {
        setIsSuccess(true);
        fetchData();
        onOpenChange(false);
        setFormData({
          tipo_residuo: "",
          tipo: ""
        });
        setMessage('Tipo de residuo registrado con éxito');
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSuccess(false);
      setMessage('Tipo de residuo no registrado');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button className="bg-sky-600 text-white" endContent={<PlusIcon />} onPress={onOpen}>Registrar Tipo de Residuo</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Tipo de Residuo
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Tipo Residuo"
                  placeholder="Enter tipo residuo"
                  variant="bordered"
                  name="tipo_residuo"
                  value={formData.tipo_residuo}
                  onChange={handleChange}
                />
                {formErrors.tipo_residuo && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Tipo residuo requerido
                  </div>
                )}

                <Select
                  label="Tipo"
                  placeholder="Selecciona un tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={(event) => handleSelectChange(event.target.value)}
                >
                  <SelectItem key="no peligroso" value="no peligroso">
                    No Peligroso
                  </SelectItem>
                  <SelectItem key="peligroso" value="peligroso">
                    Peligroso
                  </SelectItem>
                </Select>
                {formErrors.tipo && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Tipo requerido
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
