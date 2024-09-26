import express from 'express';
import diagnosesService from '../services/diagnoses';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json(diagnosesService.getDiagnoses());
});

router.post('/', (_req, res) => {
  res.status(200).json({
    message: 'Saving a diagnose!'
  });
});

export default router;