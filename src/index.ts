import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
// import compression from 'compression';
import http from 'http';
import connectdb from './database/connectdb';
import authRouter from './routes/authRoute';
import coastalRouter from './routes/coastalRoute';
dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

connectdb(); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
// app.use(compression());
app.use(helmet()); // enhance security by setting various HTTP headers

// Routes
app.use('/api/v1/auth', authRouter); //auth and user CRUD endpoints
app.use('/api/v1/coastal', coastalRouter); //region, beach, restaurant, food CRUD endpoints

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running successfully!')
  
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}
);