import express from 'express'
import patientsService from '../services/patients'

const router = express.Router()

router.get('/', (_req, res) => {
  res.status(200).json(patientsService.getNonSensitivePatientInfo())
})

router.post('/', (req, res) => {
  const { name, ssn, dateOfBirth, gender, occupation } = req.body
  const savedPatient = patientsService.addPatient({
    name,
    ssn,
    dateOfBirth,
    gender,
    occupation
  });
  res.status(200).json(savedPatient)
})

export default router;