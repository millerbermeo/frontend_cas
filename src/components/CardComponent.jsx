import { Card, Metric, Text, Flex, ProgressBar } from '@tremor/react';

export function CardComponent({ salesAmount, annualTarget, progressPercentage }) {
  return (
    <Card decoration="top"
      decorationColor="indigo"
      maxWidth="max-w-sm" shadow="md" padding="p-4">
      <Text color="gray-700" size="text-lg">Sales</Text>
      <Metric value={salesAmount} format="currency" currency="USD" />
      <Flex direction="flex-col" gap="gap-2" marginTop="mt-4">
        <Text>Percentage of annual target:</Text>
        <Metric value={`${(salesAmount / annualTarget * 100).toFixed(2)}%`} />
        <Text>Total Annual Target: ${annualTarget}</Text>
      </Flex>
      <ProgressBar percentageValue={progressPercentage} marginTop="mt-2" color="blue" />
    </Card>
  );
}
