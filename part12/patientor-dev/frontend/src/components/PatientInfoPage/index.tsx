import { Box, Button, Grid, Typography } from '@mui/material';
import { Diagnosis, EntryWithoutId, Patient } from "../../types";
import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../constants';
import axios from 'axios';
import patientService from '../../services/patients';

import CardEntryHospital from './CardEntryHospital';
import CardInfo from './CardInfo';
import CardEntryHealthCheck from './CardEntryHealthCheck';
import CardEntryOccupationalHealthcare from './CardEntryOccupationalHealthcare';
import AddEntryModal from '../AddEntryModal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('')

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatient = async () => {
      const patient = await patientService.getOne(id);
      setPatientInfo(patient);
    };

    if (!patientInfo) {
      fetchPatient();
    }
  }, []);

  const openModal = () => {
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
    setError('');
  }

  const submitNewEntry = async (object: EntryWithoutId) => {
    try {
      if (patientInfo) {
        const newEntry = await patientService.createEntry(object, patientInfo.id);
        const newPatient = patientInfo
        newPatient.entries = newPatient.entries.concat(newEntry);
        setModalOpen(false);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Missing or bad data!");
        }
      } else {
        console.log("Unknown error", e);
        setError("Unknown error");
      }
    }
  }

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
            <Grid container>
              <Grid item xs={10}>
                <SectionTitle text="Entries:" />
              </Grid>
              <Grid item xs={2}>
                <Button fullWidth variant="contained" onClick={() => openModal()}>
                  Add New Entry
                </Button>
              </Grid>
            </Grid>
            
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
          <AddEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
            diagData={diag}
          />
        </Box>
      )
    }
  }
}
export default PatientInfoPage;