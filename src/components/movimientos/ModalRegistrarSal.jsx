import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure, Checkbox } from "@nextui-org/react";
import { PlusIcon } from '../iconos/PlusIcon';
import { SweetAlert } from '../../configs/SweetAlert';
import axiosClient from '../../configs/axiosClient';






export const ModalRegistrarSal = ({ fetchData, initialCantidad = '' }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(null);
    const [isCantidadEnabled, setIsCantidadEnabled] = useState(false);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [cantidadResiduo, setCantidadResiduo] = useState('');

    const [formData, setFormData] = useState({
        id_residuo: "",
        usuario_adm: "",
        destino: "",
        registrar_cantidad: initialCantidad
    });

    const [formErrors, setFormErrors] = useState({
        id_residuo: false,
        usuario_adm: false,
        destino: false
    });



    const handleCheckboxChange = () => {
        setIsCantidadEnabled(!isCantidadEnabled);
    };


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


    const handleResiduoChange = async (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

        if (name === 'id_residuo' && value) {
            try {
                const response = await axiosClient.get(`residuo/buscar/${value}`);
                if (response && response.data) {
                    setCantidadResiduo(response.data); // Asume que el objeto viene directamente
                } else {
                    setCantidadResiduo('No disponible');
                }
            } catch (error) {
                console.error('Error fetching residuo data:', error);
                setCantidadResiduo('Error al buscar');
            }
        }
    };


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
        const newFormErrors = {};

        Object.entries(formData).forEach(([key, value]) => {
            // Asegúrate de excluir la validación para 'registrar_cantidad'
            if (!value && key !== 'registrar_cantidad') {
                newFormErrors[key] = true;
            }
        });

        if (Object.keys(newFormErrors).length > 0) {
            setFormErrors(newFormErrors);
            return;
        }

        try {
            // Enviar los datos a tu backend utilizando axios o fetch
            console.log(formData);

            await axiosClient.post('residuo/registrarsalida', formData).then(() => {

                fetchData();
                onOpenChange(false);
                setFormData('')

                setIsSuccess(true);
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            setIsSuccess(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">

            <Button color="default" endContent={<PlusIcon />} onPress={onOpen}>Registrar Salida</Button>

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
                                    autoFocus
                                    label="Residuo"
                                    placeholder="Selecciona un Residuo"
                                    name="id_residuo"
                                    value={formData.id_residuo}
                                    onChange={handleResiduoChange}
                                >
                                    <SelectItem disabled>Seleccionar Residuo</SelectItem>
                                    {data2.map((item) => (
                                        <SelectItem key={item.id_residuo} value={item.id_residuo}>
                                            {item.nombre_residuo}
                                        </SelectItem>
                                    ))}
                                </Select>

                                {formErrors.id_residuo && (
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Residuo Requerido
                                    </div>
                                )}

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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Administrador Requerido
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
                                    <div className='text-lg font-normal w-full bg-red-600 text-white px-2 py-0.5 my- rounded'>
                                        Destino Requerido
                                    </div>
                                )}

                                <Checkbox checked={isCantidadEnabled} onChange={handleCheckboxChange}>
                                 <div className='flex gap-x-3'>
                                 <span> Cantidad: {cantidadResiduo.cantidad || '0'}</span>
                                    <span>
                                    {cantidadResiduo.unidad_medida}
                                    </span>
                                 </div>
                                </Checkbox>

                                <Input
                                    label="cantidad"
                                    placeholder="Enter cantidad"
                                    variant="bordered"
                                    name="registrar_cantidad"
                                    value={formData.registrar_cantidad}
                                    onChange={handleChange}
                                    disabled={!isCantidadEnabled}
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

            <SweetAlert isSuccess={isSuccess} />
        </div>
    )
}
