import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';

export const RegistrarElemento = ({ fetchData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);

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

    const tipoElementos = [
        { id: 'consumible', nombre: 'Consumible' },
        { id: 'herramienta', nombre: 'Herramienta' },
        { id: 'aseo', nombre: 'Aseo' },
        { id: 'otro', nombre: 'Otro' }
    ];

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
            tipo_elm: value
        });

        setFormErrors({
            ...formErrors,
            tipo_elm: false
        });
    };

    const handleSubmit = async () => {
        setIsSuccess(null);
        setMessage('');

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
            console.log("Hay campos requeridos vacíos");
            return;
        }

        try {
            await axiosClient.post('elemento/registrar', formData).then((response) => {
                setIsSuccess(true);
                fetchData();
                onOpenChange(false);
                setFormData({
                    nombre_elm: "",
                    tipo_elm: "",
                    cantidad: ""
                });
                setMessage('Elemento Registrado Con Exito');
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
            setMessage('Elemento No registrado');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button className="bg-sky-600 text-white" endContent={<PlusIcon />} onPress={onOpen}>Registrar Elemento</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Nombre requerido
                                    </div>
                                )}

                                <Select
                                    label="Tipo"
                                    placeholder="Selecciona un Tipo"
                                    name="tipo_elm"
                                    value={formData.tipo_elm}
                                    onChange={(event) => handleSelectChange(event.target.value)}
                                >
                                    {tipoElementos.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.nombre}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formErrors.tipo_elm && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
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
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
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
            <SweetAlert type={isSuccess ? 'success' : 'error'} message={message}/>
        </div>
    );
};
