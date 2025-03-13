import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { SweetAlert } from '../../configs/SweetAlert';
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';

export const ActualizarUsuarios = ({ fetchData, usuario }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        apellidos: false,
        identificacion: false,
        email: false,
        telefono: false,
        rol: false,
        estado: false,
        password: false
    });

    const [formData, setFormData] = useState({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        identificacion: usuario.identificacion,
        email: usuario.email,
        telefono: usuario.telefono || '',
        rol: usuario.rol,
        estado: usuario.estado,
        password: ''
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
            case 'password':
                return value === '' || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value);
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
            if (!validateField(key, value) && key !== 'password') {
                newFormErrors[key] = true;
            }
        });

        if (formData.password && !validateField('password', formData.password)) {
            newFormErrors.password = true;
        }

        if (Object.keys(newFormErrors).length > 0) {
            setFormErrors(newFormErrors);
            return;
        }

        const { password, ...dataToUpdate } = formData;

        try {
            // Enviar los datos actualizados al backend
            await axiosClient.put(`usuario/editar/${usuario.id_usuario}`, { ...dataToUpdate, password }).then(() => {
                fetchData();
            });

            setIsSuccess(true);
            onOpenChange(false);
            setMessage('Usuario Actualizado Con Exito');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            setIsSuccess(false);
            onOpenChange(true);
            setMessage('Usuario No Actualizado');
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
                            <ModalHeader className="flex flex-col gap-1">Actualizar Usuario</ModalHeader>
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
                                    autoFocus
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
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 roundedd'>
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
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
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
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        El teléfono solo puede contener números
                                    </div>
                                )}

                                <select
                                    label="Rol"
                                    placeholder="Selecciona un rol"
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Selecciona un rol</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="pasante">Pasante</option>
                                    <option value="operario">Operario</option>
                                    <option value="aprendiz">Aprendiz</option>
                                </select>
                                {formErrors.rol && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Rol Requerido
                                    </div>
                                )}

                                <select
                                    label="Estado"
                                    placeholder="Selecciona un estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Selecciona un estado</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                                {formErrors.estado && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Estado Requerido
                                    </div>
                                )}

                                <Input
                                    label="Password"
                                    placeholder="Ingrese password"
                                    variant="bordered"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {formErrors.password && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my-1 rounded'>
                                        La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número
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
