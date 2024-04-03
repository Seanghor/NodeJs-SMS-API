import { Router } from 'express';
import userController from '../controllers/user';
import authController from '../controllers/auth';
import messageController from '../controllers/message';
import eventController from '../controllers/event';
import examController from '../controllers/exam';
import studentController from '../controllers/student';
import resultController from '../controllers/result';
import subjectController from '../controllers/subject';
import teacherController from '../controllers/teacher';
import schoolController from '../controllers/school';
import attendanceController from '../controllers/attendance';
import settingController from '../controllers/setting';
import classController from '../controllers/class';
import paymentController from '../controllers/payment';
import expenseController from '../controllers/expense';

const api = Router()
  .use(authController)
  .use(userController)
  .use(messageController)
  .use(eventController)
  .use(examController)
  .use(studentController)
  .use(resultController)
  .use(subjectController)
  .use(teacherController)
  .use(attendanceController)
  .use(schoolController)
  .use(settingController)
  .use(classController)
  .use(paymentController)
  .use(expenseController);

export default Router().use('/api', api);
