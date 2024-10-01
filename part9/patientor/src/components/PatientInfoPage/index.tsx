import { Box, Typography } from '@mui/material';
import { Diagnosis, Patient } from "../../types";
import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../constants';
import axios from 'axios';
import patientService from '../../services/patients';

import CardEntryHospital from './CardEntryHospital';
import CardInfo from './CardInfo';
import CardEntryHealthCheck from './CardEntryHealthCheck';
import CardEntryOccupationalHealthcare from './CardEntryOccupationalHealthcare';

const SectionTitle = ({ text }: { text : string } ) => {
  return (
    <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
      {text}
    </Typography>
  )
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const PatientInfoPage = ({ id, diag }: { id : string, diag: Array<Diagnosis> }) => {
  const [patientInfo, setPatientInfo] = useState<Patient>()

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatient = async () => {
      const patient = await patientService.getOne(id);
      setPatientInfo(patient);
    };
    void fetchPatient();
  }, []);

  if (id === 'empty') {
    return (
      <div>
        <h2>Patient does not exists...</h2>
      </div>
    )
  } else {
    if (!patientInfo) {
      <div>
        <h2>Retrieving patient...</h2>
      </div>
    }
    else {
      return (
        <Box>
          <Typography variant="h4" style={{ marginTop: "1em", marginBottom: "1em" }}>
            {patientInfo.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: '1em', flexDirection: 'row', alignItems: "center", marginBottom: "1em" }}>
            <CardInfo title='Gender' content={patientInfo.gender || ''} />
            <CardInfo title='SSN' content={patientInfo.ssn || ''} />
            <CardInfo title='Date of birth' content={patientInfo.dateOfBirth || ''} />
            <CardInfo title='Occupation' content={patientInfo.occupation || ''} />
          </Box>

          <div>
            <SectionTitle text="Entries:" />
            {patientInfo.entries 
              ? patientInfo.entries.map(d => {
                  switch (d.type) {
                    case 'Hospital':
                      return <CardEntryHospital key={d.id} data={d} diag={diag} />;
                    case 'HealthCheck':
                      return <CardEntryHealthCheck key={d.id} data={d} diag={diag} />;
                    case 'OccupationalHealthcare':
                      return <CardEntryOccupationalHealthcare key={d.id} data={d} diag={diag} />;
                    default:
                      assertNever(d); 
                      break;
                  }
                })
              : <></>
            }
          </div>
        </Box>
      )
    }
  }
}
export default PatientInfoPage;