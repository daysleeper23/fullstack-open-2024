import express from 'express';
import cors from 'cors';
// import path from 'path';

import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('./fe/dist'));

app.get('/api/ping', (_req, res) => {
  res.status(200).json({ message: 'pong'});
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

// app.get('*', (_req, res) => {
//   res.sendFile(path.join(__dirname, './fe/dist', 'index.html'));
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});