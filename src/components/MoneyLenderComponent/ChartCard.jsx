import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import axios from "axios";
import { getRandomColor } from "../MoneyLenderComponent/getRandomColor";
const API_BASE_URL ="https://tagada.onrender.com";

const ChartCard = ({ title, id, customers: propCustomers, type, moneyLenderId }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [customers, setCustomers] = useState(propCustomers || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date as "DD MMM YYYY" (e.g., "28 Feb 2025")
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Define date range (last 7 days)
  const today = new Date();
  const endDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6); // 7 days including today
  const formattedStartDate = startDate.toISOString().split("T")[0];

  // Generate date range between start and end dates
  const generateDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDateObj = new Date(end);
    while (currentDate <= endDateObj) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };
  const dateRange = generateDateRange(formattedStartDate, endDate);

  // Fetch data for payment chart
  useEffect(() => {
    if (type === "payment") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [collectResponse, metricsResponse] = await Promise.all([
            axios.get(
              `${API_BASE_URL}/DailyLoanCollect/payment/total-collected?MoneyLenderId=${moneyLenderId}&startDate=${formattedStartDate}&endDate=${endDate}`,
              { withCredentials: true }
            ),
            axios.get(
              `${API_BASE_URL}/GraphMetric/admin/loan-metrics/${moneyLenderId}?startDate=${formattedStartDate}&endDate=${endDate}`,
              { withCredentials: true }
            ),
          ]);

          const collectData = collectResponse.data.loanCollections || [];
          const metricsData = metricsResponse.data.metrics || [];
          const combinedData = {};

          // Populate collected amounts
          collectData.forEach((item) => {
            combinedData[item.CollectDate] = {
              date: item.CollectDate,
              expected: 0,
              received: parseFloat(item.CollectedAmount) || 0,
            };
          });

          // Populate expected amounts and merge with collected amounts
          metricsData.forEach((item) => {
            const date = item.MetricDate;
            if (!combinedData[date]) {
              combinedData[date] = { date, expected: 0, received: 0 };
            }
            combinedData[date].expected = parseFloat(item.RequiredAmount) || 0;
            if (!combinedData[date].received) {
              combinedData[date].received = parseFloat(item.PaidAmount) || 0;
            }
          });

          // Fill in missing dates with last known expected amount
          let lastExpectedAmount = 0;
          const filledData = dateRange.map((date) => {
            if (combinedData[date]) {
              lastExpectedAmount = combinedData[date].expected || lastExpectedAmount;
              return {
                date,
                expected: combinedData[date].expected || lastExpectedAmount,
                received: combinedData[date].received || 0,
              };
            }
            return { date, expected: lastExpectedAmount, received: 0 };
          });

          setCustomers(filledData);
        } catch (err) {
          setError("Failed to fetch chart data");
          console.error("Error fetching chart data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setCustomers(propCustomers || []);
      setLoading(false);
    }
  }, [type, formattedStartDate, endDate, propCustomers, moneyLenderId]);

  // Render chart
  useEffect(() => {
    if (chartRef.current && !loading && customers.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      chartInstance.current = echarts.init(chartRef.current);

      let option = {};
      if (type === "payment") {
        const dates = customers.map((c) => c.date);
        const expectedData = customers.map((c) => c.expected || 0);
        const receivedData = customers.map((c) => c.received || 0);

        option = {
          tooltip: {
            trigger: "axis",
            formatter: "{b}<br/>{a0}: ₹{c0}<br/>{a1}: ₹{c1}",
          },
          legend: {
            data: ["Expected Amount", "Received Amount"],
            top: 10,
          },
          xAxis: {
            type: "category",
            data: dates.map(formatDate),
            axisLabel: { rotate: 45 },
          },
          yAxis: {
            type: "value",
            axisLabel: { formatter: "₹{value}" },
          },
          series: [
            {
              name: "Expected Amount",
              type: "line",
              smooth: true,
              data: expectedData,
              lineStyle: { color: "#4F46E5" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(79, 70, 229, 0.3)" },
                  { offset: 1, color: "rgba(79, 70, 229, 0)" },
                ]),
              },
            },
            {
              name: "Received Amount",
              type: "line",
              smooth: true,
              data: receivedData,
              lineStyle: { color: "#10B981" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(16, 185, 129, 0.3)" },
                  { offset: 1, color: "rgba(16, 185, 129, 0)" },
                ]),
              },
            },
          ],
        };
      } else if (type === "area") {
        const areaData = customers.reduce((acc, customer) => {
          acc[customer.Area] = (acc[customer.Area] || 0) + (parseFloat(customer.Loan_Amt) || 0);
          return acc;
        }, {});
        const areaColors = {};
        Object.keys(areaData).forEach((area) => {
          areaColors[area] = getRandomColor();
        });

        option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}: ₹{c} ({d}%)",
          },
          legend: {
            top: "bottom",
            data: Object.keys(areaData),
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "70%"],
              label: { show: true, position: "outside" },
              data: Object.entries(areaData).map(([name, value]) => ({
                name,
                value,
                itemStyle: { color: areaColors[name] },
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
      }

      if (Object.keys(option).length > 0) {
        chartInstance.current.setOption(option);
      }

      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [customers, loading, type]);

  // Render loading, error, or empty states
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center">
        Loading data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  // Render chart and optional table
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      <div ref={chartRef} id={id} className="h-96" />
      {type === "payment" && (
        <div className="mt-6">
          <h5 className="text-md font-semibold mb-2">Payment Data</h5>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Date</th>
                <th className="border border-gray-300 p-2 text-left">Expected Amount (₹)</th>
                <th className="border border-gray-300 p-2 text-left">Received Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.date}>
                  <td className="border border-gray-300 p-2">{formatDate(customer.date)}</td>
                  <td className="border border-gray-300 p-2">{customer.expected.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">{customer.received.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChartCard;