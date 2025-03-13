import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { PlusIcon } from '../iconos/PlusIcon';
import { SweetAlert } from '../../configs/SweetAlert';

export const ModalRegisterResiduo = ({ fetchData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);

    const [formData, setFormData] = useState({
        nombre_residuo: "",
        residuo: "",
        tipo_residuo: "",
        unidad_medida: "",
        fk_alm: "",
        descripcion: "" // Nueva variable para la descripción
    });

    const [formErrors, setFormErrors] = useState({
        nombre_residuo: false,
        residuo: false,
        tipo_residuo: false,
        unidad_medida: false,
        fk_alm: false
    });

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
            if (!value && key !== "descripcion") { // La descripción no es requerida
                newFormErrors[key] = true;
            }
        });

        if (Object.keys(newFormErrors).length > 0) {
            setFormErrors(newFormErrors);
            return;
        }

        try {
            await axiosClient.post('residuo/registrar', formData).then(() => {
                setFormData({
                    nombre_residuo: "",
                    residuo: "",
                    tipo_residuo: "",
                    unidad_medida: "",
                    fk_alm: "",
                    descripcion: ""
                });
                setIsSuccess(true);
                setMessage('Residuo Registrado Con Exito');
                fetchData();
                onOpenChange(false);
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
            setMessage('Residuo No registrado');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button className='bg-[#2293CE] text-white' endContent={<PlusIcon />} onPress={onOpen}>Registrar</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Registrar Residuo
                            </ModalHeader>
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
                                {formErrors.nombre_residuo && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Nombre de residuo requerido
                                    </div>
                                )}

                                <Select
                                    label="Residuo"
                                    placeholder="Seleccione un Residuo"
                                    name="residuo"
                                    value={formData.residuo}
                                    onChange={handleChange}
                                >
                                    <SelectItem onClick={() => setFormData({ ...formData, residuo: "1" })}>
                                        No peligrosos
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, residuo: "2" })}>
                                        Peligrosos
                                    </SelectItem>
                                </Select>
                                {formErrors.residuo && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Residuo requerido
                                    </div>
                                )}

                                <Select
                                    label="Tipo Residuo"
                                    placeholder="Selecciona un Residuo"
                                    name="tipo_residuo"
                                    value={formData.tipo_residuo}
                                    onChange={handleChange}
                                >
                                    {data.map((item, index) => (
                                        <SelectItem key={item.id_tipo} value={item.id_tipo}>
                                            {item.tipo_residuo}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formErrors.tipo_residuo && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Tipo de residuo requerido
                                    </div>
                                )}

                                <Select
                                    label="Unidad medida"
                                    placeholder="Selecciona una unidad"
                                    name="unidad_medida"
                                    value={formData.unidad_medida}
                                    onChange={handleChange}
                                >
                                    <SelectItem onClick={() => setFormData({ ...formData, unidad_medida: "1" })}>
                                        Kilogramo
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, unidad_medida: "2" })}>
                                        Gramo
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, unidad_medida: "3" })}>
                                        Litros
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, unidad_medida: "4" })}>
                                        m3
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, unidad_medida: "5" })}>
                                        m2
                                    </SelectItem>
                                </Select>
                                {formErrors.unidad_medida && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Unidad de medida requerida
                                    </div>
                                )}

                                <Select
                                    label="Almacenamiento"
                                    placeholder="Selecciona un almacenamiento"
                                    name="fk_alm"
                                    value={formData.fk_alm}
                                    onChange={handleChange}
                                >
                                    {data2.map((item, index) => (
                                        <SelectItem key={item.id_almacenamiento} value={item.id_almacenamiento}>
                                            {item.nombre_alm}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formErrors.fk_alm && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Almacenamiento requerido
                                    </div>
                                )}

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
    )
}
