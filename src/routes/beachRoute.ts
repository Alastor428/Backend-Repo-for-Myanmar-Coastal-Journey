import { Router } from 'express';
import {
  createBeach,
  createRegion,
  getAllBeach,
  getBeachById,
  updateRegion,
  updateBeach,
  deleteRegion,
  deleteBeach,
  imageUploadController,
} from '../controllers/beachController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { upload } from '../lib/multer';
import { validate } from '../middlewares/validateMiddleware';
import {
  createRegionSchema,
  createBeachSchema,
  updateRegionSchema,
  updateBeachSchema,
  listBeachesQuerySchema,
  getBeachByIdParamsSchema,
  getRegionByIdParamsSchema,
} from '../validations/beachSchema';

const beachRouter = Router();

beachRouter.post('/regions', authenticateToken, validate(createRegionSchema, 'body'), createRegion);
beachRouter.put('/regions/:id', authenticateToken, validate(getRegionByIdParamsSchema, 'params'), validate(updateRegionSchema, 'body'), updateRegion);
beachRouter.delete('/regions/:id', authenticateToken, validate(getRegionByIdParamsSchema, 'params'), deleteRegion);

beachRouter.post(
  '/upload-image',
  authenticateToken,
  upload.array('image', 5),
  imageUploadController
);

beachRouter.post('/', authenticateToken, validate(createBeachSchema, 'body'), createBeach);
beachRouter.get('/', authenticateToken, validate(listBeachesQuerySchema, 'query'), getAllBeach);
beachRouter.get('/:id', authenticateToken, validate(getBeachByIdParamsSchema, 'params'), getBeachById);
beachRouter.put('/:id', authenticateToken, validate(getBeachByIdParamsSchema, 'params'), validate(updateBeachSchema, 'body'), updateBeach);
beachRouter.delete('/:id', authenticateToken, validate(getBeachByIdParamsSchema, 'params'), deleteBeach);

export default beachRouter;
