import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, Tooltip, Select, SelectItem, Input, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

import { Autocomplete, AutocompleteSection, AutocompleteItem } from "@nextui-org/autocomplete";
import { SweetAlert } from '../../configs/SweetAlert';
import axiosClient from '../../configs/axiosClient';
import { EditIcon } from '../iconos/EditIcon';



export const ModalActualizarResiduos = ({ fetchData, residuos }) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const [isSuccess, setIsSuccess] = useState(null);


    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);




    const [formData, setFormData] = useState({
        nombre_residuo: "",
        residuo: '',
        tipo_residuo: '',
        unidad_medida: '',
        fk_alm: ''
    });

    let id = residuos.id_residuo




    useEffect(() => {
        const fetchData1 = async () => {
            try {
                const response = await axiosClient.get('residuo/listar_tipos');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData1();
    }, []);

    useEffect(() => {
        const fetchData2 = async () => {
            try {
                const response = await axiosClient.get('residuo/listar_alm');
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
                const response = await axiosClient.get(`residuo/buscar/${id}`);
                setData3(response.data);
                console.log("miller", response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isOpen) {
            fetchData3();
        }
    }, [isOpen, id]);

    useEffect(() => {
        if (data3.length > 0) {
            const { nombre_residuo, residuo, tipo_residuo, unidad_medida, fk_alm } = data3[0];
            setFormData({
                nombre_residuo,
                residuo,
                tipo_residuo: tipo_residuo.toString(), // Asegúrate de que sea una cadena
                unidad_medida,
                fk_alm// Asegúrate de que sea una cadena
            });
        }
    }, [data3]);



    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            // console.log(formData);
            // alert("Datos actualizados correctamente");

            await axiosClient.put(`residuo/actualizar/${residuos.id_residuo}`, formData).then((response) => {
                onOpenChange(false);
                console.log(response.data)
                fetchData()
                  onOpenChange(false);
            })



            setIsSuccess(true)




        } catch (error) {
            console.error('Error submitting data:', error);
            onOpenChange(false);
            setIsSuccess(false)
        }
    };


  return (
    <>
         <div className="flex flex-col gap-2">
         <Tooltip color="primary" content="Editar">
            <Button color="" className='w-10 text-blue-600' onPress={onOpen}>   <EditIcon /></Button>

            </Tooltip>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Actualizar</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Nombre"
                                    placeholder="Enter nombre"
                                    variant="bordered"
                                    name="nombre_residuo"
                                    defaultValue={formData.nombre_residuo}
                                    value={formData.nombre_residuo}
                                    onChange={handleChange}
                                />


                                <select
                                    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                    name="residuo"
                                    value={formData.residuo}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un Residuo</option>
                                    <option value="no peligrosos">No peligrosos</option>
                                    <option value="peligrosos">Peligrosos</option>
                                </select>



                                {/* <Input
                                    label="Residuo"

                                    placeholder="Seleccione un Residuo"
                                    name="residuo"
                                    value={formData.residuo}
                                    defaultItems={residuo}
                                    onChange={handleChange}
                                /> */}

{/* <Select
                                    label="Residuo"
                                    placeholder="Seleccione un Residuo"
                                    name="residuo"
                                    value={formData.residuo}
                                    defaultItems={formData.residuo}
                                    onChange={handleChange}
                                >
                                    <SelectItem onClick={() => setFormData({ ...formData, residuo: "no peligrosos" })}>
                                        No peligrosos
                                    </SelectItem>
                                    <SelectItem onClick={() => setFormData({ ...formData, residuo: "peligrosos" })}>
                                        Peligrosos
                                    </SelectItem>
                                </Select> */}

                                {/* <Select
                                    label="Tipo Residuo"
                                    placeholder="Selecciona un Residuo"
                                    name="tipo_residuo"
                                    value={formData.tipo_residuo}
                                    onChange={(value) => setFormData({ ...formData, tipo_residuo: value })}
                                >
                                    {data.map((item, index) => (
                                        <SelectItem key={item.id_tipo} value={item.id_tipo}>
                                            {item.tipo_residuo}
                                        </SelectItem>
                                    ))}
                                </Select> */}

<select
    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
    name="tipo_residuo"
    value={formData.tipo_residuo}
    onChange={handleChange}
>
    <option value="">Selecciona un Residuo</option>
    {data.map((item, index) => (
        <option key={item.id_tipo} value={item.id_tipo}>
            {item.tipo_residuo}
        </option>
    ))}
</select>


                                {/* <Select
                                    label="Unidad medida"
                                    placeholder="Selecciona una unidad"
                                    name="unidad_medida"
                                    value={formData.unidad_medida}
                                    onChange={(value) => setFormData({ ...formData, unidad_medida: value })}
                                >
                                    <SelectItem value="1">kilogramo</SelectItem>
                                    <SelectItem value="2">gramo</SelectItem>
                                    <SelectItem value="3">litros</SelectItem>
                                    <SelectItem value="4">m3</SelectItem>
                                    <SelectItem value="5">m2</SelectItem>
                                </Select> */}

<select
    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
    name="unidad_medida"
    value={formData.unidad_medida}
    onChange={handleChange}
>
    <option value="">Selecciona una unidad</option>
    <option value="kilogramo">kilogramo</option>
    <option value="gramo">gramo</option>
    <option value="litros">litros</option>
    <option value="m3">m3</option>
    <option value="m2">m2</option>
    <option value="unidad">unidad</option>
</select>


                                {/* <Select
                                    label="Almacenamiento"
                                    placeholder="Selecciona un almacenamiento"
                                    name="fk_alm"
                                    value={formData.fk_alm}
                                    onChange={(value) => setFormData({ ...formData, fk_alm: value })}
                                >
                                    {data2.map((item, index) => (
                                        <SelectItem key={item.id_almacenamiento} value={item.id_almacenamiento}>
                                            {item.nombre_alm}
                                        </SelectItem>
                                    ))}
                                </Select> */}

<select
    className="border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
    name="fk_alm"
    value={formData.fk_alm}
    onChange={handleChange}
>
    <option value="">Selecciona un almacenamiento</option>
    {data2.map((item, index) => (
        <option key={item.id_almacenamiento} value={item.id_almacenamiento}>
            {item.nombre_alm}
        </option>
    ))}
</select>




                                {/* <Input
                                    label="Tipo Residuo"
                                    placeholder="Selecciona un Residuo"
                                    name="tipo_residuo"
                                    // defaultItems={tipo_residuo}
                                    value={formData.tipo_residuo}
                                    onChange={handleChange}
                                /> */}



                                {/* <Input

                                    label="Unidad medida"
                                    placeholder="Selecciona una unidad"
                                    name="unidad_medida"
                                    // defaultItems={unidad_medida}
                                    value={formData.unidad_medida}
                                    onChange={handleChange}
                                /> */}



                                {/* <Input
                                    label="Almacenamiento"
                                    placeholder="Selecciona un almacenamiento"
                                    name="fk_alm"
                                    // defaultItems={fk_alm}
                                    value={formData.fk_alm}
                                    onChange={handleChange}
                                /> */}


                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
                                <Button color="primary" onClick={handleSubmit} onPress={onClose}>Actualizar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <SweetAlert isSuccess={isSuccess}/>
        </div>
    </>
  )
}
