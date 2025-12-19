
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 60000, //1 minute time window for request limiting
    limit: 60,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests, please try again later',
   

});

export default limiter