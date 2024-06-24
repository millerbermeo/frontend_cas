import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';
import { SweetAlert } from "../../configs/SweetAlert";

export const ActualizarActividad = ({ fetchData, actividad }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        nombre_act: actividad.nombre_act,
        nombre_lugar: actividad.lugar_actividad,
        estado_actividad: actividad.estado_actividad,
        fecha_actividad: actividad.fecha_actividad
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        setIsSuccess(null);
        setMessage('');

        try {
            console.log(formData);
            await axiosClient.put(`actividades/actualizarAct/${actividad.id_actividad}`, formData).then((response) => {
                fetchData();
                console.log(response.data);
                setIsSuccess(true);
                onOpenChange(false);
                setMessage('Actividad Actualizada Con Éxito');
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
            setMessage('Actividad No Actualizada');
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
                            <ModalHeader className="flex flex-col gap-1">Actualizar Actividad</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Nombre de la Actividad"
                                    placeholder="Ingrese el nombre de la actividad"
                                    variant="bordered"
                                    name="nombre_act"
                                    value={formData.nombre_act}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Lugar de la Actividad"
                                    placeholder="Ingrese el lugar de la actividad"
                                    variant="bordered"
                                    name="nombre_lugar"
                                    value={formData.nombre_lugar}
                                    onChange={handleChange}
                                />
                                <select
                                    name="estado_actividad"
                                    value={formData.estado_actividad}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="asignada">Asignada</option>
                                    <option value="terminada">Terminada</option>
                                </select>
                                <Input
                                    label="Fecha de la Actividad"
                                    placeholder="Ingrese la fecha de la actividad"
                                    variant="bordered"
                                    name="fecha_actividad"
                                    value={formData.fecha_actividad}
                                    onChange={handleChange}
                                />
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
