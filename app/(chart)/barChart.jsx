'use client'
import React, { useEffect, useState } from 'react';
//import ReactApexChart from 'react-apexcharts';
import { useAtom } from 'jotai';
import {emoAtom } from '@/app/(store)/store'
function BarChart(props) {
  const [emoArray, setEmoArray] = useAtom(emoAtom)
  const data = props?.spider;
  const [chartData, setChartData] = useState({
    series: [{
      data: [emoArray.happiness,emoArray.sadness,emoArray.fear,emoArray.anger,emoArray.disgust]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 380
      },
      plotOptions: {
        bar: {
          barHeight: '35%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom'
          },
          borderRadius: 5, // Adjust the bar width here (e.g., '50%')
        }
      },
      colors: ['#13d8aa', '#e8bd46', '#546E7A', '#d4526e', '#A5978B'
      ],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff']
        },
        formatter: function (val, opt) {
          return 
          //opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        categories: ["🤩 Happy","😅 sadness","☠️ fear","😡 anger","💩 disgust"
        ],
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: 'Customer Emotion For This Product',
        align: 'center',
        floating: true
      },
      subtitle: {
      //  text: 'Category Names as DataLabels inside bars',
        align: 'center',
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex] 
            
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    // Fetch or update data as needed
    // For example, you can fetch data here and update the chartData state
  }, []);

  return (
    <div id="chart">
    {/*  <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={380} /> */}
    </div>
  );
}

export default BarChart;
