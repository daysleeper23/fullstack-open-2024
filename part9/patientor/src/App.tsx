import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientInfo from "./components/PatientInfo";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
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
          <Route path="/patients/:id" element={<PatientInfo id={patientId} />}></Route>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
