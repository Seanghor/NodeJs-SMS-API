import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import {
  createResult,
  deleteResult,
  findAllResults,
  findResultById,
  findResultByStudentId,
  findResultsByTeacher,
  updateResult,
} from '../services/result';
import { RoleEnumType } from '@prisma/client';
import { findStudentByUserId } from '../services/student';
import { findTeacherByUserId } from '../services/teacher';
const router: Router = Router();

/**
 * GET /result/:id
 *
 * @summary get a result
 * @param {number} id the id fo the result
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response resultple
 *   {
 *     "_id": "Bury the light",
 *     "name": "lorem ipsum",
 *   }
 */

router.get('/result/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await findResultById(+id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Get All Results
 */
router.get('/results', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    switch (payload.role) {
      case RoleEnumType.student:
        const student = await findStudentByUserId(payload.userId);
        const resultsStudent = await findResultByStudentId(student.id);
        res.json(resultsStudent);
        break;
      case RoleEnumType.admin:
        const results = await findAllResults(payload.schoolId);
        res.json(results);
        break;
      case RoleEnumType.teacher:
        const teacher = await findTeacherByUserId(payload.userId);
        const resultsTeacher = await findResultsByTeacher(teacher.id);
        res.json(resultsTeacher);
      default:
        res.status(401);
        throw new Error('🚫User is Un-Authorized 🚫');
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Create Result
 */

router.post('/result', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role === RoleEnumType.admin || payload.role === RoleEnumType.teacher) {
      const result = await createResult(req.body);
      res.json(result);
    } else {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Update Result
 */

router.put('/result/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    const result = await findResultById(+id);
    if (result) {
      if (payload.role === RoleEnumType.admin || payload.role === RoleEnumType.teacher) {
        const updatedResult = await updateResult(+id, req.body);
        res.json({ updatedResult });
      } else {
        res.status(401);
        throw new Error('🚫User is Un-Authorized 🚫');
      }
    } else {
      res.status(404);
      throw new Error('🚫Result not found 🚫');
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Delete Result
 * @param {number} id the id fo the result
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response resultple
 *
 **/

router.delete('/result/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    const result = await findResultById(+id);
    if (result) {
      if (payload.role === RoleEnumType.admin || payload.role === RoleEnumType.teacher) {
        const deletedResult = await deleteResult(+id);
        res.json(deletedResult);
      } else {
        res.status(401);
        throw new Error('🚫User is Un-Authorized 🚫');
      }
    } else {
      res.status(404);
      throw new Error('🚫Result not found 🚫');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
