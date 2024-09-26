import { Gender, NewPatient } from "./types";
import z from 'zod';

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  ssn: z.string().regex(new RegExp(/^\d{6}-\d{2,3}[A-Z0-9]/), 'Wrong SSN format.'),
  occupation: z.string()
});

export const toNewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
  // if ( !object || typeof object !== 'object' ) {
  //   throw new Error('Incorrect or missing data');
  // }

  // if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'ssn' in object && 'occupation' in object) {
  //   const newPatient: NewPatient = {
  //     name:  z.string().parse(object.name),
  //     dateOfBirth: z.string().date().parse(object.dateOfBirth),
  //     gender: z.nativeEnum(Gender).parse(object.gender),
  //     ssn: parseSSN(object.ssn),
  //     occupation: z.string().parse(object.occupation)
  //   };

  //   return newPatient;
  // }

  // throw new Error('Incorrect data: some fields are missing');
};

// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const isDate = (date: string): boolean => {
//   return Boolean(Date.parse(date));
// };

// const isSSN = (text: string): boolean => {
//   const ssnPattern = /^\d{6}-\d{2,3}[A-Z0-9]/;
//   return Boolean(ssnPattern.test(text));
// }

// const isGender = (gender: string): gender is Gender => {
//   return Object.values(Gender).map(v => v.toString()).includes(gender);
// }

// const parseDate = (date: unknown): string => {
//   if (!date || !isString(date) || !isDate(date)) {
//     throw new Error('Incorrect or missing date: ' + date);
//   }
//   return date;
// };

// const parseText = (text: unknown): string => {
//   if (!text || !isString(text)) {
//     throw new Error('Incorrect or missing text: ' + text)
//   }
//   return text;
// }

// const parseSSN = (text: unknown): string => {
//   if (!text || !isString(text) || !isSSN(text)) {
//     throw new Error('Incorrect or missing SSN: ' + text)
//   }
//   return text;
// }

// const parseGender = (gender: unknown): Gender => {
//   if (!gender || !isString(gender) || !isGender(gender)) {
//     throw new Error('Incorrect or missing gender: ' + gender);
//   }
//   return gender;
// }

