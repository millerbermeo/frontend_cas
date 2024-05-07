import React from 'react'
import { BarChartHero } from '../components/graficos/BarChartHero'
import { Navbar } from '../components/Navbar'
import { DonutChartHero } from '../components/graficos/DonutChartHero'
import { LineChartHero } from '../components/graficos/LineChartHero'

function HomePage() {
  return (
    <>
   <main className='w-full px-3 h-screen overflow-y-auto'>
        <Navbar tittle="Home"/>
        <div className='flex mt-5 gap-5 rounded'>
        <BarChartHero/>
        <DonutChartHero/>
        </div>

       <div className='bg-zinc-100 mt-5'>
       <LineChartHero/>
       </div>
      </main>
    </>
  )
}

export default HomePage