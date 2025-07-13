import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { Card } from 'antd';

const AppointmentsChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const months = data.map(item => {
      const date = new Date(item.year, item.month - 1);
      return date.toLocaleString('default', { month: 'short' });
    });

    const totalAppointmentsData = data.map(item => item.totalAppointments);

    const options = {
      series: [{
        name: 'Appointments',
        data: totalAppointmentsData
      }],
      chart: {
        height: 350,
        type: 'bar',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: true
        }
      },
      colors: ['#60A5FA'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%',
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#1E40AF']
        }
      },
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Appointments',
          style: {
            color: '#60A5FA'
          }
        },
        labels: {
          style: {
            colors: '#60A5FA'
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return value + ' appointments';
          }
        }
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
      title="Monthly Appointments"
      className="shadow-md rounded-lg border border-gray-200"
    >
      <div ref={chartRef} />
      <div className="px-6 pb-4 text-sm text-gray-500">
        <p>Total appointments scheduled each month.</p>
      </div>
    </Card>
  );
};

export default AppointmentsChart;