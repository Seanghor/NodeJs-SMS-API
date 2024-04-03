import { Payment, RoleEnumType } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { SUPER_ADMIN_EMAIL } from '../configs';
import {
  createPayment,
  deletePaymentById,
  findPaymentByIdAndSchoolId,
  findPaymentsBySchoolId,
  updatePaymentById,
} from '../services/payment';
const router: Router = Router();

router.get('/payment/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.params;
    const payment = findPaymentByIdAndSchoolId(+id, payload.schoolId);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.get('/payments', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const payments = await findPaymentsBySchoolId(+payload.schoolId);
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.post('/payment', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { amount, schoolId, date, studentId, type, description, other, teacherId } = req.body;
    const data = { schoolId, date, studentId, amount, type, description, other, teacherId } as Payment;
    const payment = await createPayment(data);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.put('/payment/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin && payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.params;
    const { amount, schoolId, date, studentId, teacherId, type, description } = req.body;
    const data = { schoolId, date, studentId, teacherId, amount, type, description } as Payment;
    const payment = await updatePaymentById(+id, data);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.delete('/payment/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin && payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.params;
    const payment = await deletePaymentById(+id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

export default router;
