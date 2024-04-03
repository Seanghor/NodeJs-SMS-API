import { Attendance, AttendanceEnumType, RoleEnumType } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { StudentAttendance } from '../interfaces';
import { isAuth } from '../middlewares/auth';
import {
  createAttendance,
  deleteAttendanceById,
  findAttendanceById,
  getAllAttendanceOfOneStudentById,
  updateAttendanceById,
} from '../services/attendance';
import { findStudentByUserId } from '../services/student';
import { findTeacherByUserId } from '../services/teacher';
import { findUserById } from '../services/user';
const router: Router = Router();

/**
 *
 * @summary get all attendances for a student(for all subject)
 * @route {GET} /attendances
 * @auth required (role student)
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response subject
 *
 *[
 *	{
 *		"subject": "Subject 3",
 *		"total": 4,
 *		"present": 1,
 *		"absent": 1,
 *		"leave": 2
 *	},
 *	{
 *		"subject": "Subject 2",
 *		"total": 5,
 *		"present": 4,
 *		"absent": 1,
 *		"leave": 0
 *	},
 *	{
 *		"subject": "Subject 4",
 *		"total": 1,
 *		"present": 1,
 *		"absent": 0,
 *		"leave": 0
 *	},
 *	{
 *		"subject": "Subject 1",
 *		"total": 2,
 *		"present": 1,
 *		"absent": 1,
 *		"leave": 0
 *	}
 *]
 */
router.get('/attendances', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.student) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }

    const studentInfo = await findStudentByUserId(+payload.userId);
    const studentAttendances = await getAllAttendanceOfOneStudentById(+studentInfo.id);
    const subjects = [];
    const finalResult = [];
    studentAttendances.Attendance.filter((attendance) => {
      !subjects.includes(attendance.Subject.name) ? subjects.push(attendance.Subject.name) : null;
    });
    console.log(subjects);
    for (const subName of subjects) {
      const arrayOfOneSubject = studentAttendances.Attendance.filter((attd) => attd.Subject.name === subName);
      let present = 0;
      let absent = 0;
      let leave = 0;

      for (const attdOfEachSub of arrayOfOneSubject) {
        if (attdOfEachSub.attendanceType == AttendanceEnumType.present) {
          present++;
        } else if (attdOfEachSub.attendanceType == AttendanceEnumType.absent) {
          absent++;
        } else if (attdOfEachSub.attendanceType == AttendanceEnumType.leave) {
          leave++;
        }
      }

      const studentAttendanceData = {
        subject: subName,
        total: present + absent + leave,
        present,
        absent,
        leave,
      } as StudentAttendance;
      finalResult.push(studentAttendanceData);
    }
    res.json(finalResult);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary get an attendance by ID (role teacher)
 * @route {GET} /attendance/:id
 * @auth required
 * @param {number} id the id of the attendance
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response subject
 *
 * {
 *	"id": 2,
 *	"date": "2022-12-28T08:20:13.584Z",
 *	"status": null,
 *	"attendanceType": "present",
 *	"teacherId": 2,
 *	"subjectId": 3,
 *	"schoolId": 1,
 *	"studentId": 2
 * }
 */
router.get('/attendance/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (!['admin', 'teacher'].includes(payload.role)) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const id = req.params.id;
    const attendance = await findAttendanceById(+id);
    res.json(attendance);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary create an attendance by teacher role of school
 * @route {POST} /attendance
 * @auth required
 * @bodyparam {string} date the date of the attendance
 * @bodyparam {string} status the status of the attendance(optional)
 * @bodyparam {string} attendanceType the attendanceType of the attendance(default = present)
 * @bodyparam {number} subjectId the subjectId which teacher have( 1 teacher have 1 or many subject)
 * @bodyparam {number} studentId the studentId of student
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object message subject created
 *   {
 *      "message": "🆕1 attendance created ..."
 *   }
 */
router.post('/attendance', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.teacher) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }

    const { date, description, attendanceType, subjectId, studentId } = req.body;
    if (!date || !studentId || !subjectId) {
      res.status(400);
      throw new Error('You must provide a date, attendanceType, studentId and subjectId...');
    }

    const userId = payload.userId;
    const teacher = await findTeacherByUserId(+userId);

    // validate input:
    const attendanceData = {
      date,
      description,
      attendanceType,
      teacherId: teacher.id,
      subjectId,
      schoolId: payload.schoolId,
      studentId,
    } as Attendance;

    // create attendance:
    const attendance = await createAttendance(attendanceData);
    res.json(attendance);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary update an attendance by ID (by teacher role of school) => can update only status and attendanceType
 * @route {PUT} /attendance/:id
 * @auth required
 * @param {number} id the id of the attendance
 * @bodyparam {string} status the status of the attendance(optional)
 * @bodyparam {string} attendanceType the attendanceType of the attendance(have default)
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object message subject created
 *   {
 *      "message": "🆕1 attendance updated ..."
 *   }
 */
router.put('/attendance/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    const att = await findAttendanceById(+id);
    const userId = payload.userId;
    const user = await findUserById(+userId);

    const { description, attendanceType } = req.body;
    const attendanceData = {
      description,
      attendanceType,
    } as Attendance;

    switch (payload.role) {
      case RoleEnumType.teacher:
        const teacher = await findTeacherByUserId(+userId);
        if (att.teacherId != teacher.id) {
          res.status(401);
          throw new Error('🚫User is Un-Authorized(This user are not own this attendance) 🚫');
        }
        const updatedAttDataByTeacher = await updateAttendanceById(+id, attendanceData);
        res.json(updatedAttDataByTeacher);
        break;

      case RoleEnumType.admin:
        if (att.schoolId != user.schoolId) {
          res.status(401);
          throw new Error('🚫User is Un-Authorized(you are not admin of his/her school) 🚫');
        }
        const updatedAttdDataByAdmin = await updateAttendanceById(+id, attendanceData);
        res.json(updatedAttdDataByAdmin);
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
 * @summary delete an attendance by ID (by teacher role of school)
 * @route {Delete} /attendance/:id
 * @auth required
 * @param {number} id the id of the attendance
 * @returns {object} 200 - success response
 * @returns {object} 400 - bad request fail response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response an object message subject created
 *   {
 *      "message": "🆕1 attendance deleted ..."
 *   }
 */
router.delete('/attendance/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    const att = await findAttendanceById(+id);
    const userId = payload.userId;
    const user = await findUserById(+userId);

    switch (payload.role) {
      case RoleEnumType.teacher:
        const teacher = await findTeacherByUserId(+userId);
        if (att.teacherId != teacher.id) {
          res.status(401);
          throw new Error('🚫User is Un-Authorized(This user are not own this attendance) 🚫');
        }
        const attDeletedByTeacher = await deleteAttendanceById(+id);
        res.json(attDeletedByTeacher);
        break;
      case RoleEnumType.admin:
        if (att.schoolId != user.schoolId) {
          res.status(401);
          throw new Error('🚫User is Un-Authorized(you are not admin of his/her school) 🚫');
        }
        const attDeletedByAdmin = await deleteAttendanceById(+id);
        res.json(attDeletedByAdmin);
        break;
      default:
        res.status(401);
        throw new Error('🚫User is Un-Authorized 🚫');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
