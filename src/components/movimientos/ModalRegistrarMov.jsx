import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { PlusIcon } from '../iconos/PlusIcon';


export const ModalRegistrarMov = ({ fetchData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);

 

    const [formData, setFormData] = useState({
        id_residuo: "",
        cantidad: "",
        usuario_adm: "",
        fk_actividad: ""
    });


    const [formErrors, setFormErrors] = useState({
        id_residuo: false,
        cantidad: false,
        usuario_adm: false,
        fk_actividad: false
    });

    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);





    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('residuo/listar_admin');
                setData(response.data);
                console.log("admin", response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    const fetchData2 = async () => {
        try {
            const response = await axiosClient.get('residuo/listar');
            setData2(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {


        fetchData2();
    }, []);



    const fetchData3 = async () => {
        try {
            const response = await axiosClient.get('residuo/listar_actividad');
            setData3(response.data);
            console.log("dataaa AAAA", response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };




    useEffect(() => {

        fetchData3();
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

    const handleSubmit = async () => {

        setIsSuccess(null);
        setMessage('');
        const newFormErrors = {};

        // Validar campos
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) {
                newFormErrors[key] = true;
            }
        });

        if (Object.keys(newFormErrors).length > 0) {
            setFormErrors(newFormErrors);
            return;
        }

        try {
            // Enviar los datos a tu backend utilizando axios o fetch
            await axiosClient.post('residuo/registrarmov', formData).then(() => {
                setIsSuccess(true);
                fetchData();
                onOpenChange(false);
                setFormData('')
                setIsSuccess(true);
                setMessage('Movimiento Registrado Con Exito');
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
            onOpenChange(true);
            setMessage('Movimiento No registrado');
        }

        
    };

    return (
        <div className="flex flex-col gap-2">
            <Button className='bg-sky-600 text-white' endContent={<PlusIcon />} onPress={onOpen}>Registrar Entrada</Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Registrar Movimiento
                            </ModalHeader>
                            <ModalBody>

                                <Select
                                    autoFocus
                                    label="Residuo"
                                    placeholder="Selecciona un Residuo"
                                    name="id_residuo"
                                    value={formData.id_residuo}
                                    onChange={handleChange}
                                >
                                    <SelectItem>
                                        Seleccionar Residuo
                                    </SelectItem>
                                    {data2.map((item, index) => (
                                        <SelectItem key={item.id_residuo} value={item.id_residuo}>
                                            {item.nombre_residuo}
                                        </SelectItem>
                                    ))}
                                </Select>
                                
                                {formErrors.id_residuo && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Residuo Requerido
                                    </div>
                                )}

                                <Select
                                    label="Adminstrador"
                                    placeholder="Selecciona un Encargado"
                                    name="usuario_adm"
                                    value={formData.usuario_adm}
                                    onChange={handleChange}
                                >
                                    <SelectItem>
                                        Seleccionar un administrador
                                    </SelectItem>
                                    {data.map((item, index) => (
                                        <SelectItem key={item.id_usuario} value={item.id_usuario}>
                                            {item.nombre}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formErrors.usuario_adm && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Administrador Requerido
                                    </div>
                                )}

                                <Select
                                    label="actividad"
                                    placeholder="Selecciona una actividad"
                                    name="fk_actividad"
                                    value={formData.fk_actividad}
                                    onChange={handleChange}
                                    disabled={!data3.length} 
                                >
                                    {data3.length ? ( 
                                        data3.map((item, index) => (
                                            <SelectItem key={item.id_actividad} value={item.id_actividad}>
                                                {`${item.id_actividad}) ${ item.nombre_act}`}
                                            </SelectItem>
                                        ))
                                    ) : (
                                   
                                        <SelectItem disabled>
                                            No hay actividades disponibles
                                        </SelectItem>
                                    )}
                                </Select>
                                {formErrors.fk_actividad && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Actividad Requerida
                                    </div>
                                )}

                                <Input
                                    label="cantidad"
                                    placeholder="Enter cantidad"
                                    variant="bordered"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                />
                                {formErrors.cantidad && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Cantidad Requerida
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
  )
}
