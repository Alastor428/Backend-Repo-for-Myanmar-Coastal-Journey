import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
// import compression from 'compression';
import http from 'http';
import connectdb from './database/connectdb';
import authRouter from './routes/authRoute';
import beachRouter from './routes/beachRoute';
import restaurantRouter from './routes/restaurantRoute';
import foodRouter from './routes/foodRoute';
import * as path from 'path';
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
app.use('/api/v1/beaches', beachRouter); //region, beachCRUD endpoints
app.use('/api/v1/restaurants', restaurantRouter); //restaurant CRUD endpoints
app.use('/api/v1/foods',foodRouter);


//serve static files from uploads and assets dir
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running successfully!')
  
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}
);