import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import {
  createSubjectBySchool,
  deleteSubjectByIdAndSchoolId,
  findAllSubjectOfTeacherIdByTeacherIdAndSchoolId,
  findSubjectById,
  findSubjectsBySchoolId,
  updateSubjectByIdAndSchoolId,
} from '../services/subject';
import { RoleEnumType, Subject } from '@prisma/client';
import { findTeacherByUserId } from '../services/teacher';
const router: Router = Router();

/**
 *
 * @summary get a unique subject by Id
 * @route {GET} /subject/:id
 * @auth required
 * @param {number} id the id of the subject
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response subject
 *
 *   {
 *     "id": 1,
 *     "name": "lorem ipsum",
 *     "code": "999",
 *     "classId": 1,
 *     "schoolId": 1,
 *     "teacherId": 1
 *   }
 *
 */
// --------- In progress
router.get('/subject/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }

    const id = req.params.id;
    const subject = await findSubjectById(+id);
    if (!subject) {
      res.status(400);
      throw new Error('🚫Bad request 🚫');
    }
    res.json(subject);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary get all subjects
 * @route {GET} /subjects
 * @auth required
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response subject
 *
 *{
 *	"subjects": [
 *		{
 *			"id": 1,
 *			"name": "Mobile Application",
 *			"code": "888",
 *			"classId": 1,
 *			"schoolId": 1,
 *			"teacherId": 1
 *		},
 *		{
 *			"id": 3,
 *			"name": "Mobile",
 *			"code": "888",
 *			"classId": 1,
 *			"schoolId": 1,
 *			"teacherId": 1
 *		},
 *		{
 *			"id": 4,
 *			"name": "System Analysist",
 *			"code": "888",
 *			"classId": 1,
 *			"schoolId": 1,
 *			"teacherId": 1
 *		}
 *	]
 *}
 */
// ------ Done
router.get('/subjects', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    switch (payload.role) {
      case RoleEnumType.admin:
        const subjects = await findSubjectsBySchoolId(payload.schoolId);
        res.json(subjects);
        break;
      case RoleEnumType.teacher:
        const currTeacher = await findTeacherByUserId(payload.userId);
        const teacherSubjects = await findAllSubjectOfTeacherIdByTeacherIdAndSchoolId(currTeacher.id, payload.schoolId);
        res.json(teacherSubjects);
      default:
        res.status(401);
        throw new Error('🚫User is Un-Authorized 🚫');
    }
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary create a new subject
 * @route {POST} /subject
 * @auth required
 * @bodyparam {string} name the name of the subject
 * @bodyparam {string} code the code of the subject
 * @bodyparam {number} teacherId the teaherId of th subject(must be match with id of teacher)\
 * @bodyparam {number} schoolId the schoolId of the subject
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object message subject created
 *   {
 *      "message": "🆕1 subject created ..."
 *   }
 */
// ------- Done
router.post('/subject', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const { name, code, teacherId, classId } = req.body;
    if (!name || !teacherId || !classId) {
      res.status(400);
      throw new Error('You must input name, teacherId and classId');
    }
    const subjectData = {
      name,
      code,
      schoolId: payload.schoolId,
      teacherId,
      classId,
    } as Subject;

    const subject = await createSubjectBySchool(subjectData, payload.schoolId);
    res.json(subject);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary delete a unique subject by Id
 * @route {DELETE} /subject/:id
 * @auth required
 * @param {number} id the id of the subject that we want to delete
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object deleted ...
 *   {
 *      "message": "⛔️1 subject deleted ..."
 *   }
 */
// ----- Done
router.delete('/subject/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const subDeleted = await deleteSubjectByIdAndSchoolId(+id, payload.schoolId);
    res.json(subDeleted);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary update subject data by Id (not able to change schoolId for each subject)
 * @route {PUT} /subject/:id
 * @auth required
 * @param {number} id the id of the subject
 * @bodyparam {string} name the name of the subject
 * @bodyparam {string} code the code of the subject
 * @bodyparam {number} teacherId the teaherId of th subject(must be match with id of teacher)
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object message subject updated
 *   {
 *      "message": "💯1 subject updated..."
 *   }
 */
// --------- Done
router.put('/subject/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }

    const { name, code, teacherId, classId } = req.body;
    if (!name || !teacherId || !classId) {
      res.status(400);
      throw new Error("🚫name and teacherId can't invalid ... ");
    }
    const subjectData = {
      name,
      code,
      teacherId,
      classId,
    } as Subject;
    const subject = await updateSubjectByIdAndSchoolId(+id, payload.schoolId, subjectData);
    res.json(subject);
  } catch (error) {
    next(error);
  }
});
export default router;
