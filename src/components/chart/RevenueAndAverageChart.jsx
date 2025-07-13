import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { Card } from 'antd';

const RevenueAndAverageChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const months = data.map(item => {
      const date = new Date(item?.year, item?.month - 1);
      return date.toLocaleString('default', { month: 'short' });
    });

    const totalRevenueData = data.map(item => item.totalRevenue);
    const averagePaymentData = data.map(item => item.averagePayment);

    // Semi-blue color palette
    const colors = {
      primary: '#3B82F6',     // Vibrant blue (main)
      secondary: '#60A5FA',   // Medium blue
      dark: '#1D4ED8',       // Dark blue
      light: '#93C5FD',      // Light blue
      background: '#EFF6FF'  // Very light blue
    };

    const options = {
      series: [
        {
          name: 'Total Revenue',
          type: 'line',
          data: totalRevenueData
        },
        {
          name: 'Average Payment',
          type: 'line',
          data: averagePaymentData
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          }
        },
        toolbar: {
          show: true
        },
       
      },
      colors: [colors.primary, colors.secondary], // Both lines in blue shades
      stroke: {
        curve: 'smooth',
        width: [3, 3],
        dashArray: [0, 0]
      },
      markers: {
        size: 6,
        colors: [colors.primary, colors.secondary],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 8
        }
      },
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: '#374151',
            fontSize: '12px'
          }
        },
        axisBorder: {
          color: colors.light
        },
        axisTicks: {
          color: colors.light
        }
      },
      yaxis: [
        {
          title: {
            text: 'Revenue ($)',
            style: {
              color: colors.primary
            }
          },
          labels: {
            formatter: function(value) {
              return '$' + value;
            },
            style: {
              colors: colors.primary
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Average ($)',
            style: {
              color: colors.secondary
            }
          },
          labels: {
            formatter: function(value) {
              return '$' + value;
            },
            style: {
              colors: colors.secondary
            }
          }
        }
      ],
      tooltip: {
        shared: true,
        style: {
          fontSize: '12px'
        },
        y: [
          {
            formatter: function(value) {
              return '$' + value;
            }
          },
          {
            formatter: function(value) {
              return '$' + value;
            }
          }
        ]
      },
      legend: {
        position: 'top',
        markers: {
          fillColors: [colors.primary, colors.secondary]
        }
      },
      grid: {
        borderColor: colors.light,
        strokeDashArray: 4
      }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <Card
      title="Revenue & Average Payment"
      className="shadow-md rounded-lg border border-blue-100 "
      headStyle={{
        borderBottom: '1px solid #BFDBFE',
        
        fontWeight: 600
      }}
    >
      <div ref={chartRef} />
      <div className="px-6 pb-4 text-sm text-blue-700">
        <p>Total revenue and average payment per appointment by month.</p>
      </div>
    </Card>
  );
};

export default RevenueAndAverageChart;