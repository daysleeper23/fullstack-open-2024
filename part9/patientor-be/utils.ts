import { EntryType, Gender, HealthCheckRating, NewPatient } from "./types";
import z, { string } from 'zod';

export const EntrySchema = z.object({
  id: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  type: z.nativeEnum(EntryType),
  healthCheckRating: z.nativeEnum(HealthCheckRating).optional()
})

export const NewEntryHealthCheckSchema = z.object({
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  type: z.nativeEnum(EntryType),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
  diagnosisCodes: z.array(string()).optional()
})

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  ssn: z.string().regex(new RegExp(/^\d{6}-\d{2,3}[A-Z0-9]/), 'Wrong SSN format.'),
  occupation: z.string()
});

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

