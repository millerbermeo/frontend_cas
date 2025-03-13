import { Card, Text } from '@tremor/react';

export const CardUsageExample = ({title, salesAmount, decorationColor='indigo'}) => {
    return (
        <>
            <Card
                className="mx-auto max-w-xs"
                decoration="top"
                decorationColor={decorationColor}
            >
                <Text className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{title}</Text>
                <Text className="text-[28px] mt-5 text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                    ${salesAmount}
                </Text>
            </Card>
        </>
    )
}
