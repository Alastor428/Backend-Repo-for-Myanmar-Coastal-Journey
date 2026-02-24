import { Router } from 'express';
import {
    createBeach,
    createRegion,
    getAllBeach,
    imageUploadController,
} from '../controllers/beachController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { upload } from '../lib/multer';

const beachRouter = Router();

beachRouter.post(
    '/regions',
    authenticateToken,
    createRegion
)

beachRouter.post(
    '/',
    authenticateToken,
    createBeach
)

beachRouter.get(
    '/',
    authenticateToken,
    getAllBeach
)

beachRouter.post(
    '/upload-image',
    authenticateToken,
    upload.array('image', 5), // req.files is array of `photos` files
    imageUploadController)


// BeachRouter.get(
//     '/beaches/:id',
// )

// BeachRouter.put(
//     '/beaches/update/:id',
// )

export default beachRouter;