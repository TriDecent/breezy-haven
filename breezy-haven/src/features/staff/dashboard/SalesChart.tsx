'use client';
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components';
import { formatter } from '@/shared/utils';
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

export type Sale = Readonly<{
  date: string;
  total: number;
  extra: number;
}>;

const chartConfig: ChartConfig = {
  total: {
    label: 'Total sales',
    color: 'var(--chart-2)',
  },
  extra: {
    label: 'Extra sales',
    color: 'var(--chart-4)',
  },
};

export function SalesChart({ sales }: { sales: Sale[] }) {
  return sales.length === 0 ? (
    <p className='text-center'>No result</p>
  ) : (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={sales}
        margin={{ right: 20, left: 20 }}
      >
        <CartesianGrid />
        <YAxis
          name='Sales'
          tickMargin={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => formatter.formatPrice(value)}
        />
        <XAxis
          dataKey={'date'}
          tickMargin={10}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Area
          dataKey={'total'}
          color={chartConfig.total.color}
          fill={chartConfig.total.color}
          opacity={0.75}
          type='monotone'
          stroke={chartConfig.total.color}
          strokeWidth={2}
        />
        <Area
          dataKey={'extra'}
          color={chartConfig.extra.color}
          fill={chartConfig.extra.color}
          opacity={0.75}
          type='monotone'
          stroke={chartConfig.extra.color}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
