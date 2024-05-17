import React from 'react'
import { TablaResiduos } from '../components/residuos/TablaResiduos'
import { CardComponent } from '../components/CardComponent'
import { CardUsageExample } from '../components/CardUsageExample'
import { Navbar } from '../components/Navbar'




function ResiduosPage() {
  return (
    <>
      <main className='w-full px-3 h-screen overflow-y-auto'>

        <Navbar tittle="Residuos"/>
        <div className='flex gap-3 my-10'>
        {/* <CardComponent salesAmount={71465} annualTarget={225000} progressPercentage={45} />
        <CardComponent salesAmount={95000} annualTarget={500000} progressPercentage={19} /> */}
        <CardComponent salesAmount={5000} annualTarget={10000} progressPercentage={50} />
        <CardComponent salesAmount={1000000} annualTarget={1200000} progressPercentage={83.33} />
        <CardUsageExample title="Sales" salesAmount="34,743" />
        <CardUsageExample title="Revenue" salesAmount="78,000" decorationColor="blue" />
        <CardUsageExample title="Total Income" salesAmount="142,300" decorationColor="green" />
        <CardUsageExample title="Yearly Profit" salesAmount="95,500" decorationColor="red" />

        </div>
        <TablaResiduos/>
      </main>
    </>
  )
}

export default ResiduosPage