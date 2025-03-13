import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axiosClient from '../../configs/axiosClient';

const ReporteElementos = () => {
  const [elementos, setElementos] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState([]);

  const fetchElementos = async () => {
    try {
      const response = await axiosClient.post('grafico/obtelementos', {
        tipos: selectedTipos
      });
      setElementos(response.data);
      console.log('Datos obtenidos:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedTipos.length > 0) {
      fetchElementos();
    }
  }, [selectedTipos]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Elementos", 14, 16);

    const tableColumn = ["Nombre Elemento", "Tipo Elemento", "Cantidad"];
    const tableRows = [];

    elementos.forEach(elm => {
      const elmData = [elm.nombre_elm, elm.tipo_elm, elm.cantidad];
      tableRows.push(elmData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { fontSize: 10 }
    });

    doc.save("reporte_elementos.pdf");
  };

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["Nombre Elemento", "Tipo Elemento", "Cantidad"],
      ...elementos.map(elm => [
        elm.nombre_elm,
        elm.tipo_elm,
        elm.cantidad
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Aplicar estilos a las celdas
    const wscols = [
      { wch: 20 }, // "Nombre Elemento"
      { wch: 20 }, // "Tipo Elemento"
      { wch: 10 }  // "Cantidad"
    ];
    ws['!cols'] = wscols;

    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "FFCCCCCC" } }
    };

    ["A1", "B1", "C1"].forEach(cell => {
      ws[cell].s = headerStyle;
    });

    XLSX.utils.book_append_sheet(wb, ws, "Elementos");
    XLSX.writeFile(wb, 'reporte_elementos.xlsx');
  };

  const handleTiposChange = (value) => {
    setSelectedTipos(value);
    console.log('Tipos seleccionados:', value);
  };

  return (
    <div className="flex flex-col items-start justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte de Elementos</h1>
      <div className="flex space-x-4 mb-4">
        <Select 
          label="Selecciona Tipos" 
          placeholder="Selecciona Tipos" 
          multiple
          color='primary'
          className="w-96"
          onChange={(e) => handleTiposChange(e.target.value)}
        >
          <SelectItem key="consumible" value="consumible">Consumible</SelectItem>
          <SelectItem key="herramienta" value="herramienta">Herramienta</SelectItem>
          <SelectItem key="aseo" value="aseo">Aseo</SelectItem>
          <SelectItem key="otro" value="otro">Otro</SelectItem>
        </Select>
      </div>
      <div className="flex space-x-4 mb-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={generatePDF}
        >
          Descargar PDF
        </button>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={generateExcel}
        >
          Descargar Excel
        </button>
      </div>
      <div className="w-full">
        {elementos.length > 0 ? (
          elementos.map((elm, index) => (
            <div key={index} className="bg-white p-4 mb-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{elm.nombre_elm}</h2>
              <p>Tipo Elemento: {elm.tipo_elm}</p>
              <p>Cantidad: {elm.cantidad}</p>
            </div>
          ))
        ) : <p>No hay datos para mostrar</p>}
      </div>
    </div>
  );
};

export default ReporteElementos;
