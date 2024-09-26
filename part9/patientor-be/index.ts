import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())


const PORT = process.env.PORT || 3001;

app.get('/api/ping', (_req, res) => {
  res.status(200).json({ message: 'pong'})
})

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});