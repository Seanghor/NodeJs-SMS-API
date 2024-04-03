import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import {
  createEvent,
  deleteEventById,
  findAllEvents,
  findEventById,
  findEventByStudentId,
  findEventByTeacherId,
  updateEvent,
} from '../services/event';
import { Event, RoleEnumType } from '@prisma/client';
import { findTeacherByUserId } from '../services/teacher';
import { findStudentByUserId } from '../services/student';
const router: Router = Router();

/**
 * GET /event/:id
 *
 * @summary get a event
 * @param {number} id the id fo the event
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response example
 *   {
 *     "_id": "Bury the light",
 *     "name": "lorem ipsum",
 *   }
 */

router.get('/event/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const event = await findEventById(+id);
    res.json(event);
  } catch (error) {
    next(error);
  }
});

/**
 * Short Comment for the function
 * @Summary Get all events
 */
router.get('/events', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    switch (payload.role) {
      case RoleEnumType.teacher:
        const teacher = await findTeacherByUserId(payload.userId);
        const eventsTeacher = await findEventByTeacherId(teacher.id);
        res.json(eventsTeacher);
        break;
      case RoleEnumType.student:
        const student = await findStudentByUserId(payload.userId);
        const eventsStudent = await findEventByStudentId(student.id);
        res.json(eventsStudent);
        break;
      case RoleEnumType.admin:
        const events = await findAllEvents();
        res.json(events);
        break;
      default:
        res.status(401);
        throw new Error('User Unauthorized');
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Short Comment for the function
 * @Summary Create a new event
 */
router.post('/event', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;

    // Input Validation
    const {
      title,
      start,
      end,
      allDay,
      url,
      className,
      backgroundColor,
      borderColor,
      textColor,
      image,
      description,
      subjectId,
      teacherId,
      studentId,
    } = req.body;

    if (!title || !start || !end || !allDay || !subjectId || !studentId) {
      res.status(400);
      throw new Error('Invalid input');
    }

    switch (payload.role) {
      case RoleEnumType.admin:
        if (!teacherId) {
          res.status(400);
          throw new Error('Invalid input teacherId');
        }
        const eventData = {
          title,
          start,
          end,
          allDay,
          url,
          className,
          backgroundColor,
          borderColor,
          textColor,
          image,
          description,
          subjectId,
          teacherId,
          studentId,
          schoolId: payload.schoolId,
        } as Event;
        const eventByAdmin = await createEvent(eventData);
        res.json(eventByAdmin);
        break;
      case RoleEnumType.teacher:
        const teacher = await findTeacherByUserId(payload.userId);
        const eventDataTeacher = {
          title,
          start,
          end,
          allDay,
          url,
          className,
          backgroundColor,
          borderColor,
          textColor,
          image,
          description,
          subjectId,
          teacherId: teacher.id,
          studentId,
          schoolId: payload.schoolId,
        } as Event;
        const eventByTeacher = await createEvent(eventDataTeacher);
        res.json(eventByTeacher);
        break;
      default:
        res.status(401);
        throw new Error('User Unauthorized');
    }
  } catch (error) {
    next(error);
  }
});
/**
 * Short Comment for the function
 * @Summary  Update a event
 */
router.put('/event/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    const {
      title,
      start,
      end,
      allDay,
      url,
      className,
      backgroundColor,
      borderColor,
      textColor,
      image,
      description,
      subjectId,
      teacherId,
      studentId,
    } = req.body;

    if (!title || !start || !end || !allDay || !subjectId || !studentId || !id) {
      res.status(400);
      throw new Error('Missing or invalid input');
      return;
    }

    switch (payload.role) {
      case RoleEnumType.admin:
        if (!teacherId) {
          res.status(400);
          throw new Error('input teacherId');
        }
        const eventData = {
          id: +id,
          title,
          start,
          end,
          allDay,
          url,
          className,
          backgroundColor,
          borderColor,
          textColor,
          image,
          description,
          subjectId,
          teacherId,
          studentId,
          schoolId: payload.schoolId,
        } as Event;
        const eventByAdmin = await createEvent(eventData);
        res.json(eventByAdmin);
        break;
      case RoleEnumType.teacher:
        const teacher = await findTeacherByUserId(payload.userId);
        const eventDataTeacher = {
          id: +id,
          title,
          start,
          end,
          allDay,
          url,
          className,
          backgroundColor,
          borderColor,
          textColor,
          image,
          description,
          subjectId,
          teacherId: teacher.id,
          studentId,
          schoolId: payload.schoolId,
        } as Event;
        const eventByTeacher = await updateEvent(eventDataTeacher);
        res.json(eventByTeacher);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Short Comment for the function
 * @Summary Delete a event
 */
router.delete('/event/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    switch (payload.role) {
      case RoleEnumType.admin:
        const eventByAdmin = await deleteEventById(+id);
        res.json(eventByAdmin);
        break;
      case RoleEnumType.teacher:
        const eventByTeacher = await deleteEventById(+id);
        res.json(eventByTeacher);
        break;
      default:
        res.status(401);
        throw new Error('User Unauthorized');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
