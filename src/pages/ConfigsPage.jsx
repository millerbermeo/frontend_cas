import React from 'react'
import { Navbar } from '../components/Navbar'
import { TablaAlmacenamiento } from '../components/almacenamiento/TablaAlmacenamiento'
import { TablaEmpresas } from '../components/empresas/TablaEmpresas'
import { TablaTiposResiduos } from '../components/tipos/TablaTiposResiduos'
import { TablaAreas } from '../components/areas/TablaAreas'
import { TablaLugares } from '../components/lugares/TablaLugares'



function ConfigsPage() {
    return (
        <>
            <main className='w-full px-3 h-screen overflow-y-auto'>

                <Navbar tittle="Configuraciones" />

                <div className='mt-8'>
                    <TablaAlmacenamiento />
                    <TablaEmpresas />
                    <TablaTiposResiduos />
                    <TablaAreas/>
                    <TablaLugares/>
                </div>
            </main>
        </>
    )
}

export default ConfigsPage