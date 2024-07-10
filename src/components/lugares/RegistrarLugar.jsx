import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';

export const RegistrarLugar = ({ fetchData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [areas, setAreas] = useState([]);

  const [formData, setFormData] = useState({
    nombre_lugar: "",
    ubicacion_lugar: "",
    fk_area: ""
  });

  const [formErrors, setFormErrors] = useState({
    nombre_lugar: false,
    ubicacion_lugar: false,
    fk_area: false
  });

  const fetchAreas = async () => {
    try {
      const response = await axiosClient.get('lugares/areas');
      setAreas(response.data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

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
      fk_area: value
    });

    setFormErrors({
      ...formErrors,
      fk_area: false
    });
  };

  const handleSubmit = async () => {
    setIsSuccess(null);
    setMessage('');

    const newFormErrors = {};

    // Validar campos
    if (!formData.nombre_lugar) {
      newFormErrors.nombre_lugar = true;
    }
    // if (!formData.ubicacion_lugar) {
    //   newFormErrors.ubicacion_lugar = true;
    // }
    if (!formData.fk_area) {
      newFormErrors.fk_area = true;
    }

    if (Object.keys(newFormErrors).length > 0) {
      // Actualizar estado de errores
      setFormErrors(newFormErrors);
      console.log("Hay campos requeridos vacíos");
      return;
    }

    try {
      await axiosClient.post('lugares/registrar', formData).then((response) => {
        setIsSuccess(true);
        fetchData();
        onOpenChange(false);
        setFormData({
          nombre_lugar: "",
          ubicacion_lugar: "",
          fk_area: ""
        });
        setMessage('Lugar registrado con éxito');
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsSuccess(false);
      setMessage('Lugar no registrado');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button className="bg-sky-600 text-white" endContent={<PlusIcon />} onPress={onOpen}>Registrar Lugar</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Lugar
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nombre Lugar"
                  placeholder="Enter nombre lugar"
                  variant="bordered"
                  name="nombre_lugar"
                  value={formData.nombre_lugar}
                  onChange={handleChange}
                />
                {formErrors.nombre_lugar && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Nombre lugar requerido
                  </div>
                )}

                <Input
                  label="Ubicación"
                  placeholder="Enter ubicación"
                  variant="bordered"
                  name="ubicacion_lugar"
                  value={formData.ubicacion_lugar}
                  onChange={handleChange}
                />
                {/* {formErrors.ubicacion_lugar && (
                  <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                    Ubicación requerida
                  </div>
                )} */}

                <Select
                  label="Área"
                  placeholder="Selecciona un área"
                  name="fk_area"
                  value={formData.fk_area}
                  onChange={(event) => handleSelectChange(event.target.value)}
                >
                  {areas.map((item) => (
                    <SelectItem key={item.id_lugar} value={item.id_lugar}>
                      {item.nombre_area}
                    </SelectItem>
                  ))}
                </Select>
                {formErrors.fk_area && (
                  <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                    Área requerida
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
