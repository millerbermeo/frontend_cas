import React from 'react'
import { BarChartHero } from '../components/graficos/BarChartHero'
import { Navbar } from '../components/Navbar'
import { DonutChartHero } from '../components/graficos/DonutChartHero'
import { BarListAlm } from '../components/graficos/BarListAlm'
import { BarChartActividad } from '../components/graficos/BarChartActividad'
import { BarChartElemento } from '../components/graficos/BarChartElemento'



function HomePage() {
  return (
    <>
      <main className='w-full px-3 h-screen overflow-y-auto'>
        <Navbar tittle="Home" />

        <div className='flex gap-8 mt-6'>

        </div>
        <div className='flex  mt-5 flex-col lg:flex-row justify-center gap-5 rounded'>
          <BarChartHero />
          <BarChartElemento/>
        </div>



        <div className='mt-5 flex flex-col lg:flex-row lg:items-end justify-center lg:justify-start w-full gap-5'>
          <BarListAlm />
          <DonutChartHero />
          <BarChartActividad />

        </div>
      </main>
    </>
  )
}

export default HomePage