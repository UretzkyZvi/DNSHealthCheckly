import { BarChart } from "@tremor/react";
import { FC } from "react";

export interface TTLValue {
  name: string;
  "TTL Value": number;
}

interface TTLChartChartProps {
  data: TTLValue[];
}

const TTLChart: FC<TTLChartChartProps> = ({ data }) => {
  return (
    <BarChart
      className="mt-6  w-full  "
      data={data}
      index="name"
      categories={["TTL Value"]}
      colors={["blue"]}
      yAxisWidth={48}
      data-testid="bar-chart"
    />
  );
};

export default TTLChart;
