import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import * as path from 'path';
// import compression from 'compression';
import http from 'http';
import connectdb from './database/connectdb';
import authRouter from './routes/authRoute';
import beachRouter from './routes/beachRoute';
import restaurantRouter from './routes/restaurantRoute';
import foodRouter from './routes/foodRoute';
import cityRouter from './routes/cityRoute';
import routesRouter from './routes/routesRoute';
import busRouter from './routes/busRoute';
import ticketRouter from './routes/ticketRoute';
import busSeatShowRouter from './routes/busSeatShowRoute';
import hotelRouter from './routes/hotelRoute';
import roomRouter from './routes/roomRoute';
import hotelBookingRouter from './routes/hotelBookingRoute';
import travelPackageRouter from './routes/travelPackageRoute';
import travelPackageBookingRouter from './routes/travelPackageBookingRoute';
import tourGuideRouter from './routes/tourGuideRoute';
import tourGuideBookingRouter from './routes/tourGuideBookingRoute';

dotenv.config();


const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(helmet());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/beaches', beachRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/foods', foodRouter);
app.use('/api/v1/cities', cityRouter);
app.use('/api/v1/buses', busRouter);
app.use('/api/v1/routes', routesRouter);
app.use('/api/v1/tickets', ticketRouter);
app.use('/api/v1/bus-seats', busSeatShowRouter);
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/hotel-bookings', hotelBookingRouter);
app.use('/api/v1/travel-packages', travelPackageRouter);
app.use('/api/v1/travel-package-bookings', travelPackageBookingRouter);
app.use('/api/v1/tour-guides', tourGuideRouter);
app.use('/api/v1/tour-guide-bookings', tourGuideBookingRouter);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running successfully!');
});

const startServer = async () => {
  await connectdb();
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();