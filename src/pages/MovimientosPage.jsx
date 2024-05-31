import React from 'react'
import { Navbar } from '../components/Navbar'

import { TableMovimientos } from '../components/movimientos/TableMovimientos'
import CarouselMov from '../components/graficos/CarouselMov'


function MovimientosPage() {
  return (
    <>
      <main className='w-full px-3 h-screen overflow-y-auto'>

        <Navbar tittle="Movimientos"/>
        <div className='flex mt-6 mb-10'>
<CarouselMov/>
        </div>

        <TableMovimientos/>
      </main>
    </>
  )
}

export default MovimientosPage