import React from 'react'
import { Navbar } from '../components/Navbar'
import ReporteMovimientos from '../components/reportes/ReporteMovimientos'
import ReporteElementos from '../components/reportes/ReporteElementos'





function ReportesPage() {
  return (
    <>
         <main className='w-full px-3 h-screen overflow-y-auto'>
        <Navbar tittle="Reportes" />

        <div className='flex flex-col w-full gap-8 mt-6'>
        <ReporteMovimientos/>

        <ReporteElementos/>


   
        </div>


        
        
      </main>
    </>
  )
}

export default ReportesPage