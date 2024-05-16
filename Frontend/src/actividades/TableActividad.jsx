import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import axiosClient from '../configs/axiosClient';
import dayjs from 'dayjs'; // Importa dayjs

const TableActividad = () => {
    const [usuarios, setUsuarios] = useState([]);

    const fetchData = async () => {
        try {
            await axiosClient.get('http://localhost:3000/actividades/listar').then((response) => {
                const result = response.data;
                setUsuarios(result)
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            name: "id_actividad",
            label: "ID",
        },
        {
            name: "tipo_actividad",
            label: "Tipo",
        },
        {
            name: "nombre_act",
            label: "Nombre",
        },
        {
            name: "estado_actividad",
            label: "Estado",
        },
        {
            name: "lugar_actividad",
            label: "Lugar",
        },
        {
            name: "fecha_actividad",
            label: "Fecha",
            options: {
                customBodyRender: (value) => dayjs(value).format('DD/MM/YYYY') // Formatea la fecha
            }
        }
    ];

    return (
        <MUIDataTable
            title={"Actividades"}
            data={usuarios}
            columns={columns}
        />
    );
};

export default TableActividad;
