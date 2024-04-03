import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import {
  findAllTeacherBySchoolId,
  findTeacherByIdAndSchoolId,
  updateTeacherByIdAndSchoolId,
  deleteTeacherByIdAndSchoolId,
  createTeacherBySchoolId,
} from '../services/teacher';
import { RoleEnumType } from '@prisma/client';
import { CreateTeacherInputDto } from '../interfaces';
const router: Router = Router();

/**
 * GET /teacher/:id
 *
 * @summary get a teacher
 * @param {number} id the id fo the teacher
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response teacher
 *   {
 *          "id": 1,
            "firstname": "dines",
            "lastname": "kuma"
            "gender": "male",
            "image": "url",
            "email": "kii@mail.com",
            "phone": null,
            "address": null,
            "userId": 4,
            "schoolId": 0
 *   }
 */
//  ------------- Done
router.get('/teacher/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.sendStatus(401);
      throw new Error('unauthorized');
    }
    const id = req.params.id;
    const teacher = await findTeacherByIdAndSchoolId(+id, payload.schoolId);
    res.json(teacher);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /teacher
 *
 * @summary get all teacher
 * @param {number} id the id fo the teacher
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response teacher
 *   {
 *          "id": 1,
            "name": "dines",
            "email": "kii@mail.com",
            "phone": null,
            "address": null,
            "userId": 4,
            "schoolId": 0
 *   }
 */
// --------- Done
router.get('/teachers', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.sendStatus(401);
      throw new Error('User unauthorized');
    }
    const teachers = await findAllTeacherBySchoolId(+payload.schoolId);
    res.json(teachers);
  } catch (error) {
    next(error);
  }
});

/**
 * post /teacher
 *
 * @summary create a teacher
 * @param {number} id the id fo the teacher
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response teacher
 *   {
 *          "id": 1,
            "name": "dines",
            "email": "kii@mail.com",
            "phone": null,
            "address": null,
            "userId": 4,
            "schoolId": 0
 *   }
 */
//  -------- Done
router.post('/teacher', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role != RoleEnumType.admin) {
      res.send(401);
      throw new Error('Unauthorized');
    }
    const { email, password, firstname, lastname, gender, address, phone } = req.body;
    if (!email || !password || !firstname || !lastname) {
      throw new Error('Please provide full information ...');
    }
    const teacherData = {
      firstname,
      lastname,
      gender,
      email,
      address,
      phone,
      password
    } as CreateTeacherInputDto;

    const teacher = await createTeacherBySchoolId(+payload.schoolId, teacherData);
    res.json(teacher);
  } catch (error) {
    next(error);
  }
});

/**
 * put/teacher/:id
 *
 * @summary get all teacher
 * @param {number} id the id fo the teacher
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response teacher
 *   {
 *     "id": 1,
 *     "name": "lorem ipsum",
 *   }
 */
// ------- Done
router.put('/teacher/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.sendStatus(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const id = req.params.id;
    const { firstname, lastname, gender, email, password ,address, phone } = req.body;
    if (!firstname || !lastname || !email || !password || !phone || !address) {
      res.status(400);
      throw new Error("firstname or lastname or email or password or phone or address and image can't invalid ...");
    }
    const teacherData = {
      firstname,
      lastname,
      gender,
      email,
      address,
      phone,
      password
    } as CreateTeacherInputDto;
    const newTeacher = await updateTeacherByIdAndSchoolId(+id, teacherData, +payload.schoolId);
    res.json(newTeacher);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /Teacher/:id
 * @summary delete a Teacher
 * @Auth Super school Only
 * @param {string} id the id fo the Teacher
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 * {
 *  "message": "Teacher deleted"
 * }
 * @example response - 401 - Unauthorized response example
 * {
 * "message": "Unauthorized"
 * }
 **/
//  ---------
router.delete('/teacher/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.sendStatus(401);
      throw new Error('Unauthorized');
    }
    const teacherId = req.params.id;
    const teacherDeleted = await deleteTeacherByIdAndSchoolId(+teacherId, payload.schoolId);
    res.json(teacherDeleted);
  } catch (error) {
    next(error);
  }
});
export default router;
