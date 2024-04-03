import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import {
  createStudent,
  findStudentByIdAndSchoolId,
  updateStudentByIdAndSchoolId,
  deleteStudentByIdAndSchoolId,
  findStudentsBySchoolId,
  findStudentsOfOneTeacher,
} from '../services/student';
import { RoleEnumType } from '@prisma/client';
import { CreateStudentInputDto } from '../interfaces';
import { findTeacherByUserId } from '../services/teacher';
const router: Router = Router();

/**
 *
 * @summary create user which role student or create student
 * @route {POST} /student
 * @auth required
 * @bodyparam { string } email(unique) the email of the student
 * @bodyparam { string } firstnanme the firstname of the student
 * @bodyparam { string } lastnanme the lastname of the student
 * @bodyparam { string(Enum) } gender the gender of the student(default)
 * @bodyparam { string } password the password of the student
 * @bodyparam { string } phone the phonenumber of the student
 * @bodyparam { string } address the address of the student
 * @bodyparam { string } image the profileImage of the student
 * @returns {object} 200 - success response
 * @return  {object} 400 - wrong input param
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response a object message created student
 *   {
 *      "message": "Student created ..."
 *   }
 */
router.post('/student', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role != RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫 Un-Authorized 🚫');
    }

    const { firstname, lastname, gender, email, password, phone, address } = req.body;
    if (!firstname || !lastname || !email || !password) {
      res.status(400);
      throw new Error('You must provide firstname, lastname, email, and password...');
    }

    const studentData = {
      firstname,
      lastname,
      email,
      gender,
      phone,
      address,
      password,
    } as CreateStudentInputDto;

    const student = await createStudent(+payload.schoolId, studentData);
    res.json(student);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary get all
 * @route {GET} /students
 * @auth required
 * @returns {object} 200 - success response
 * @return  {object} 400 - student not found
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response student
 *   [{
 *     "_id": "Bury the light",
 *     "name": "lorem ipsum",
 *     "email": "loremipsum"@gmail.com,
 *     "phone": "0999999999",
 *     "address": "Phnum Penh",
 *     "schoolId": 1,
 *     "userId": 12
 *   }]
 */
router.get('/students', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    switch (payload.role) {
      case RoleEnumType.admin:
        const attendances = await findStudentsBySchoolId(+payload.schoolId);
        res.json(attendances);
        break;

      case RoleEnumType.teacher:
        const userId = payload.userId;
        const teacher = await findTeacherByUserId(+userId);
        const allStudentOfTeacher = await findStudentsOfOneTeacher(teacher.id, payload.schoolId);
        res.json(allStudentOfTeacher);
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
 * @summary get a unique student by id
 * @route {GET} /student/:id
 * @auth required
 * @param { number } id the id of the student
 * @returns {object} 200 - success response
 * @return  {object} 400 - student not found
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response student
 *   {
 *     "_id": "Bury the light",
 *     "firsrname": "lorem ipsum",
 *     "lastname": "lorem ipsum",
 *     "gender": "male",
 *     "image": "url",
 *     "email": "loremipsum"@gmail.com,
 *     "phone": "0999999999",
 *     "address": "Phnum Penh",
 *     "schoolId": 1,
 *     "userId": 12
 *   }
 */
router.get('/student/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // chekcing role:
    const payload = req.payload;
    if (payload.role != 'admin') {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }

    const id = Number(req.params.id);
    const student = await findStudentByIdAndSchoolId(+id, payload.schoolId);
    res.json(student);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary update a student(name, phone, addres) by id:
 * @route {PUT} /student/:id
 * @auth required
 * @param { number } id the id of the student which we want to update
 * @bodyparam { string } firstnanme the firstname of the student
 * @bodyparam { string } lastnanme the lastname of the student
 * @bodyparam { string } email(unique) the email of the student
 * @bodyparam { string(Enum) } gender the gender of the student(default)
 * @bodyparam { string } password the password of the student
 * @bodyparam { string } phone the phonenumber of the student
 * @bodyparam { string } address the address of the student
 * @bodyparam { string } image the profileImage of the student
 * @returns {object} 200 - success response
 * @return  {object} 400 - wrong input bodyparam or student is not found with the ID
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response a object message student updated
 *   {
 *      "message": "Student updated ..."
 *   }
 */
router.put('/student/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const payload = req.payload;
    if (payload.role != RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const { firstname, lastname, gender, email, password, phone, address } = req.body;
    if (!firstname || !lastname || !email || !password || !phone || !address) {
      res.status(400);
      throw new Error("firstname or lastname or email or password or phone or address and image can't invalid ...");
    }
    const studentData = {
      firstname,
      lastname,
      email,
      gender,
      phone,
      address,
      password,
    } as CreateStudentInputDto;
    const updatedStd = await updateStudentByIdAndSchoolId(+id, +payload.schoolId, studentData);
    res.json(updatedStd);
  } catch (error) {
    next(error);
  }
});

/**
 *
 * @summary delete a unique student by id:
 * @route {DELETE} /student/:id
 * @auth required
 * @param { number } id the id of the student which we will delete
 * @returns {object} 200 - success response
 * @return  {object} 400 - student not found with the ID
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response a object message student deleted
 *   {
 *      "message": "1 Student deleted ..."
 *   }
 */
router.delete('/student/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    if (payload.role != RoleEnumType.admin) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const stdDeleted = await deleteStudentByIdAndSchoolId(+id, +payload.schoolId);
    res.json(stdDeleted);
  } catch (error) {
    next(error);
  }
});

export default router;
