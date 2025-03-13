import React from 'react'
import { Navbar } from '../components/Navbar'
import { CardComponent } from '../components/CardComponent'
import { CardUsageExample } from '../components/CardUsageExample'
import { TableUsuarios } from '../components/usuarios/TableUsuarios'


function UsuariosPage() {
  return (
    <>
      <main className='w-full px-3 h-screen overflow-y-auto'>

        <Navbar tittle="Usuarios" />

        <div className='mt-10'>
          <TableUsuarios />
        </div>

      </main>
    </>
  )
}

export default UsuariosPage