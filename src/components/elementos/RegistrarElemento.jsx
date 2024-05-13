import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';



export const RegistrarElemento = ({ fetchData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);

    const [formData, setFormData] = useState({
        nombre_elm: "",
        tipo_elm: "",
        cantidad: ""
    });

    const [formErrors, setFormErrors] = useState({
        nombre_elm: false,
        tipo_elm: false,
        cantidad: false
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
        const newFormErrors = {};

        // Validar campos
        if (!formData.nombre_elm) {
            newFormErrors.nombre_elm = true;
        }
        if (!formData.tipo_elm) {
            newFormErrors.tipo_elm = true;
        }
        if (!formData.cantidad) {
            newFormErrors.cantidad = true;
        }

        if (Object.keys(newFormErrors).length > 0) {
            // Actualizar estado de errores
            setFormErrors(newFormErrors);
            // Mostrar mensaje de error o manejar la validación según tu diseño
            console.log("Hay campos requeridos vacíos");
            return;
        }

        try {
            console.log(formData);
            await axiosClient.post('http://localhost:3000/elemento/registrar', formData).then((response) => {
                setIsSuccess(true);
                fetchData();
                onOpenChange(false);
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>Registrar Elemento</Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Registrar Elemento
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Nombre"
                                    placeholder="Enter nombre"
                                    variant="bordered"
                                    name="nombre_elm"
                                    value={formData.nombre_elm}
                                    onChange={handleChange}
                                />
                                {formErrors.nombre_elm && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Nombre requerido
                                    </div>
                                )}

                                <Input
                                    autoFocus
                                    label="Tipo"
                                    placeholder="Enter tipo"
                                    variant="bordered"
                                    name="tipo_elm"
                                    value={formData.tipo_elm}
                                    onChange={handleChange}
                                />
                                {formErrors.tipo_elm && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Tipo requerido
                                    </div>
                                )}

                                <Input
                                    label="Cantidad"
                                    placeholder="Enter cantidad"
                                    variant="bordered"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                />
                                {formErrors.cantidad && (
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
            <SweetAlert isSuccess={isSuccess}/>
        </div>
  )
}
