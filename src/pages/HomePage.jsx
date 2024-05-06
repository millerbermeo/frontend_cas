import React from 'react'
import { BarChartHero } from '../components/graficos/BarChartHero'
import { Navbar } from '../components/Navbar'

function HomePage() {
  return (
    <>
      <main className='w-full px-3'>
        <Navbar/>
        <BarChartHero/>
      </main>
    </>
  )
}

export default HomePage