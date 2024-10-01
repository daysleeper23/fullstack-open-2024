import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Diagnosis, Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientInfoPage from "./components/PatientInfoPage";

import diagnosesService from "./services/diagnoses";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const results = await patientService.getAll();
      setPatients(results);
    };

    const fetchDiagnoses = async () => {
      const results = await diagnosesService.getAll();
      setDiagnoses(results);
    }
    void fetchPatientList();
    void fetchDiagnoses();
  }, []);

  const match = useMatch('/patients/:id')
  const patientId = match 
    ? match.params.id || 'empty'
    : 'empty'
  
  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary" style={{ marginBottom: "1em" }}>
          Home
        </Button>
        <Divider hidden /> 
        <Routes>
          <Route path="/patients/:id" element={<PatientInfoPage id={patientId} diag={diagnoses} />}></Route>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
