import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Tooltip, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { SweetAlert } from '../../configs/SweetAlert';
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';

export const ModalActualizarResiduos = ({ fetchData, residuos }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);

    const [formData, setFormData] = useState({
        nombre_residuo: "",
        residuo: '',
        tipo_residuo: '',
        unidad_medida: '',
        fk_alm: '',
        descripcion: "" // Nueva variable para la descripción
    });

    let id = residuos.id_residuo;

    useEffect(() => {
        const fetchData1 = async () => {
            try {
                const response = await axiosClient.get('residuo/listar_tipos');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData1();
    }, []);

    useEffect(() => {
        const fetchData2 = async () => {
            try {
                const response = await axiosClient.get('residuo/listar_alm');
                setData2(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData2();
    }, []);

    useEffect(() => {
        const fetchData3 = async () => {
            try {
                const response = await axiosClient.get(`residuo/buscar2/${id}`);
                setData3(response.data);
                console.log("miller", response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isOpen) {
            fetchData3();
        }
    }, [isOpen, id]);

    useEffect(() => {
        if (data3.length > 0) {
            const { nombre_residuo, residuo, tipo_residuo, unidad_medida, fk_alm, descripcion } = data3[0];
            setFormData({
                nombre_residuo,
                residuo,
                tipo_residuo: tipo_residuo.toString(), // Asegúrate de que sea una cadena
                unidad_medida,
                fk_alm, // Asegúrate de que sea una cadena
                descripcion: descripcion || "" // Descripción opcional
            });
        }
    }, [data3]);

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
            await axiosClient.put(`residuo/actualizar/${residuos.id_residuo}`, formData).then((response) => {
                console.log(response.data);
                fetchData();
                onOpenChange(false);
                setFormData({
                    nombre_residuo: "",
                    residuo: '',
                    tipo_residuo: '',
                    unidad_medida: '',
                    fk_alm: '',
                    descripcion: "" // Restablecer descripción
                });
                setIsSuccess(true);
                setMessage('Residuo Actualizado Con Exito');
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
            onOpenChange(true);
            setMessage('Residuo No Actualizado ');
        }
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <Tooltip color="primary" content="Editar">
                    <Button color="" className='w-10 text-blue-600' onPress={onOpen}>
                        <EditIcon />
                    </Button>
                </Tooltip>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Actualizar</ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="Nombre"
                                        placeholder="Enter nombre"
                                        variant="bordered"
                                        name="nombre_residuo"
                                        value={formData.nombre_residuo}
                                        onChange={handleChange}
                                    />

                                    <select
                                        className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                        name="residuo"
                                        value={formData.residuo}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione un Residuo</option>
                                        <option value="no peligrosos">No peligrosos</option>
                                        <option value="peligrosos">Peligrosos</option>
                                    </select>

                                    <select
                                        className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                        name="tipo_residuo"
                                        value={formData.tipo_residuo}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona un Residuo</option>
                                        {data.map((item, index) => (
                                            <option key={item.id_tipo} value={item.id_tipo}>
                                                {item.tipo_residuo}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                        name="unidad_medida"
                                        value={formData.unidad_medida}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona una unidad</option>
                                        <option value="kilogramo">kilogramo</option>
                                        <option value="gramo">gramo</option>
                                        <option value="litros">litros</option>
                                        <option value="m3">m3</option>
                                        <option value="m2">m2</option>
                                        <option value="unidad">unidad</option>
                                    </select>

                                    <select
                                        className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                        name="fk_alm"
                                        value={formData.fk_alm}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona un almacenamiento</option>
                                        {data2.map((item, index) => (
                                            <option key={item.id_almacenamiento} value={item.id_almacenamiento}>
                                                {item.nombre_alm}
                                            </option>
                                        ))}
                                    </select>

                                    <Input
                                        label="Descripción"
                                        placeholder="Enter descripción"
                                        variant="bordered"
                                        name="descripcion"
                                        value={formData.descripcion}
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
        </>
    );
};
