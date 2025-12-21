import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import corsOptions from './auth/corsOptions';
import helmet from 'helmet';
import limiter from './lib/expressRateLimit';
dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors(corsOptions)); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // enhance security by setting various HTTP headers
app.use(limiter); // apply rate limiting middleware

app.get('/', (_req: Request, res: Response) => {
  // res.json(
  //   {
  //     message: 'API is running successfully!',
  //   }
  res.send('API is running successfully!')
  
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}
);