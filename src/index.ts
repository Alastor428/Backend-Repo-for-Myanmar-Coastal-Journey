import dotenv from 'dotenv';
import cors from 'cors';
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  // res.json(
  //   {
  //     message: 'API is running successfully!',
  //   }
  res.send('API is running successfully!')
  
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);