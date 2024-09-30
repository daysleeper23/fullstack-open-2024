import { v1 as uuid } from 'uuid';
import patientsData from '../data/patients';
import { Patient, NonSensitivePatientInfo, NewPatient } from '../types';

const patients: Patient[] = patientsData as Patient[];

const getPatients = (): Patient[] => {
  return patients;
};

const findById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id)
}

const getNonSensitivePatientInfo = (): NonSensitivePatientInfo[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const addPatient = (patient: NewPatient): NonSensitivePatientInfo => {
  const id = uuid();
  const newPatient: Patient = {
    id,
    ...patient
  };
  patientsData.concat(newPatient);

  const { ssn, ...returnPatient } = newPatient;
  return returnPatient;
};

export default {
  getPatients,
  findById,
  getNonSensitivePatientInfo,
  addPatient
};