import React from 'react'
import { Navbar } from '../components/Navbar'
import { TableElementos } from '../components/elementos/TableElementos'


function ElementosPage() {
  return (
    <>
      <main className='w-full px-3 h-screen overflow-y-auto'>

        <Navbar tittle="Elementos" />
  
 <div className='mt-8'>
 <TableElementos/>
 </div>
      </main>
    </>
  )
}

export default ElementosPage