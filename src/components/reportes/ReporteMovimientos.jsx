import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axiosClient from '../../configs/axiosClient';

const ReporteMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [tiposResiduos, setTiposResiduos] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTipoMovimiento, setSelectedTipoMovimiento] = useState('');
  const [selectedTipoResiduo, setSelectedTipoResiduo] = useState('todos'); // Default to 'todos'
  const [message, setMessage] = useState('');

  const fetchMovimientos = async () => {
    try {
      const response = await axiosClient.post('grafico/obtmov2', {
        anio: selectedYear,
        mes: selectedMonth ? selectedMonth.padStart(2, '0') : '', // Asegura que el mes tenga dos dígitos
        tipoMovimiento: selectedTipoMovimiento,
        tipoResiduo: selectedTipoResiduo !== 'todos' ? selectedTipoResiduo : '', // Only include if not 'todos'
      });
      setMovimientos(response.data);
      setMessage('');
      console.log('Datos obtenidos:', response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage(error.response.data.message);
        setMovimientos([]);
      } else {
        setMessage('Error al obtener los datos.');
        setMovimientos([]);
      }
      console.error('Error fetching data:', error);
    }
  };

  const fetchTiposResiduos = async () => {
    try {
      const response = await axiosClient.get('tipos_residuos/listar');
      setTiposResiduos(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTiposResiduos();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMovimientos();
    }
  }, [selectedMonth, selectedYear, selectedTipoMovimiento, selectedTipoResiduo]);

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

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["Nombre Residuo", "Tipo Movimiento", "Cantidad Total", "Total Movimientos", "Descripción", "Unidad de Medida", "Tipo de Residuo", "Almacenamiento"],
      ...movimientos.map(mov => [
        mov.nombre_residuo,
        mov.tipo_movimiento,
        mov.cantidad_total,
        mov.total_movimientos,
        mov.descripcion || "N/A",
        mov.unidad_medida,
        mov.tipo,
        mov.alm
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Aplicar estilos a las celdas
    const wscols = [
      { wch: 20 }, // "Nombre Residuo"
      { wch: 20 }, // "Tipo Movimiento"
      { wch: 15 }, // "Cantidad Total"
      { wch: 15 }, // "Total Movimientos"
      { wch: 30 }, // "Descripción"
      { wch: 20 }, // "Unidad de Medida"
      { wch: 20 }, // "Tipo de Residuo"
      { wch: 20 }  // "Almacenamiento"
    ];
    ws['!cols'] = wscols;

    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "FFCCCCCC" } }
    };

    ws["A1"].s = headerStyle;
    ws["B1"].s = headerStyle;
    ws["C1"].s = headerStyle;
    ws["D1"].s = headerStyle;
    ws["E1"].s = headerStyle;
    ws["F1"].s = headerStyle;
    ws["G1"].s = headerStyle;
    ws["H1"].s = headerStyle;

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    XLSX.writeFile(wb, 'reporte_movimientos.xlsx');
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    console.log('Mes seleccionado:', value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    console.log('Año seleccionado:', value);
  };

  const handleTipoMovimientoChange = (value) => {
    setSelectedTipoMovimiento(value);
    console.log('Tipo Movimiento seleccionado:', value);
  };

  const handleTipoResiduoChange = (value) => {
    setSelectedTipoResiduo(value);
    console.log('Tipo Residuo seleccionado:', value);
  };

  return (
    <div className="flex flex-col items-start justify-start w-full bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte de Residuos</h1>
      <div className="flex space-x-4 mb-4 w-full">
        <Select
          label="Selecciona Año"
          placeholder="Selecciona Año"
          className="w-full"
          color='primary'
          onChange={(e) => handleYearChange(e.target.value)}
        >
          <SelectItem key="2024" value="2024">2024</SelectItem>
          <SelectItem key="2025" value="2025">2025</SelectItem>
          <SelectItem key="2026" value="2026">2026</SelectItem>
          <SelectItem key="2027" value="2027">2027</SelectItem>
          <SelectItem key="2028" value="2028">2028</SelectItem>
          <SelectItem key="2029" value="2029">2029</SelectItem>
          <SelectItem key="2030" value="2030">2030</SelectItem>
        </Select>
        <Select
          label="Selecciona Mes"
          placeholder="Selecciona Mes"
          className="w-full"
          color='primary'
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
          label="Tipo Movimiento"
          placeholder="Tipo Movimiento"
          className="w-full"
          color='primary'
          onChange={(e) => handleTipoMovimientoChange(e.target.value)}
        >
          <SelectItem key="" value="">Todos</SelectItem>
          <SelectItem key="entrada" value="entrada">Entrada</SelectItem>
          <SelectItem key="salida" value="salida">Salida</SelectItem>
        </Select>
        <Select
          label="Tipo Residuo"
          placeholder="Tipo Residuo"
          className="w-full"
          color='primary'
          onChange={(e) => handleTipoResiduoChange(e.target.value)}
        >
          <SelectItem key="todos" value="todos">Todos</SelectItem>
          {tiposResiduos.map(tipo => (
            <SelectItem key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.tipo_residuo}</SelectItem>
          ))}
        </Select>
      </div>
     <div className='flex gap-3'>
     <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        onClick={generatePDF}
      >
        Descargar PDF
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
        onClick={generateExcel}
      >
        Descargar Excel
      </button>
     </div>
      <div className="w-full">
        {message ? (
          <p>{message}</p>
        ) : movimientos.length > 0 ? (
          movimientos.map((mov, index) => (
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
          ))
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default ReporteMovimientos;
