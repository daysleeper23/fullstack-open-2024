import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { body, query, validationResult } from 'express-validator';
import bmiCalculator from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';

const app = express();
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

/**********************************************
 * 
 * MIDDLEWARE: Check if body is a valid JSON
 * 
**********************************************/

app.use((err: { status: number; }, _req: express.Request, res: express.Response, next: express.NextFunction) => {

  if(err.status === 400)
    return res.status(err.status).json({ error: 'malformatted parameters' });

  return next(err);
});

/**********************************************
 *  
 * FUNCTION: Handling validation errors with express-validators
 * 
**********************************************/

const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};


/**********************************************
 * 
 * BMI CALCULATOR
 * 
**********************************************/

app.get(
  '/bmi', [
    //height must be a number
    query('height').isNumeric().withMessage('Height must be a number'),
    //weight must be a number
    query('weight').isNumeric().withMessage('Weight must be a number'),
    handleValidationErrors
  ], (req: express.Request, res: express.Response) => {

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


/**********************************************
 * 
 * EXERCISES CALCULATOR
 * 
**********************************************/

app.post(
  '/exercises', [
    body('daily_exercises')
      .isArray({ min: 1 }).withMessage('daily_exercises must be an array')
      .custom((value) => {
        // Ensure every element in the array is a number
        if (!value.every((el: any) => typeof el === 'number')) {
          throw new Error('daily_exercises must contain only numbers');
        }
        return true;
      }),
    body('target').isNumeric().withMessage('target must be a number'),
    handleValidationErrors
  ],
  (req: express.Request, res: express.Response) => {
    const exercises = req.body.daily_exercises
    const target = req.body.target
    const result = exerciseCalculator(exercises, target)
    return res.status(200).json(result)
  }
);


/**********************************************
 * 
 * EXPRESS APP START-UP
 * 
**********************************************/
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});