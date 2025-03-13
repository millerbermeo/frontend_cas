import React from 'react'
import { Navbar } from '../components/Navbar'
import { TablaAlmacenamiento } from '../components/almacenamiento/TablaAlmacenamiento'
import { TablaEmpresas } from '../components/empresas/TablaEmpresas'
import { TablaTiposResiduos } from '../components/tipos/TablaTiposResiduos'
import { TablaAreas } from '../components/areas/TablaAreas'
import { TablaLugares } from '../components/lugares/TablaLugares'
import { Tabs, Tab } from "@nextui-org/tabs";



function ConfigsPage() {
    return (
        <>
            <main className='w-full px-3 h-screen overflow-y-auto'>

                <Navbar tittle="Configuraciones" />

                <div className='mt-8'>
                    <Tabs className='w-full' size="md" color='primary' aria-label="Tabs sizes">
                        <Tab title="Almacenamiento" className='flex flex-col w-full gap-x-2'>
                            <TablaAlmacenamiento />
                        </Tab>

                        <Tab className='flex flex-col w-full' title="Tipos Residuos">
                            <TablaTiposResiduos />
                        </Tab>

                        <Tab className='w-full' title="Destino">
                            <TablaEmpresas />
                        </Tab>

                        <Tab className='w-full' title="Areas ">
                            <TablaAreas />
                        </Tab>
                        <Tab className='w-full' title="Lugares">
                            <TablaLugares />
                        </Tab>
                    </Tabs>







                </div>
            </main>
        </>
    )
}

export default ConfigsPage