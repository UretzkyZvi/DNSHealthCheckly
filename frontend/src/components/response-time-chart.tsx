import { BarChart } from "@tremor/react";
import { FC } from "react";

export interface ResponseTimeValue {
  name: string;
  "Response Time": number;
}
interface ResponseTimeChartProps {
  data: ResponseTimeValue[];
}

const ResponseTimeChart: FC<ResponseTimeChartProps> = ({ data }) => {
  return (
    <BarChart
      className="mt-6 w-full"
      data={data}
      index="name"
      categories={["Response Time"]}
      colors={["blue"]}
      yAxisWidth={48}
    
    />
  );
};

export default ResponseTimeChart;
