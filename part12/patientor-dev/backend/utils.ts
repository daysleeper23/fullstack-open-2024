import { EntryType, Gender, HealthCheckRating, NewPatient } from "./types";
import z, { string } from 'zod';

export const NewEntrySchema = z.object({
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  type: z.nativeEnum(EntryType),
  diagnosisCodes: z.array(string()).optional()
});

export const NewEntryHospitalSchema = z.object({
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  type: z.literal('Hospital'),
  diagnosisCodes: z.array(string()).optional(),
  discharge: z.object({ date: z.string().date(), criteria: z.string() })
});

export const NewEntryOccupationalSchema = z.object({
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  type: z.literal('OccupationalHealthcare'),
  diagnosisCodes: z.array(string()).optional(),
  employerName: z.string(),
  sickLeave: z.object({ startDate: z.string(), endDate: z.string() }).optional()
});

export const NewEntryHealthCheckSchema = z.object({
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
  diagnosisCodes: z.array(string()).optional()
});

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

