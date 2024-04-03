import { Class, RoleEnumType } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { createClass, findAllClassBySchoolId, findClassById, updateClass } from '../services/class';
const router: Router = Router();

/**
 * @role admin 
 * @summary get a class by id 
 * @route GET /class/:id
 * @auth required
 * @param {number} id the id fo the class
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 *{
	"id": 1,
	"name": "Class 1",
	"description": "Descriptiopn 1",
	"schoolId": 2
 *}
 */

router.get('/class/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;

    // check role:
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('User Unauthorized');
    }

    const classData = await findClassById(+id);
    // check class
    if (!classData) {
      res.status(400);
      throw new Error('Bad request');
    }

    // check school
    if (payload.schoolId !== classData.schoolId) {
      res.status(401);
      throw new Error('User Unauthorized(class exist in other school ...)');
    }

    res.json(classData);
  } catch (error) {
    next(error);
  }
});

/**
 * @summary get all classes of 1 school
 * @route GET /classes 
 * @role admin 
 * @auth required
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
  [
    {
      "id": 4,
      "name": "Class 1",
      "description": "A",
      "schoolId": 1
    },
    {
      "id": 3,
      "name": "Class 3",
      "description": "Descriptiopn 3",
      "schoolId": 1
    },
    .
    .
    .
  ]
 */
router.get('/classes', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('User Unauthorized');
    }
    const schoolId = payload.schoolId;
    const classes = await findAllClassBySchoolId(+schoolId);

    res.json(classes);
  } catch (error) {
    next(error);
  }
});

/**
 * @role admin 
 * @summary create a class 
 * @route POST /class
 * @auth required
 * @bodyparam {stirng} name the name fo the class (can duplicate, but cant duplicate with same schoolId)
 * @bodyparam {string} description the description of class (optional)
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
  {
    "msg": "Class created ..."
  }
 */
router.post('/class', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('User Unauthorized');
    }
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Bad request (invalid name ...)');
    }
    const classData = {
      name,
      description,
      schoolId: payload.schoolId,
    } as Class;
    const newClass = await createClass(classData);
    res.json(newClass);
  } catch (error) {
    next(error);
  }
});

/**
 * @role admin 
 * @summary update class by Id
 * @route PUT /class/:id
 * @auth required
 * @body {number} id the id fo the class 
 * @bodyparam {string} name the name of class (can duplicate, but cant duplicate with same schoolId)
 * @bodyparam {string} description the description of class (optional)
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
  {
    "msg": "Class updated ..."
  }
*/
router.put('/class/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const payload = req.payload;
    const schoolId = payload.schoolId;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('User Unauthorized');
    }
    const currClass = await findClassById(+id);
    if (!currClass) {
      res.status(400);
      throw new Error('Bad request ...');
    }
    if (currClass.schoolId !== schoolId) {
      res.status(401);
      throw new Error('User Unauthorized');
    }

    // client input:
    const { name, description } = req.body;
    if (!name) {
      res.status(400);
      throw new Error('Bad request ...');
    }

    // check existing subjectName in school
    const classesOfSchool = await findAllClassBySchoolId(+schoolId);
    const existingName = classesOfSchool.find((classD) => classD.name === name);
    if (existingName && currClass.name !== name) {
      res.status(400);
      throw new Error('Bad request(SubjectName already exist in this school ...)');
    }
    const classData = {
      name,
      description,
    } as Class;

    // update
    const newClass = await updateClass(+id, classData);
    res.json(newClass); // use this as always ✅
  } catch (error) {
    next(error);
  }
});

export default router;
