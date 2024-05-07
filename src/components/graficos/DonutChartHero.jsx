import { DonutChart } from '@tremor/react';

const datahero = [
  {
    name: 'Noche Holding AG',
    value: 9800,
  },
  {
    name: 'Rain Drop AG',
    value: 4567,
  },
  {
    name: 'Push Rail AG',
    value: 3908,
  },
  {
    name: 'Flow Steal AG',
    value: 2400,
  },
  {
    name: 'Tiny Loop Inc.',
    value: 2174,
  },
  {
    name: 'Anton Resorts Holding',
    value: 1398,
  },
];

const dataFormatter = (number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export const DonutChartHero = () => (
  <>
    <div className="mx-auto bg-zinc-100 p-2 space-y-12 flex w-full">
      <div className="space-y-3 w-full  ">
        <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          donut variant 1
        </span>
        <div className="flex justify-center w-full">
          <DonutChart
          className='w-full'
            data={datahero}
            variant="donut"
            valueFormatter={dataFormatter}
            onValueChange={(v) => console.log(v)}
          />
        </div>
      </div>
      <div className="space-y-3 w-full">
        <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          pie variant
        </span>
        <div className="flex justify-center w-full">
          <DonutChart
            data={datahero}
            variant="pie"
            valueFormatter={dataFormatter}
            onValueChange={(v) => console.log(v)}
          />
        </div>
      </div>
    </div>
  </>
);