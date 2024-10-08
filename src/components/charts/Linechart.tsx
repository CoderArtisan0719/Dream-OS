import {
  Chart,
  registerables,
  defaults,
  ChartOptions,
  LineController,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatAmount, getFillGradient } from "../../utils";
import { useEffect, useState } from "react";

Chart.register(...registerables);

defaults.font = {
  size: 10,
};

export function LineChart(props: {
  theme?: string;
  isLoading?: boolean;
  formatLabel?: unknown[];
  // [time, value]
  data: number[];
  pointColor?: string;
  labels?: string[];
  lineColor?: string;
  borderWidth?: number;
  layout?: ChartOptions<"line">["layout"];
  getFillGradientProp?: (gradientLinear?: number, theme?: string) => any;
  pointRadius?: (ctx: any, option: any) => number;
}) {
  const {
    pointRadius,
    lineColor: borderColor = "#34C759",
    pointColor: pointBackgroundColor = "#65C466",
    getFillGradientProp = getFillGradient,
    isLoading = false,
    borderWidth = 3,
    data,
    formatLabel,
    layout = {
      padding: 0,
      autoPadding: false,
    },
  } = props;
  const [dummyData, setDummyData] = useState<number[]>(DEFAULT_LINE_CHART_DATA);
  useEffect(() => {
    if (!isLoading) {
      setDummyData(new Array(DEFAULT_LINE_CHART_DATA.length).fill(0));
      return;
    }
    const interval = setInterval(() => {
      const newArray = Array.from(
        { length: DEFAULT_LINE_CHART_DATA.length + 2 },
        () => Math.floor(Math.random() * 10),
      );
      setDummyData(newArray);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <Line
      options={{
        animations: {
          radius: {
            duration: 400,
            easing: "linear",
            loop: (context) => context.active,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "#1D1D1D",
            titleFont: {
              weight: "lighter",
            },
            bodyFont: {
              weight: "lighter",
            },
            padding: 2,
            displayColors: false,
            callbacks: {
              title: function (arg) {
                return arg[0].label;
              },
              label: function ({ formattedValue }) {
                return formatAmount(
                  parseFloat(formattedValue.replace(/,/g, "")),
                  { minimumFractionDigits: 2 },
                );
              },
            },
          },
        },
        elements: {
          point: { radius: 0 },
          line: { borderJoinStyle: "round", borderWidth: 3 },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        layout,
      }}
      data={{
        labels:
          isLoading || data.length === 0
            ? DEFAULT_LINE_CHART_DATA.map((item) => "")
            : formatLabel,
        datasets: [
          {
            data: isLoading || data.length === 0 ? dummyData : data,
            label: "Value",
            borderWidth,
            tension: 0.4,
            borderColor,
            backgroundColor: getFillGradientProp(),
            borderCapStyle: "round",
            fill: true,
            clip: false,
            pointStyle: "circle",
            pointBackgroundColor,
            pointBorderColor: "transparent",
            pointRadius,
            pointHoverRadius: 10,
          },
        ],
      }}
    />
  );
}

const DEFAULT_LINE_CHART_DATA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
