import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, useDisclosure, Button } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { User } from "@nextui-org/user";
import user from "../../assets/user.png";
import { SweetAlert } from '../../configs/SweetAlert';



export const ModalUser = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [message, setMessage] = useState(null);

    const storedName = localStorage.getItem('nombre');
    const storedRole = localStorage.getItem('rol');
    const id_usuario = localStorage.getItem('id');

    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({}); // Estado para los datos editados
    const [newPassword, setNewPassword] = useState(''); // Estado para la nueva contraseña

    const fetchData = async () => {
        try {
            const response = await axiosClient.get(`usuario/listar/${id_usuario}`);
            setData(response.data);
            setEditData(response.data[0]); // Suponiendo que hay un único usuario en la respuesta
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleUpdate = async () => {

        setIsSuccess(null);
        setMessage('');
        // if (!newPassword) {
        //     alert("La contraseña es obligatoria para actualizar los datos.");
        //     return;
        // }

        try {
            await axiosClient.put(`usuario/editar/${id_usuario}`, { ...editData, password: newPassword });
            fetchData(); // Vuelve a cargar los datos después de la actualización
            setIsSuccess(true);
            onOpenChange(true);
            setMessage('Usuario Actualizado Con Exito');
        } catch (error) {
            console.error('Error updating data:', error);

            setIsSuccess(false);
            onOpenChange(true);
            setMessage('Usuario No Actualizado');
        }
    };

    return (
        <>
            <div className='absolute top-2.5 scale-105 right-[120px] cursor-pointer' onClick={onOpen}>
                <User
                    name={storedName}
                    description={storedRole}
                    avatarProps={{
                        src: `${user}`
                    }}
                ></User>
            </div>
            <div className="flex flex-col gap-2 relative">
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <div className="bg-white max-w-2xl mx-auto shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6 flex justify-center items-center flex-col">
                                        <h3 className="text-2xl leading-6 font-medium text-gray-900">
                                            Usuario: {editData.nombre} {editData.apellidos}
                                        </h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Detalles e información sobre el usuario.
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-md text-gray-500">Nombre</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <input
                                                        type="text"
                                                        name="nombre"
                                                        value={editData.nombre || ''}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50"
                                                    />
                                                </dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-md text-gray-500">Apellidos</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <input
                                                        type="text"
                                                        name="apellidos"
                                                        value={editData.apellidos || ''}
                                                        onChange={handleChange}
                                                        className="w-full"
                                                    />
                                                </dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-md text-gray-500">Identificación</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <input
                                                        type="text"
                                                        name="identificacion"
                                                        value={editData.identificacion || ''}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50"
                                                    />
                                                </dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-md text-gray-500">Correo electrónico</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editData.email || ''}
                                                        onChange={handleChange}
                                                        className="w-full"
                                                    />
                                                </dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-md text-gray-500">Contraseña</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        placeholder='Cambia tu contraseña'
                                                        value={newPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full bg-gray-50"
                                                    />
                                                </dd>
                                            </div>
                                         <div className='flex-row 2xl:flex-col hidden'>
                                         <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-md text-gray-500">Rol</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">



                                                    <select
                                                        label="Rol"
                                                        placeholder="Selecciona un rol"
                                                        name="rol"
                                                        value={editData.rol || ''}
                                                        onChange={handleChange}
                                                        className="border rounded-md w-full p-2 focus:outline-none focus:ring focus:border-blue-300"
                                                    >
                                                        <option value="">Selecciona un rol</option>
                                                        <option value="administrador">Administrador</option>
                                                        <option value="pasante">Pasante</option>
                                                        <option value="operario">Operario</option>
                                                        <option value="aprendiz">Aprendiz</option>
                                                    </select>
                                                </dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-md text-gray-500">Estado</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">

                                                    <select
                                                        label="Estado"
                                                        placeholder="Enter estado"
                                                        variant="bordered"
                                                        name="estado"
                                                        value={editData.estado || ''}
                                                        onChange={handleChange}
                                                        className="border w-full rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                                    >
                                                        <option value="">Selecciona un Estado</option>
                                                        <option value="activo">Activo</option>
                                                        <option value="inactivo">Inactivo</option>
                                                    </select>
                                                </dd>
                                            </div>
                                         </div>
                                        </dl>
                                    </div>
                                    <div className="flex justify-end px-4 py-4 sm:px-6">
                                        <Button onClick={handleUpdate}>Actualizar</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <SweetAlert type={isSuccess ? 'success' : 'error'} message={message} />
            </div>
        </>
    );
};


