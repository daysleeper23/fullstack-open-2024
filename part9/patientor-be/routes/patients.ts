import express, { NextFunction, Request, Response } from 'express';
import patientsService from '../services/patients';
import { NewPatientSchema } from '../utils';
import z from 'zod';
import { NewPatient, NonSensitivePatientInfo } from '../types';

const router = express.Router();

/***************************
 * MIDDLEWARES
***************************/

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body)
    next;
  }
  catch (error: unknown) {
    next(error);
  }
}

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({
      error: error.issues
    })
  }
  else {
    next(error);
  }
}

/***************************
 * ENDPOINTS
***************************/

router.get('/:id', (req, res) => {
  // console.log('find by id: ', req.params.id)
  try {
    const patient = patientsService.findById(req.params.id)
    
    if (patient) {
      // console.log('found patient:', patient)
      res.status(200).json(patient);
    } else {
      // console.log('patient not found')
      res.status(404).json({ error: 'could not find patient'});
    }
  }
  catch (error) {
    res.status(400).json({ error: 'error during finding patient'});
  }
});

router.get('/', (_req, res) => {
  res.status(200).json(patientsService.getNonSensitivePatientInfo());
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<NonSensitivePatientInfo>) => {
    const savedPatient = patientsService.addPatient(req.body);
    res.status(200).json(savedPatient);
});

router.use(errorMiddleware)

export default router;