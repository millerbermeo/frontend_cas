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
        // Resetear el estado del campo de error
        setFormErrors({
            ...formErrors,
            [name]: false
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
            // Aquí puedes enviar los datos a tu backend utilizando axios o fetch
            await axiosClient.post('usuario/registrar', formData).then((response) => {
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
                setIsSuccess(true);
                setMessage('Usuario Registrado Con Exito');
                console.log(response.data);
            });

        } catch (error) {
            console.error('Error al enviar los datos:', error);
            if (error.response && error.response.status === 400) {
                setMessage('El email o la identificación ya están en uso');
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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my-1 rounded'>
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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my-1 rounded'>
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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my-1 rounded'>
                                        La identificación solo puede contener números
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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my-1 rounded'>
                                        El email debe ser válido
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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my-1 rounded'>
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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my-1 rounded'>
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
            {message && <SweetAlert type={isSuccess ? 'success' : 'error'} message={message}/>}
        </div>
    );
};
