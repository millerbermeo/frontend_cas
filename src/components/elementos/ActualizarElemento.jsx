import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';
import { SweetAlert } from '../../configs/SweetAlert';

export const ActualizarElemento = ({ fetchData, elemento }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        nombre_elm: elemento.nombre_elm,
        tipo_elm: elemento.tipo_elm,
        cantidad: elemento.cantidad
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
            await axiosClient.put(`elemento/actualizar/${elemento.id_elemento}`, formData).then(() => {
                fetchData();
                onOpenChange(false);
                setFormData({
                    nombre_elm: "",
                    tipo_elm: "",
                    cantidad: ""
                });
                setMessage('Elemento Actualizado Con Exito');
            });

            setIsSuccess(true);
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
            onOpenChange(true);
            setMessage('Elemento No registrado');
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
                            <ModalHeader className="flex flex-col gap-1">Actualizar Elemento</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
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

                        
                                <select
                                    id="tipo_elm"
                                    name="tipo_elm"
                                    value={formData.tipo_elm}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="" disabled>Seleccione un tipo</option>
                                    {tipoElementos.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre}
                                        </option>
                                    ))}
                                </select>
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
                                <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
                                <Button color="primary" onClick={handleSubmit}>Actualizar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <SweetAlert type={isSuccess ? 'success' : 'error'} message={message}/>
        </div>
    );
};
