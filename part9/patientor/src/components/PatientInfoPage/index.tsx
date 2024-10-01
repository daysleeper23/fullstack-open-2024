import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Diagnosis, Patient } from "../../types";
import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../constants';
import axios from 'axios';
import patientService from '../../services/patients';
// import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Entry } from '../../types';

const SectionTitle = ({ text }: { text : string } ) => {
  return (
    <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
      {text}
    </Typography>
  )
};

const SectionTitleMedium = ({ text }: { text : string } ) => {
  return (
    <Typography variant="h6" style={{ marginBottom: "0.5em" }}>
      {text}
    </Typography>
  )
};

const SectionContentText = ({ text }: { text : string | undefined } ) => {
  return (
    <Typography variant="subtitle1" color="textSecondary" style={{ marginBottom: "1em" }}>
      {text || ''}
    </Typography>
  )
};

const SectionContentEntry = ({ data, diag }: { data: Entry, diag: Array<Diagnosis> }) => {
  return (
    <Card style={{ marginBottom: "1em" }}>
      <CardContent>
        <SectionTitleMedium text="Type" />
        <SectionContentText text={data.type} />

        <SectionTitleMedium text="Date" />
        <SectionContentText text={data.date} />

        <SectionTitleMedium text="Description" />
        <SectionContentText text={data.description} />

        <SectionTitleMedium text="Diagnoses:" />
        <List disablePadding>
          {data.diagnosisCodes 
            ? data.diagnosisCodes.map(c => {
                const dName = diag.find(d => d.code === c)?.name || ''
                return (
                  <ListItem key={c} color="textSecondary">
                    <ListItemText primary={c + ' - ' + dName} />
                  </ListItem>
                )
              }) 
            : <></>
          }
        </List>
      </CardContent>
    </Card>
  )
}

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
        <Card variant='outlined'>
          <CardContent>
          <Typography variant="h4" style={{ marginBottom: "1.5em" }}>
            {patientInfo.name}
          </Typography>
          <SectionTitle text="Gender" />
          <Typography variant="body1" color="textSecondary" style={{ marginBottom: "1em" }}>
            {patientInfo.gender} {patientInfo.gender ? <MaleIcon /> : <FemaleIcon />}
          </Typography>

          <SectionTitle text="SSN" />
          <SectionContentText text={patientInfo.ssn} />

          <SectionTitle text="Date of birth" />
          <SectionContentText text={patientInfo.dateOfBirth} />

          <SectionTitle text="Occupation" />
          <SectionContentText text={patientInfo.occupation} />

          <div>
            <SectionTitle text="Entries:" />
            {patientInfo.entries ? patientInfo.entries.map(d => <SectionContentEntry key={d.id} data={d} diag={diag} />) : <></>}
          </div>
          </CardContent>
        </Card>
      )
    }
  }
}
export default PatientInfoPage;