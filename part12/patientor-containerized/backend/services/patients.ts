import { v1 as uuid } from 'uuid';
import patientsData from '../data/patients';
import { Patient, NonSensitivePatientInfo, NewPatient, EntryWithoutId, Entry } from '../types';

const patients: Patient[] = patientsData;

const getPatients = (): Patient[] => {
  return patients;
};

const findById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const getNonSensitivePatientInfo = (): NonSensitivePatientInfo[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const addPatient = (patient: NewPatient): NonSensitivePatientInfo => {
  const id = uuid();
  const newPatient: Patient = {
    id,
    ...patient,
    entries: []
  };
  patients.concat(newPatient);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn, ...returnPatient } = newPatient;
  return returnPatient;
};

const addNewEntryToPatient = (entry: EntryWithoutId, id: string): Entry | null => {
  const entryId = uuid();
  const newEntry: Entry = {
    id: entryId,
    ...entry
  };

  try {
    const patient = findById(id);

    if (!patient) {
      return null;
    }

    patient?.entries.push(newEntry);
    return newEntry;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export default {
  getPatients,
  findById,
  getNonSensitivePatientInfo,
  addPatient,
  addNewEntryToPatient
};