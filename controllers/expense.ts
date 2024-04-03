import { Expense, RoleEnumType } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { SUPER_ADMIN_EMAIL } from '../configs';
import {
  createExpense,
  deleteExpenseById,
  findExpenseByIdAndSchoolId,
  findExpensesBySchoolId,
  updateExpenseById,
} from '../services/expense';
const router: Router = Router();

router.get('/expense/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.params;
    const expense = findExpenseByIdAndSchoolId(+id, payload.schoolId);
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.get('/expenses', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const expenses = await findExpensesBySchoolId(payload.schoolId);
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

router.post('/expense', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const expense = await createExpense(req.body);
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.put('/expense/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin && payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.params;
    const expense = await updateExpenseById(+id, req.body);
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.delete('/expense/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.role !== RoleEnumType.admin && payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const { id } = req.params;
    const expense = await deleteExpenseById(+id);
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

export default router;
