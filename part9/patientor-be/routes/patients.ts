import express from 'express';
import patientsService from '../services/patients';
import { toNewPatient } from '../utils';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json(patientsService.getNonSensitivePatientInfo());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const savedPatient = patientsService.addPatient(newPatient);
    res.status(200).json(savedPatient);
  } 
  catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
    // let errorMessage = 'Something went wrong.';
    // if (error instanceof Error) {
    //   errorMessage += ' Error: ' + error.message;
    // }
    // res.status(400).send(errorMessage);
  }
});

export default router;