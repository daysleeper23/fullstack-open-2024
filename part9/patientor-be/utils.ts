import { Gender, NewPatient } from "./types";

export const toNewPatient = (object: unknown): NewPatient => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'ssn' in object && 'occupation' in object) {
    const newPatient: NewPatient = {
      name:  parseText(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      ssn: parseSSN(object.ssn),
      occupation: parseText(object.occupation)
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
}

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isSSN = (text: string): boolean => {
  const ssnPattern = /^\d{6}-\d{2,3}[A-Z0-9]/;
  return Boolean(ssnPattern.test(text));
}

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(gender);
}

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseText = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error('Incorrect or missing text: ' + text)
  }
  return text;
}

const parseSSN = (text: unknown): string => {
  if (!text || !isString(text) || !isSSN(text)) {
    throw new Error('Incorrect or missing SSN: ' + text)
  }
  return text;
}

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
}

