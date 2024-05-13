import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';
import {SweetAlert} from "../../configs/SweetAlert"



export const ActualizarActividad = ({ fetchData, actividad }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);


    
    const [formData, setFormData] = useState({
        // tipo_actividad: actividad.tipo_actividad,
        nombre_act: actividad.nombre_act,
        nombre_lugar:actividad.lugar_actividad,
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
        try {
            console.log(formData);
        
            await axiosClient.put(`actividades/actualizarAct/${actividad.id_actividad}`, formData).then((response) => {
                fetchData();
                console.log(response.data)
                setIsSuccess(true)
                onOpenChange(false);
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting data:', error);
            onOpenChange(false);
            setIsSuccess(false)
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
                                {/* <Input
                                    autoFocus
                                    label="tipo_actividad"
                                    placeholder="Enter tipo_actividad"
                                    variant="bordered"
                                    name="tipo_actividad"
                                    value={formData.tipo_actividad}
                                    onChange={handleChange}
                                /> */}
                                <Input
                                    autoFocus
                                    label="nombre_act"
                                    placeholder="Enter nombre_act"
                                    variant="bordered"
                                    name="nombre_act"
                                    value={formData.nombre_act}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="nombre_lugar"
                                    placeholder="Enter nombre_lugar"
                                    variant="bordered"
                                    name="nombre_lugar"
                                    value={formData.nombre_lugar}
                                    onChange={handleChange}
                                />
                                   <Input
                                    label="estado_actividad"
                                    placeholder="Enter estado_actividad"
                                    variant="bordered"
                                    name="estado_actividad"
                                    value={formData.estado_actividad}
                                    onChange={handleChange}
                                />
                                 <Input
                                    label="fecha_actividad"
                                    placeholder="Enter fecha_actividad"
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

            <SweetAlert isSuccess={isSuccess}/>

        </div>
  )
}
