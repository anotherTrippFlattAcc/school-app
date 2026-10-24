import express from 'express';
import studentsRouter from './routes/students';
import teachersRouter from './routes/teachers';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/teachers', teachersRouter);
app.use('/api/students', studentsRouter);

app.listen(PORT, () => {
  console.log(`API запущен: http://localhost:${PORT}`);
});