import React from 'react';
import MUIDataTable from "mui-datatables";

const columns = ["Id Actividad", "Nombre Actividad", "Estado", "Fecha", "Acciones"];
const data = [];
const options = { filterType: 'checkbox' };

const TableActividad = () => {
    return (
        <MUIDataTable
            title={"Actividades"}
            data={data}
            columns={columns}
            options={options}
        />
    );
};

export default TableActividad;
