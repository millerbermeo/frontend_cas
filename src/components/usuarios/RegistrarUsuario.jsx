import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from '../iconos/PlusIcon';
import { SweetAlert } from '../../configs/SweetAlert';
import axiosClient from '../../configs/axiosClient';




export const RegistrarUsuario = ({ fetchData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        apellidos: false,
        identificacion: false,
        email: false,
        rol: false
    });

    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        identificacion: "",
        email: "",
        rol: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Resetear el estado del campo de error
        setFormErrors({
            ...formErrors,
            [name]: false
        });
    };

    const handleSubmit = async () => {
        const newFormErrors = {};

        // Validar campos
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) {
                newFormErrors[key] = true;
            } else if (key === 'email' && !value.includes('@')) {
                newFormErrors[key] = true;
            }
        });

        if (Object.keys(newFormErrors).length > 0) {
            setFormErrors(newFormErrors);
            return;
        }

        try {
            // Aquí puedes enviar los datos a tu backend utilizando axios o fetch
            await axiosClient.post('http://localhost:3000/usuario/registrar', formData).then((response) => {
                setIsSuccess(true);
                fetchData();
                onOpenChange(false);
            });
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            setIsSuccess(false);
        }
    };


    return (
        <div className="flex flex-col gap-2">
            <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>Registrar Usuario</Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center">
                                Registrar Usuario
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Nombre"
                                    placeholder="Enter nombre"
                                    variant="bordered"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                {formErrors.nombre && (
                                    <div className='text-lg font-normal w-full text-whi bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Nombre Requerido
                                    </div>
                                )}

                                <Input
                                    label="Apellidos"
                                    placeholder="Enter apellidos"
                                    variant="bordered"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                />
                                {formErrors.apellidos && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Apellidos Requeridos
                                    </div>
                                )}

                                <Input
                                    label="Identificación"
                                    placeholder="Enter identificacion"
                                    variant="bordered"
                                    name="identificacion"
                                    value={formData.identificacion}
                                    onChange={handleChange}
                                />
                                {formErrors.identificacion && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Identificación Requerida
                                    </div>
                                )}

                                <Input
                                    label="Email"
                                    placeholder="Enter email"
                                    variant="bordered"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {formErrors.email && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Email Requerido y debe ser válido
                                    </div>
                                )}




                                <Select
                                    label="Rol"
                                    placeholder="Selecciona un rol"
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                >
                                    <SelectItem onClick={() => setFormData({ ...formData, rol: "1" })}>
                                        Administrador
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, rol: "2" })}>
                                        Pasante
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, rol: "3" })}>
                                        Operario
                                    </SelectItem>
                                </Select>
                                {formErrors.rol && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Rol Requerido
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
            <SweetAlert isSuccess={isSuccess} />
        </div>
    )
}
