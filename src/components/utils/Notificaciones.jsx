import React, { useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Badge } from "@nextui-org/react";
import { NotificationIcon } from '../iconos/NotificationIcon';
import { NotificationContext } from '../../configs/NotificationContext';

// Configura el cliente de socket.io
const socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling']
});

const Notificaciones = () => {
    const { notificaciones, setNotificaciones } = useContext(NotificationContext);

    useEffect(() => {
        // Leer notificaciones desde sessionStorage al montar el componente
        const storedNotificaciones = JSON.parse(sessionStorage.getItem('notificaciones')) || [];
        setNotificaciones(storedNotificaciones);

        // Manejar la recepción de notificaciones del socket
        socket.on('notificacion', (data) => {
            setNotificaciones((prev) => {
                // Evita duplicados
                const alreadyExists = prev.some(notif => notif.id_elemento === data.id_elemento && notif.cantidad === data.cantidad);
                if (alreadyExists) return prev;

                // Agregar la nueva notificación al inicio
                const updatedNotificaciones = [data, ...prev];
                
                // Limitar a las últimas 5 notificaciones
                const limitedNotificaciones = updatedNotificaciones.slice(0, 5);
                
                // Guardar notificaciones en sessionStorage
                sessionStorage.setItem('notificaciones', JSON.stringify(limitedNotificaciones));
                
                return limitedNotificaciones;
            });
        });

        // Limpiar la suscripción al desmontar el componente
        return () => {
            socket.off('notificacion');
        };
    }, [setNotificaciones]);

    return (
        <Dropdown>
            <DropdownTrigger>
                <div className="relative cursor-pointer bg-sky-500 rounded-full scale-95 w-[45px] h-[45px] flex items-center justify-center">
                    <NotificationIcon size={30} />
                    {notificaciones.length > 0 && (
                        <Badge
                            content={notificaciones.length}
                            color="danger"
                            shape="circle"
                            className="absolute -top-4 right-0"
                        />
                    )}
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Lista de notificaciones">
                {notificaciones.length === 0 ? (
                    <DropdownItem key="no-notifications">No hay notificaciones</DropdownItem>
                ) : (
                    notificaciones.map((notif, index) => (
                        <DropdownItem className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-0'}`} key={index}>
                            <div>
                                <div className='flex gap-2'>
                                    <p className='uppercase font-semibold'>{notif.nombre_elm}</p>
                                    <p>Cantidad: {notif.cantidad}</p>
                                </div>
                                <p className=''>{`El stock del elemento ${notif.nombre_elm} tiene ${notif.cantidad} unidades restantes.`}</p>
                            </div>
                        </DropdownItem>
                    ))
                )}
            </DropdownMenu>
        </Dropdown>
    );
};

export default Notificaciones;
