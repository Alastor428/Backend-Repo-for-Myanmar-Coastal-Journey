import { Router } from 'express';

const BeachRouter = Router();

BeachRouter.post(
    '/beaches',
)

BeachRouter.get(
    '/beaches/:id',
)

BeachRouter.put(
    '/beaches/update/:id',
)