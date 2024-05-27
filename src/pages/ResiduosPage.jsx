import React from 'react'
import { TablaResiduos } from '../components/residuos/TablaResiduos'

import { Navbar } from '../components/Navbar'
import Carousel from '../components/graficos/Carousel'




function ResiduosPage() {
  return (
    <>
      <main className='w-full px-3 h-screen overflow-y-auto'>

        <Navbar tittle="Residuos" />
        <div className='flex gap-3 my-10'>

          <Carousel />


        </div>
        <TablaResiduos />
      </main>
    </>
  )
}

export default ResiduosPage