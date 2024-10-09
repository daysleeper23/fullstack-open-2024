export interface Diagnosis {
  code: string,
  name: string,
  latin?: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
};

export enum EntryType {
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare',
  HealthCheck = 'HealthCheck'
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

export interface EntryBase {
  // id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  // date: '2015-01-02',
  // type: 'Hospital',
  // specialist: 'MD House',
  // diagnosisCodes: ['S62.5'],
  // description:
  //   "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
  // discharge: {
  //   date: '2015-01-16',
  //   criteria: 'Thumb has healed.',
  // },

  // id: 'fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62',
  // date: '2019-08-05',
  // type: 'OccupationalHealthcare',
  // specialist: 'MD House',
  // employerName: 'HyPD',
  // diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2'],
  // description:
  //   'Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ',
  // sickLeave: {
  //   startDate: '2019-08-05',
  //   endDate: '2019-08-28',

  // id: 'b4f4eca1-2aa7-4b13-9a18-4a5535c3c8da',
  // date: '2019-10-20',
  // specialist: 'MD House',
  // type: 'HealthCheck',
  // description: 'Yearly control visit. Cholesterol levels back to normal.',
  // healthCheckRating: 0,
  id: string,
  date: string,
  specialist: string,
  description: string,
  diagnosisCodes?: Array<Diagnosis['code']>
}

export interface EntryHealthCheck extends EntryBase {
  type: 'HealthCheck',
  healthCheckRating: HealthCheckRating
}

export interface EntryHospital extends EntryBase {
  type: 'Hospital',
  discharge: {
    date: string,
    criteria: string
  }
}

export interface EntryOccupationalHealthcare extends EntryBase {
  type: 'OccupationalHealthcare',
  employerName: string,
  sickLeave?: {
    startDate: string,
    endDate: string
  }
}



export type Entry =
  | EntryHospital
  | EntryOccupationalHealthcare
  | EntryHealthCheck;

  // Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, 'id'>;
export type EntryHealthCheckWithoutId = Omit<EntryHealthCheck, 'id'>;

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
  occupation: string,
  entries: Entry[]
}

export type NewPatient = Omit<Patient, 'id' | 'entries'>;

export type NonSensitivePatientInfo = Omit<Patient, 'ssn' | 'entries'>;