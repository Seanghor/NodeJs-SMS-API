import { Exam, RoleEnumType } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import {
  createExam,
  deleteExamByIdAndSchoolId,
  findAllExamBySchoolId,
  findAllExamOfStudent,
  findExamByIdAndSchoolId,
  updateExamByIdAndSchoolId,
} from '../services/exam';
import { findStudentByUserId } from '../services/student';
const router: Router = Router();

/**
 *
 * @summary get all exam
 * @route {GET} /exams
 * @auth required
 * @param {number} id the id of the exam
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response subject
 *
 *   [{
 *     "id": 1,
 *     "name": "lorem ipsum",
 *     "date": "1970-01-01T00:00:00.000Z",
 *     "schoolId": 1,
 *     "subjectId": 3,
 *     "subject": {
 *       "id": 2,
 *        "name": "Subject 2"
 *     }
 *   }]
 */
// switch (payload.role) {
//   case RoleEnumType.student:
//     res.json('heklsa');
//     break;
//   default:
//     res.status(401);
//     throw new Error('🚫User is Un-Authorized 🚫');
// }
router.get('/exams', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    switch (payload.role) {
      case RoleEnumType.admin:
        const exams = await findAllExamBySchoolId(payload.schoolId);
        res.json(exams);
        break;
      case RoleEnumType.student:
        const student = await findStudentByUserId(+payload.userId);
        const data = await findAllExamOfStudent(student.id, +payload.schoolId);
        res.json(data);
        break;
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
 * @summary get a unique exam by Id
 * @route {GET} /exam/:id
 * @auth required
 * @param {number} id the id of the exam
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response subject
 *
 *   {
 *     "id": 1,
 *     "name": "lorem ipsum",
 *     "date": "1970-01-01T00:00:00.000Z",
 *     "schoolId": 1,
 *     "subjectId": 3
 *   }
 */
router.get('/exam/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // checking role:
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const id = req.params.id;
    const exam = await findExamByIdAndSchoolId(+id, +payload.schoolId);
    res.json(exam);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary delete a unique exam by Id
 * @route {DELETE} /exam/:id
 * @auth required
 * @param {number} id the id of the exam
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object deleted ...
 *   {
 *      "message": "⛔️1 exam deleted ..."
 *   }
 */
router.delete('/exam/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // checking role:
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const id = req.params.id;
    const examDeleted = await deleteExamByIdAndSchoolId(+id, +payload.schoolId);
    res.json(examDeleted);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary create a new exam
 * @route {POST} /subject
 * @auth required
 * @bodyparam {string} name the name of the exam
 * @bodyparam {string} date the code of the date
 * @bodyparam {number} subjectId the subjectId of th exam (it must be match with id of subject)
 * @bodyparam {number} schoolId the schoolId of the exam
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object message subject created
 *   {
 *      "message": "🆕1 exam created ..."
 *   }
 */
router.post('/exam', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // checking role:
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }

    // check input:
    const { name, date, subjectId } = req.body;
    if (!name || !date || !subjectId) {
      res.status(400);
      throw new Error('You must input name, date and subjectId');
    }
    // input validate
    const examData = {
      name,
      date,
      schoolId: payload.schoolId,
      subjectId,
    } as Exam;

    // create exam
    const exam = await createExam(examData);
    res.json(exam);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary update exam data by Id (not able to change schoolId for each exam)
 * @route {PUT} /exam/:id
 * @auth required
 * @bodyparam {string} name the name of the exam
 * @bodyparam {string} date the date of the date
 * @bodyparam {number} subjectId the subjectId of th exam(it must be match with id of subject)
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail respone
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object message subject updated
 *   {
 *      "message": "💯1 exam updated..."
 *   }
 */
router.put('/exam/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }

    const id = req.params.id;
    const { name, date, subjectId } = req.body;
    if (!name || !date || !subjectId) {
      res.status(400);
      throw new Error("🚫name , date and subjectId can't invalid ... ");
    }
    // input validate
    const examData = {
      name,
      date,
      subjectId,
    } as Exam;
    // update data
    const newExam = await updateExamByIdAndSchoolId(+id, +payload.schoolId, examData);
    res.json(newExam);
  } catch (error) {
    next(error);
  }
});
export default router;
