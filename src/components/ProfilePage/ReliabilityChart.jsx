import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import NavbarLoanTaker from "./NavbarLoanTaker";
const ReliabilityChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const option = {
      animation: false,
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          itemStyle: { color: "#4F46E5" },
          progress: { show: true, width: 18 },
          pointer: { show: false },
          axisLine: { lineStyle: { width: 18 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          title: { fontSize: 14 },
          detail: {
            width: 50,
            height: 14,
            fontSize: 28,
            color: "#4F46E5",
            formatter: "{value}%",
          },
          data: [{ value: 85 }],
        },
      ],
    };
    chart.setOption(option);

    return () => chart.dispose();
  }, []);

  return (
    <div>
    <NavbarLoanTaker />
    <div className="bg-white shadow rounded-lg p-6 mt-20">
      <h2 className="text-lg font-semibold mb-4">Reliability Score</h2>
      <div className="flex justify-center" ref={chartRef} style={{ height: "200px" }}></div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">On-time Payments</span>
          <span className="font-medium">95%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-md h-2">
          <div className="bg-indigo-600 h-2 rounded-md" style={{ width: "95%" }}></div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ReliabilityChart;