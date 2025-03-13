import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom'
import { Power  } from "lucide-react";




export const ModalLogout2 = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate()


    const handleSubmit = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
        onOpenChange();

        navigate('/');

    };


    return (
        <>

<button color="" className='bg-sky-500 rounded-full w-[43px] absolute top-2.2 h-[43px] flex justify-center items-center right-3' onClick={onOpen}>
                <Power size={25} color='black'/>
                </button>



            <div className="flex flex-col gap-2 relative">



             

                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <form
                                >

                                    <ModalHeader className="flex flex-col gap-1">Cerrar Sesión</ModalHeader>
                                    <ModalBody>
                                        <h2>¿Estas Seguro  de Cerrar Sesión?</h2>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>Atras</Button>
                                        <Button color="primary" onClick={handleSubmit} onPress={onClose}>Cerrar</Button>
                                    </ModalFooter>

                                </form>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}
