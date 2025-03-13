import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from '../iconos/PlusIcon';
import { SweetAlert } from '../../configs/SweetAlert';
import axiosClient from '../../configs/axiosClient';

export const RegistrarUsuario = ({ fetchData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        apellidos: false,
        identificacion: false,
        email: false,
        telefono: false,
        rol: false
    });

    const [errorMessages, setErrorMessages] = useState({
        identificacion: '',
        email: ''
    });

    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        identificacion: "",
        email: "",
        telefono: "",
        rol: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Resetear el estado del campo de error y mensaje de error
        setFormErrors({
            ...formErrors,
            [name]: false
        });
        setErrorMessages({
            ...errorMessages,
            [name]: ''
        });
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'nombre':
            case 'apellidos':
                return /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value);
            case 'identificacion':
                return /^\d+$/.test(value);
            case 'telefono':
                return value === '' || /^\d+$/.test(value);
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            default:
                return value.length > 0;
        }
    };

    const handleSubmit = async () => {
        setIsSuccess(null);
        setMessage('');

        const newFormErrors = {};
        const newErrorMessages = {};

        // Validar campos
        Object.entries(formData).forEach(([key, value]) => {
            if (!validateField(key, value)) {
                newFormErrors[key] = true;
            }
        });

        if (Object.keys(newFormErrors).length > 0) {
            setFormErrors(newFormErrors);
            return;
        }

        try {
            const response = await axiosClient.post('usuario/registrar', formData);
            if (response.status === 200) {
                setIsSuccess(true);
                fetchData();
                onOpenChange(false);
                setFormData({
                    nombre: "",
                    apellidos: "",
                    identificacion: "",
                    email: "",
                    telefono: "",
                    rol: ""
                });
                setMessage('Usuario registrado exitosamente');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                if (errorMessage.includes('email')) {
                    newErrorMessages.email = 'El email ya está en uso';
                }
                if (errorMessage.includes('identificación')) {
                    newErrorMessages.identificacion = 'La identificación ya está en uso';
                }
                setErrorMessages(newErrorMessages);
            } else {
                setMessage('Error al registrar el usuario');
            }
            setIsSuccess(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button className="bg-sky-600 text-white" endContent={<PlusIcon />} onPress={onOpen}>Registrar Usuario</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                                    placeholder="Ingrese nombre"
                                    variant="bordered"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                {formErrors.nombre && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        El nombre solo puede contener letras, espacios y caracteres acentuados
                                    </div>
                                )}

                                <Input
                                    label="Apellidos"
                                    placeholder="Ingrese apellidos"
                                    variant="bordered"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                />
                                {formErrors.apellidos && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Los apellidos solo pueden contener letras, espacios y caracteres acentuados
                                    </div>
                                )}

                                <Input
                                    label="Identificación"
                                    placeholder="Ingrese identificación"
                                    variant="bordered"
                                    name="identificacion"
                                    value={formData.identificacion}
                                    onChange={handleChange}
                                />
                                {formErrors.identificacion && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        La identificación solo puede contener números
                                    </div>
                                )}
                                {errorMessages.identificacion && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        {errorMessages.identificacion}
                                    </div>
                                )}

                                <Input
                                    label="Email"
                                    placeholder="Ingrese email"
                                    variant="bordered"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {formErrors.email && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        El email debe ser válido
                                    </div>
                                )}
                                {errorMessages.email && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        {errorMessages.email}
                                    </div>
                                )}

                                <Input
                                    label="Teléfono"
                                    placeholder="Ingrese teléfono"
                                    variant="bordered"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                                {formErrors.telefono && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        El teléfono solo puede contener números
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
                                    <SelectItem onClick={() => setFormData({ ...formData, rol: "4" })}>
                                        Aprendiz
                                    </SelectItem>
                                </Select>
                                {formErrors.rol && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Rol requerido
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
            {message && <SweetAlert type={isSuccess ? 'success' : 'error'} message={message}/>}
        </div>
    );
};
