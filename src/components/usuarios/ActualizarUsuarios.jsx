import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
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
        rol: false,
        estado: false,
        password: false
    });

    const [formData, setFormData] = useState({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        identificacion: usuario.identificacion,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
        password: usuario.password
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
            // Enviar los datos actualizados al backend
            await axiosClient.put(`usuario/editar/${usuario.id_usuario}`, formData).then(() => {
                fetchData();
            });

            setIsSuccess(true);
            onOpenChange(false);

            setFormData('')
            setIsSuccess(true);
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
                                    placeholder="Enter nombre"
                                    variant="bordered"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                {formErrors.nombre && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Nombre Requerido
                                    </div>
                                )}

                                <Input
                                    autoFocus
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
                                    placeholder="Enter identificación"
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
                                        Email Requerido
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
                                </select>

                                {/* <Select
                                    label="Rol"
                                    placeholder="Selecciona un rol"
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                >
                                    <SelectItem onClick={() => setFormData({ ...formData, rol: "administrador" })}>
                                        Administrador
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, rol: "pasante" })}>
                                        Pasante
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, rol: "operario" })}>
                                        Operario
                                    </SelectItem>
                                </Select> */}
                                {formErrors.rol && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Rol Requerido
                                    </div>
                                )}

                                {/* <Input
                                    label="Estado"
                                    placeholder="Enter estado"
                                    variant="bordered"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                /> */}


<select
                                        label="Estado"
                                        placeholder="Enter estado"
                                        variant="bordered"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Selecciona un Estado</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>


                                
                                {formErrors.estado && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Estado Requerido
                                    </div>
                                )}

                                <Input
                                    label="Password"
                                    placeholder="Enter password"
                                    variant="bordered"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {formErrors.password && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Password Requerido
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
  )
}
