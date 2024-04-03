import { RoleEnumType } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { prisma } from '../prisma/db';
import { findSchoolById } from '../services/school';
import { findTeacherByUserId } from '../services/teacher';
import { findStudentByUserId } from '../services/student';
const router: Router = Router();

/**
 * POST /tag
 *
 * @summary create a tag
 * @param {string} name the name fo the new tag
 * @returns {object} 200 - success response
 * @returns {object} 400 - Bad request response
 * @example response - 200 - success response example
 *   {
 *     "id": 1,
 *     "name": "lorem ipsum",
 *   }
 */
router.get('/users', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    console.log(payload);
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/profile', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    switch (payload.role) {
      case RoleEnumType.admin:
        const schoolPf = await findSchoolById(payload.schoolId);
        const schoolData = { ...schoolPf, role: payload.role };
        res.json(schoolData);
        break;
      case RoleEnumType.teacher:
        const teacherPf = await findTeacherByUserId(payload.userId);
        const teacherData = { ...teacherPf, role: payload.role };
        res.json(teacherData);
        break;
      case RoleEnumType.student:
        const studentPf = await findStudentByUserId(payload.userId);
        const studentData = { ...studentPf, role: payload.role };
        res.json(studentData);
      default:
        res.status(400);
        throw new Error('Invalid role');
    }
  } catch (err) {
    next(err);
  }
});

export default router;
