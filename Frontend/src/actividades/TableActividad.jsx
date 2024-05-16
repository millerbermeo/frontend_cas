import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import axios from 'axios';



const TableActividad = () => {

    const [usuarios, setUsuarios] = useState([]);

    const fetchData = async () => {
        try {
          await axios.get('http://localhost:3000/actividades/listar').then((response) => {
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
        label: "tipo",
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
    }

]

    return (
        <MUIDataTable
            title={"Actividades"}
            data={usuarios}
            columns={columns}
        />
    );
};

export default TableActividad;
