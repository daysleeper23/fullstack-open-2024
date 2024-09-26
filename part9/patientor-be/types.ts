export interface Diagnose {
  code: string,
  name: string,
  latin?: string
}

export type Gender = 'male' | 'female'

export interface Patient {
// "id": "d2773336-f723-11e9-8f0b-362b9e155667",
// "name": "John McClane",
// "dateOfBirth": "1986-07-09",
// "ssn": "090786-122X",
// "gender": "male",
// "occupation": "New york city cop"

  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string
}

export type NewPatient = Omit<Patient, 'id'>;

export type NonSensitivePatientInfo = Omit<Patient, 'ssn'>;