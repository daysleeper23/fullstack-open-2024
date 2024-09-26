import express from 'express'
import patientsService from '../services/patients'
import { toNewPatient } from '../utils'

const router = express.Router()

router.get('/', (_req, res) => {
  res.status(200).json(patientsService.getNonSensitivePatientInfo())
})

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body)
    const savedPatient = patientsService.addPatient(newPatient);
    res.status(200).json(savedPatient)
  } 
  catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})

export default router;