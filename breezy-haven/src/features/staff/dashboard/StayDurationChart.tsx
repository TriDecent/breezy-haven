'use client';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

export type StayDurationPie = Readonly<{
  name: keyof typeof chartConfig;
  value: number;
}>;

const chartConfig = {
  oneNight: {
    label: '1 night',
    color: 'var(--chart-1)',
  },
  twoNight: {
    label: '2 nights',
    color: 'var(--chart-2)',
  },
  threeNight: {
    label: '3 nights',
    color: 'var(--chart-3)',
  },
  fourToFiveNight: {
    label: '4 - 5 nights',
    color: 'var(--chart-4)',
  },
  sixToSevenNight: {
    label: '6 - 7 nights',
    color: 'var(--chart-5)',
  },
  eightToFourteenNight: {
    label: '8 - 14 nights',
    color: 'var(--chart-1)',
  },
  fifteenToTwentyOneNight: {
    label: '15 - 21 nights',
    color: 'var(--chart-2)',
  },
  aboveTwentyOneNight: {
    label: '21+ nights',
    color: 'var(--chart-3)',
  },
} as const satisfies ChartConfig;

export function StayDurationChart({
  pieData,
}: {
  pieData: readonly StayDurationPie[];
}) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className='min-h-96 w-full md:min-h-82'
    >
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        {isMobile ? (
          <ChartLegend
            content={
              <ChartLegendContent className='flex flex-row flex-wrap justify-center gap-x-4 gap-y-2' />
            }
            verticalAlign='bottom'
          />
        ) : (
          <ChartLegend
            content={<ChartLegendContent className='flex flex-col' />}
            layout='vertical'
            align='right'
            verticalAlign='middle'
          />
        )}

        <Pie
          data={[...pieData]}
          dataKey='value'
          nameKey='name'
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          label
        >
          {pieData.map(pie => (
            <Cell key={pie.name} fill={chartConfig[pie.name].color} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
