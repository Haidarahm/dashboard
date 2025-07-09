import ReportsCardContainer from "../../components/reportsCardContainer/ReportsCardContainer";
import PaymentChart from "../../components/paymentChart/PaymentChart";
import React from "react";
import PatientsTable from "../../components/patiantsTable/patiantsTable";

function Payments() {
  return (
    <div className="p-6">
    
    <div className=" flex gap-6 mb-6">
      <PaymentChart />
      <ReportsCardContainer/>
    </div>
    <PatientsTable/>
    </div>
    
  );
}

export default Payments;
