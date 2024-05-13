import React, { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from 'dayjs';
import axiosClient from '../../configs/axiosClient';

const requireFormat = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'; // ISO string format

export const CalendarActividades = () => {
  const localizer = dayjsLocalizer(dayjs);
  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('actividades/listar');
      // Transformar datos para ajustarlos al formato esperado por el calendario
      const transformedEvents = response.data.map(activity => ({
        title: activity.nombre_act,
        start: new Date(activity.fecha_actividad),
        end: dayjs(activity.fecha_actividad).add(1, 'hour').toDate(), // asumiendo que cada actividad dura 1 hora
        allDay: false
      }));
      setEvents(transformedEvents);
      console.log(transformedEvents); // Para depuración
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Calendar
        className='w-full max-h-[70vh]'
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </>
  );
};
