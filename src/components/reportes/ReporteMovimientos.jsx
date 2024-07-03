import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axiosClient from '../../configs/axiosClient';

const ReporteMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const fetchMovimientos = async () => {
    try {
      const response = await axiosClient.post('grafico/obtmov', {
        anio: selectedYear,
        mes: selectedMonth.padStart(2, '0') // Asegura que el mes tenga dos dígitos
      });
      setMovimientos(response.data);
      console.log('Datos obtenidos:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMovimientos();
    }
  }, [selectedMonth, selectedYear]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Movimientos", 14, 16);
    
    const tableColumn = ["Nombre Residuo", "Tipo Movimiento", "Cantidad Total", "Total Movimientos", "Descripción", "Unidad de Medida", "Tipo de Residuo", "Almacenamiento"];
    const tableRows = [];

    movimientos.forEach(mov => {
      const movData = [
        mov.nombre_residuo,
        mov.tipo_movimiento,
        mov.cantidad_total,
        mov.total_movimientos,
        mov.descripcion || "N/A",
        mov.unidad_medida,
        mov.tipo,
        mov.alm
      ];
      tableRows.push(movData);
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

    doc.save("reporte_movimientos.pdf");
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    console.log('Mes seleccionado:', value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    console.log('Año seleccionado:', value);
  };

  return (
    <div className="flex flex-col items-start justify-start w-full bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte de Residuos</h1>
      <div className="flex space-x-4 mb-4">
        <Select 
          label="Selecciona Mes" 
          placeholder="Selecciona Mes" 
          className="w-40"
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          <SelectItem key="01" value="01">Enero</SelectItem>
          <SelectItem key="02" value="02">Febrero</SelectItem>
          <SelectItem key="03" value="03">Marzo</SelectItem>
          <SelectItem key="04" value="04">Abril</SelectItem>
          <SelectItem key="05" value="05">Mayo</SelectItem>
          <SelectItem key="06" value="06">Junio</SelectItem>
          <SelectItem key="07" value="07">Julio</SelectItem>
          <SelectItem key="08" value="08">Agosto</SelectItem>
          <SelectItem key="09" value="09">Septiembre</SelectItem>
          <SelectItem key="10" value="10">Octubre</SelectItem>
          <SelectItem key="11" value="11">Noviembre</SelectItem>
          <SelectItem key="12" value="12">Diciembre</SelectItem>
        </Select>
        <Select 
          label="Selecciona Año" 
          placeholder="Selecciona Año" 
          className="w-40"
          onChange={(e) => handleYearChange(e.target.value)}
        >
          <SelectItem key="2024" value="2024">2024</SelectItem>
          <SelectItem key="2025" value="2025">2025</SelectItem>
          <SelectItem key="2026" value="2023">2026</SelectItem>
          <SelectItem key="2027" value="2024">2027</SelectItem>
          <SelectItem key="2028" value="2025">2028</SelectItem>
          <SelectItem key="2029" value="2023">2029</SelectItem>
          <SelectItem key="2030" value="2024">2030</SelectItem>
        </Select>
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        onClick={generatePDF}
      >
        Descargar PDF
      </button>
      <div className="w-full">
        {movimientos.length > 0 ? movimientos.map((mov, index) => (
          <div key={index} className="bg-white p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{mov.nombre_residuo}</h2>
            <p>Tipo Movimiento: {mov.tipo_movimiento}</p>
            <p>Cantidad Total: {mov.cantidad_total}</p>
            <p>Total Movimientos: {mov.total_movimientos}</p>
            <p>Descripción: {mov.descripcion}</p>
            <p>Unidad de Medida: {mov.unidad_medida}</p>
            <p>Tipo de Residuo: {mov.tipo}</p>
            <p>Almacenamiento: {mov.alm}</p>
          </div>
        )) : <p>No hay datos para mostrar</p>}
      </div>
    </div>
  );
};

export default ReporteMovimientos;
