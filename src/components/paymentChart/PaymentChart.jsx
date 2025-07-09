// src/components/MonthlyTargetCard.jsx
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SummaryBox = ({ label, value ,dollar}) => (
  <div className="text-center">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-lg font-semibold">{dollar?'':'$'}{value}</div>
  </div>
);

export default function PaymentChart() {
  const data = {
    totalRevenue: 151.5,
    totalAppointments: 3,
    averagePayment: 50.5,
  };

  // Calculate percentage (optional logic for progress bar)
  const percentage = Math.min((data.averagePayment / data.totalRevenue) * 100, 100);

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl w-1/3 max-w-md shadow border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-blue-600">Payments Details</h2>
      </div>

      <div className="w-40 mx-auto mb-6">
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({
            pathColor: '#007bff',
            trailColor: '#e5e7eb',
          })}
        >
          <div className="text-2xl font-bold text-gray-800">
            {percentage.toFixed(1)}%
          </div>
        </CircularProgressbarWithChildren>
      </div>

      <div className="border-t border-gray-200 pt-4 flex justify-around text-sm">
        <SummaryBox label="Revenue" value={data.totalRevenue.toFixed(2)} />
        <SummaryBox label="Appointments" value={data.totalAppointments} dollar={true}/>
        <SummaryBox label="Avg. Payment" value={data.averagePayment.toFixed(2)} />
      </div>
    </div>
  );
}
