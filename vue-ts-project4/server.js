// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/sort', (req, res) => {
  let numbers = req.body.numbers;
  if (!Array.isArray(numbers)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  numbers = numbers.map(Number).sort((a, b) => a - b);
  res.json({ sortedNumbers: numbers });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});