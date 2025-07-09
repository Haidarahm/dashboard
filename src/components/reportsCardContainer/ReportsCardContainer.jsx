// src/components/ReportsCardAntd.jsx
import React, { useState } from 'react';
import { Card, Pagination, Typography } from 'antd';

const { Text, Title } = Typography;

const reports = [
  { id: 1, patient_first_name: 'Naya', patient_last_name: 'Salha', type: 'Privacy violation', description: 'bla bla bla' },
  { id: 2, patient_first_name: 'Naya', patient_last_name: 'Salha', type: 'Privacy violation', description: 'bla bla bla' },
  { id: 3, patient_first_name: 'Naya', patient_last_name: 'Salha', type: 'Privacy violation', description: 'bla bla bla' },
  { id: 4, patient_first_name: 'Naya', patient_last_name: 'Salha', type: 'Privacy violation', description: 'bla bla bla' },
  { id: 5, patient_first_name: 'Naya', patient_last_name: 'Salha', type: 'Privacy violation', description: 'bla bla bla' },
  { id: 6, patient_first_name: 'Lina', patient_last_name: 'Karam', type: 'Data leak', description: 'unauthorized access' },
  { id: 7, patient_first_name: 'Omar', patient_last_name: 'Saad', type: 'Harassment', description: 'patient complaint' },
  { id: 8, patient_first_name: 'Fadi', patient_last_name: 'Haddad', type: 'Privacy violation', description: 'shared records' },
  { id: 9, patient_first_name: 'Sara', patient_last_name: 'Nasser', type: 'Negligence', description: 'missed medication' },
  { id: 10, patient_first_name: 'Tala', patient_last_name: 'Jaber', type: 'Unprofessional behavior', description: 'rude language' },
];

const ReportsCardContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIdx = (currentPage - 1) * pageSize;
  const currentReports = reports.slice(startIdx, startIdx + pageSize);

  return (
    <Card
      title="Reports"
      className='bg-white flex-1 text-gray-800 rounded-xl w-2/3 shadow border border-gray-200'
      bordered
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ overflowY: 'auto', maxHeight: 240, paddingRight: 4 }}>
        {currentReports.map((report) => (
          <Card
            key={report.id}
            size="small"
            style={{ marginBottom: 10 }}
            type="inner"
            title={<Text strong>{report.type}</Text>}
          >
            <Text type="secondary">
              Patient: {report.patient_first_name} {report.patient_last_name}
            </Text>
            <br />
            <Text>{report.description}</Text>
          </Card>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Pagination
          size="small"
          current={currentPage}
          total={reports.length}
          pageSize={pageSize}
          onChange={setCurrentPage}
        />
      </div>
    </Card>
  );
};

export default ReportsCardContainer;
