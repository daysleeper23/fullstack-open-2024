import express from 'express';
import { query, validationResult } from 'express-validator';
import bmiCalculator from './bmiCalculator';

const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get(
  '/bmi', [
    //height must be a number
    query('height').isNumeric().withMessage('Height must be a number'),
    //weight must be a number
    query('weight').isNumeric().withMessage('Weight must be a number'),
  ], (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "malformatted parameters" });
    }

    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (weight <= 0 || height <= 0) {
      return res.status(400).json({
        error: "malformatted parameters"
      });
    }

    console.log("h:", height, "w:", weight);

    const bmi = bmiCalculator(height, weight);

    return res.status(200).json({
      weight: weight,
      height: height,
      bmi: bmi
    });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});