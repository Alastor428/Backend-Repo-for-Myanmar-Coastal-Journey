import { Router } from 'express';
import { createCity, getAllCity, getCityById, updateCity, deleteCity } from '../controllers/cityController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { createCitySchema, updateCitySchema, listCitiesQuerySchema, getCityByIdParamsSchema } from '../validations/citySchema';

const cityRouter = Router();

cityRouter.post('/', authenticateToken, validate(createCitySchema, 'body'), createCity);
cityRouter.get('/', authenticateToken, validate(listCitiesQuerySchema, 'query'), getAllCity);
cityRouter.get('/:id', authenticateToken, validate(getCityByIdParamsSchema, 'params'), getCityById);
cityRouter.put('/:id', authenticateToken, validate(getCityByIdParamsSchema, 'params'), validate(updateCitySchema, 'body'), updateCity);
cityRouter.delete('/:id', authenticateToken, validate(getCityByIdParamsSchema, 'params'), deleteCity);

export default cityRouter;
