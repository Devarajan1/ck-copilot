'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

export default function LineChart(props) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const [labels, setLabels] = useState([]);
  const [negative_trends, setNegative_trends] = useState([]);
  const [positive_trends, setPositive_trends] = useState([]);
  const data = props?.data;

  useEffect(() => {
    const labels = data.map(item => `Q${item.quarter} ${item.year}`);
    const negative_trends = data.map(item => item.negative_sentiment_score);
    const positive_trends = data.map(item => item.positive_sentiment_score);
    setLabels(labels);
    setNegative_trends(negative_trends);
    setPositive_trends(positive_trends);
  }, [data]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Positive Sentiment Scores',
        data: positive_trends,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Negative Sentiment Scores',
        data: negative_trends,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const dataIndex = tooltipItem.index;
          return [
            `Positive Sentiment Scores: ${positive_trends[dataIndex]}`,
            `Negative Sentiment Scores: ${negative_trends[dataIndex]}`,
          ];
        },
      },
    },
  };

  return <Line data={chartData} options={options} height={60} width={100} />;
}