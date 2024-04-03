import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { SUPER_ADMIN_EMAIL } from '../configs';
import { createSchool, deleteSchool, findSchoolById, findSchools, updateSchool } from '../services/school';
import { School } from '@prisma/client';
const router: Router = Router();

/**
 * GET /school/:id
 * @summary get a school
 * @Auth Super Admin Only
 * @param {string} id the id fo the school
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 *  {
 *    "id": 1,
 *    "name": "lorem ipsum",
 *    "email": "school@email.com",
 *    "address": "lorem ipsum",
 *    "phone": "lorem ipsum",
 *    "website": "www.loremipsum.com",
 *    "logo": "https://loremipsum.com/logo.png",
 *    "description": "lorem ipsum",
 *    "createdAt": "2021-05-05T12:00:00.000Z",
 *    "updatedAt": "2021-05-05T12:00:00.000Z"
 * }
 *
 **/
router.get('/school/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.sendStatus(401);
      throw new Error('Unauthorized');
    }
    const id = req.params.id;
    const school = await findSchoolById(+id);
    res.json(school);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /school
 * @summary get all schools
 * @Auth Super Admin Only
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 * {
 *  "schools": [
 *   {
 *   "id": 1,
 *   "name": "lorem ipsum",
 *   "email": "
 *   "address": "lorem ipsum",
 *   "phone": "lorem ipsum",
 *   "website": "www.loremipsum.com",
 *   "logo": "https://loremipsum.com/logo.png",
 *   "description": "lorem ipsum",
 *   "createdAt": "2021-05-05T12:00:00.000Z",
 *   "updatedAt": "2021-05-05T12:00:00.000Z"
 **/

router.get('/schools', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.sendStatus(401);
      throw new Error('Unauthorized');
    }
    const schools = await findSchools();
    res.json(schools);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /school
 * @summary create a school
 * @Auth Super Admin Only
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 * {
 *  "id": 1,
 *  "name": "lorem ipsum",
 *  "email": "
 *  "address": "lorem ipsum",
 *  "phone": "lorem ipsum",
 *  "website": "www.loremipsum.com",
 *  "logo": "https://loremipsum.com/logo.png",
 *  "description": "lorem ipsum",
 *  "createdAt": "2021-05-05T12:00:00.000Z",
 *  "updatedAt": "2021-05-05T12:00:00.000Z"
 * }
 **/
router.post('/school', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.sendStatus(401);
      throw new Error('Unauthorized');
    }
    const { name, email, address, phone, website, logo, description } = req.body;
    const schoolData = {
      name,
      email,
      address,
      phone,
      website,
      logo,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as School;
    const school = await createSchool(schoolData);
    res.json(school);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /school/:id
 * @summary update a school
 * @Auth Super Admin Only
 * @param {string} id the id fo the school
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 * {
 *   "id": 1,
 *   "name": "lorem ipsum",
 *   "email": "
 *   "address": "lorem ipsum",
 *   "phone": "lorem ipsum",
 *   "website": "www.loremipsum.com",
 *   "logo": "https://loremipsum.com/logo.png",
 *   "description": "lorem ipsum",
 *   "createdAt": "2021-05-05T12:00:00.000Z",
 *   "updatedAt": "2021-05-05T12:00:00.000Z"
 * }
 **/
router.put('/school/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.sendStatus(401);
      throw new Error('Unauthorized');
    }
    const id = req.params.id;
    const { name, email, address, phone, website, logo, description } = req.body;
    const schoolData = {
      name,
      email,
      address,
      phone,
      website,
      logo,
      description,
    } as School;
    const school = await updateSchool(+id, schoolData);
    res.json(school);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /school/:id
 * @summary delete a school
 * @Auth Super Admin Only
 * @param {string} id the id fo the school
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 * {
 *  "message": "School deleted"
 * }
 * @example response - 401 - Unauthorized response example
 * {
 * "message": "Unauthorized"
 * }
 **/
router.delete('/school/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.sendStatus(401);
      throw new Error('Unauthorized');
    }
    const id = req.params.id;
    const delSchool = await deleteSchool(+id);
    res.json(delSchool);
  } catch (error) {
    next(error);
  }
});

export default router;
