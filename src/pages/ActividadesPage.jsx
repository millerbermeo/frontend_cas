import React from 'react'
import { Navbar } from '../components/Navbar'
import { Tabs, Tab } from "@nextui-org/tabs";
import { CalendarActividades } from '../components/actividades/CalendarActividades';
import { TableActividades } from '../components/actividades/TableActividades';
import { RegistrarActividad } from '../components/actividades/RegistrarActividad';


function ActividadesPage() {
  return (
    <>
      <main className='w-full px-3 h-screen overflow-y-auto'>

        <Navbar tittle="Actividades" />


        <div className="flex flex-wrap gap-4 w-full my-10">

          <Tabs className='w-full' size="md" color='primary' aria-label="Tabs sizes">
            <Tab title="Calendario" className='flex w-full gap-x-2'>
         <CalendarActividades/>
            </Tab>

            <Tab className='flex flex-col w-full' title="Actividades">

              <TableActividades/>
            </Tab>
            <Tab className='w-full' title="Registrar Actividad">
            <RegistrarActividad/>
            </Tab>
          </Tabs>

        </div>


      </main>
    </>
  )
}

export default ActividadesPage