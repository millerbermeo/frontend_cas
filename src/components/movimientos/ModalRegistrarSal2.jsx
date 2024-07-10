import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";


import { PlusIcon } from '../icons/PlusIcon';
import axiosClient from '../../configs/axiosClient';
import { SweetAlert } from '../../configs/SweetAlert';
import { DeleteIcon } from 'lucide-react';



export const ModalRegistrarSal2 = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);

    
    const [formData, setFormData] = useState({
        id_residuo: residuos.id_residuo,
        usuario_adm: "",
        destino: ""
    });

    const [formErrors, setFormErrors] = useState({
        usuario_adm: false,
        destino: false
    });


    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('residuo/listar_admin');
                setData(response.data);
                console.log("admin", response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData2 = async () => {
            try {
                const response = await axiosClient.get('residuo/listar');
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
                const response = await axiosClient.get('residuo/listar_empresas');
                setData3(response.data);
                console.log("dataaa AAAA", response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData3();
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
        if (!formData.usuario_adm) {
            newFormErrors.usuario_adm = true;
        }
        if (!formData.destino) {
            newFormErrors.destino = true;
        }

        if (Object.keys(newFormErrors).length > 0) {
            // Actualizar estado de errores
            setFormErrors(newFormErrors);
            // Mostrar mensaje de error o manejar la validación según tu diseño
            console.log("Hay campos requeridos vacíos");
            return;
        }

        try {
            console.log(formData);
            await axiosClient.post('residuo/registrarsalida', formData).then((response) => {
                console.log(response.data);
                fetchData();
                setIsSuccess(true);
                setMessage('Movimiento De Salida Registrado Con Exito');
                onOpenChange(false);
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
            setIsSuccess(false);
            setMessage('Movimiento No registrado');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button color="" className='w-10' onPress={onOpen}><DeleteIcon /></Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Registrar Movimiento
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                    label="Adminstrador"
                                    placeholder="Selecciona un Encargado"
                                    name="usuario_adm"
                                    value={formData.usuario_adm}
                                    onChange={handleChange}
                                >
                                    {data.map((item, index) => (
                                        <SelectItem key={item.id_usuario} value={item.id_usuario}>
                                            {item.nombre}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formErrors.usuario_adm && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Encargado requerido
                                    </div>
                                )}

                                <Select
                                    label="destino"
                                    placeholder="Selecciona una Empresa"
                                    name="destino"
                                    value={formData.destino}
                                    onChange={handleChange}
                                >
                                    {data3.map((item, index) => (
                                        <SelectItem key={item.id_empresa} value={item.id_empresa}>
                                            {item.nombre_empresa}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formErrors.destino && (
                                    <div className='text-sm font-normal w-ful text-red-500 px-2 rounded'>
                                        Destino requerido
                                    </div>
                                )}

                                <Input
                                    disabled
                                    label="cantidad"
                                    placeholder="Enter cantidad"
                                    variant="bordered"
                                    name="cantidad"
                                    value={residuos.cantidad}
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
            <SweetAlert type={isSuccess ? 'success' : 'error'} message={message}/>
        </div>
  )
}
