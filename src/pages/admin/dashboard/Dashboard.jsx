import ReportsCardContainer from "../../../components/reportsCardContainer/ReportsCardContainer";
import React, { useEffect } from "react";
import PatientsTable from "../../../components/patiantsTable/patiantsTable";
import RevenueAndAverageChart from "../../../components/chart/RevenueAndAverageChart";
import AppointmentsChart from "../../../components/chart/AppointmentsChart";
import { usePaymentsStore } from "../../../store/admin/paymentsStore";

function Payments() {
  const { paymentStats, fetchPayments, loading } = usePaymentsStore();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // If paymentStats is an object, wrap it in an array for the charts
  const chartData = Array.isArray(paymentStats) ? paymentStats : [paymentStats];

  return (
    <div className="p-6">
      <div className=" flex flex-col gap-6 mb-6">
        <div className="container mx-auto p-4 grid gap-6 md:grid-cols-2">
          <RevenueAndAverageChart data={chartData} />
          <AppointmentsChart data={chartData} />
        </div>

        <ReportsCardContainer />
      </div>
      <PatientsTable />
    </div>
  );
}

export default Payments;
