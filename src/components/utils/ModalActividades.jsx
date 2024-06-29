import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Listbox, ListboxItem } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';

export const ModalActividades = ({ isOpen, onOpenChange, selectedEvent, id_actividad }) => {
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id_actividad) return;
            try {
                const response = await axiosClient.get(`actividades/listarUsersAct/${id_actividad}`);
                const response2 = await axiosClient.get(`actividades/listar/${id_actividad}`);
                const response3 = await axiosClient.get(`actividades/listarUserElm/${id_actividad}`);
                setData(response.data);
                setData2(response2.data);
                setData3(response3.data);


                console.log("ee",response3)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (isOpen) {
            fetchData();
        } else {
            // Clear data when modal is closed
            setData([]);
            setData2([]);
            setData3([]);
        }
    }, [isOpen, id_actividad]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
                <ModalContent>
                    <ModalHeader>Info de la Actividad</ModalHeader>
                    <ModalBody>
                        <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                            <span className='px-3'>Actividad: {id_actividad}</span>
                            {data2.map(item => (
                                <div key={item.id_actividad}>
                                    <Listbox>
                                        <ListboxItem>Nombre: {item.nombre_act}</ListboxItem>
                                        <ListboxItem>Lugar: {item.nombre_lugar ?? item.lugar_actividad}</ListboxItem>
                                        <ListboxItem>Estado: {item.estado_actividad}</ListboxItem>
                                    </Listbox>
                                </div>
                            ))}
                        </div>
                        <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                            <span className='px-3'>Usuarios:</span>
                            {data.map(item => (
                                <div key={item.id_usuario}>
                                    <Listbox>
                                        <ListboxItem>Nombre: {item.nombre} {item.apellidos}</ListboxItem>
                                    </Listbox>
                                </div>
                            ))}
                        </div>
                        <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                            <span className='px-3'>Elementos:</span>
                            {data3.map(item => (
                                <div key={item.id_elemento}>
                                    <Listbox>
                                        <ListboxItem>Nombre: {item.nombre_elm}</ListboxItem>
                                        <ListboxItem>Cantidad: {item.cantidad}</ListboxItem>
                                    </Listbox>
                                </div>
                            ))}
                        </div>
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
