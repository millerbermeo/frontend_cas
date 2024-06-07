

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { User } from "@nextui-org/user";
import user from "../../assets/user.png";



export const ModalUser = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const storedName = localStorage.getItem('nombre');
    const storedRole = localStorage.getItem('rol');
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axiosClient.get('usuario/listar/1');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <>
            <div className='absolute right-3 cursor-pointer' onClick={onOpen}>
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
                                    {data.map((item) => (
                                        <div key={item.id_usuario}>
                                            <div className="px-4 py-5 sm:px-6 flex justify-center items-center flex-col">
                                                <h3 className="text-2xl leading-6 font-medium text-gray-900">Usuario: {item.nombre} {item.apellidos}</h3>
                                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles e información sobre el usuario.</p>
                                            </div>
                                            <div className="border-t border-gray-200">
                                                <dl>
                                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-md  text-gray-500">Nombre</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                            {item.nombre} {item.apellidos}
                                                        </dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-md text-gray-500">Identificación</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.identificacion}</dd>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-md text-gray-500">Correo electrónico</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.email}</dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-md text-gray-500">Rol</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.rol}</dd>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-md text-gray-500">Estado</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.estado}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}
