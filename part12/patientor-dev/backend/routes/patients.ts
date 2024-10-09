import express, { NextFunction, Request, Response } from 'express';
import patientsService from '../services/patients';
import { NewEntryHealthCheckSchema, NewEntryHospitalSchema, NewEntryOccupationalSchema, NewEntrySchema, NewPatientSchema } from '../utils';
import z from 'zod';
import { Entry, EntryHealthCheckWithoutId, NewPatient, NonSensitivePatientInfo } from '../types';

const router = express.Router();

/***************************
 * QUERY DATA ENDPOINTS
***************************/

router.get('/:id', (req, res) => {
  // console.log('find by id: ', req.params.id)
  try {
    const patient = patientsService.findById(req.params.id);
    
    if (patient) {
      // console.log('found patient:', patient)
      res.status(200).json(patient);
    } else {
      // console.log('patient not found')
      res.status(404).json({ error: 'could not find patient'});
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
    res.status(400).json({ error: 'error during finding patient'});
  }
});

router.get('/', (_req, res) => {
  res.status(200).json(patientsService.getNonSensitivePatientInfo());
});

/***************************
 * DATA VALIDATION MIDDLEWARES
***************************/
// const assertNever = (value: never): never => {
//   throw new Error(
//     `Unhandled discriminated union member: ${JSON.stringify(value)}`
//   );
// };

interface NewEntryRequestBody {
  type: 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'; 
}

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  console.log('parse entry');
  try {
    const body = req.body as NewEntryRequestBody;
    NewEntrySchema.parse(body);

    switch (body.type as string) {
      case 'HealthCheck':
        NewEntryHealthCheckSchema.parse(body);
        break;
      case 'Hospital':
        NewEntryHospitalSchema.parse(body);
        break;
      case 'OccupationalHealthcare':
        NewEntryOccupationalSchema.parse(body);
        break;
    }
    console.log('parse ok', body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  console.log('parse patient');
  try {
    NewPatientSchema.parse(req.body);
    next();
  }
  catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    console.log('zod error');
    res.status(400).send({
      error: error.issues
    });
  }
  else if (error instanceof SyntaxError) {
    console.log('syntax error');
    res.status(400).send({
      error: error.message
    });
  }
  else {
    console.log('something else is creating error');
    next(error);
  }
};

/***************************
 * CREATE DATA ENDPOINTS
***************************/

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, unknown, EntryHealthCheckWithoutId>, res: Response<Entry | { message: unknown }>) => {
  try {
    console.log('new entry --- start');
    const patient = patientsService.findById(req.params.id);
    console.log('new entry --- patient:', patient);

    if (!patient) {
      res.status(404).json({ message: 'could not find patient' });
    } else {
      const newEntry = patientsService.addNewEntryToPatient(req.body, patient.id);
      

      if (newEntry) {
        console.log('new entry --- can create new entry:', newEntry);
        res.status(200).json(newEntry);
      } else {
        res.status(400).json({ message: 'error while adding entry' });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<NonSensitivePatientInfo | { message: unknown }>) => {
  try {
    console.log('create patient start');
    const savedPatient = patientsService.addPatient(req.body);
    res.status(200).json(savedPatient);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(400).json({ message: 'bad request' });
  }
});

router.use(errorMiddleware);

export default router;