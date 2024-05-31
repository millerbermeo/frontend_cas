import React, { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from 'dayjs';
import axiosClient from '../../configs/axiosClient';
import { ModalActividades } from '../utils/ModalActividades';

export const CalendarActividades = () => {
  const localizer = dayjsLocalizer(dayjs);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const fetchData = async () => {
    try {
      const response = await axiosClient.get('actividades/listar');
      const transformedEvents = response.data.map(activity => ({
        title: activity.nombre_act,
        start: new Date(activity.fecha_actividad),
        end: dayjs(activity.fecha_actividad).add(1, 'hour').toDate(),
        allDay: false,
        id_actividad: activity.id_actividad // Assuming the endpoint returns this field
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const eventPropGetter = (event) => {
    const backgroundColor = event.id_actividad % 2 === 0 ? '#1e90ff' : '#1e90ff'; // Example condition to alternate colors
    return {
      style: { backgroundColor }
    };
  };

  return (
    <>
      <Calendar
        className='w-full max-h-[70vh]'
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
        eventPropGetter={eventPropGetter}
      />
      <ModalActividades
        isOpen={modalVisible}
        onOpenChange={setModalVisible}
        selectedEvent={selectedEvent}
        id_actividad={selectedEvent ? selectedEvent.id_actividad : null}
      />
    </>
  );
};
