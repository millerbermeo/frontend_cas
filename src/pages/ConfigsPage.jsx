import React from 'react'
import { Navbar } from '../components/Navbar'
import { TablaAlmacenamiento } from '../components/almacenamiento/TablaAlmacenamiento'
import { TablaEmpresas } from '../components/empresas/TablaEmpresas'
import { TablaTiposResiduos } from '../components/tipos/TablaTiposResiduos'



function ConfigsPage() {
    return (
        <>
            <main className='w-full px-3 h-screen overflow-y-auto'>

                <Navbar tittle="Configuraciones" />

                <div className='mt-8'>
                    <TablaAlmacenamiento />
                    <TablaEmpresas />
                    <TablaTiposResiduos />
                </div>
            </main>
        </>
    )
}

export default ConfigsPage