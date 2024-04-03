import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { SUPER_ADMIN_EMAIL } from '../configs';
import { createNotice, deleteNoticeById, findAllNotices, findNoticeById, updateNoticeById } from '../services/notice';
const router: Router = Router();

router.get('/notice/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const notice = await findNoticeById(+id);
    if (notice) {
      res.json(notice);
    } else {
      res.status(404);
      throw new Error('Notice not found');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/notices', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const notices = await findAllNotices();
    if (notices) {
      res.json(notices);
    } else {
      res.status(404);
      throw new Error('Notices not found');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/notice', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const notice = req.body;
    const newNotice = await createNotice(notice);
    res.json(newNotice);
  } catch (error) {
    next(error);
  }
});

router.put('/notice/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const id = req.params.id;
    const notice = req.body;
    const newNotice = await updateNoticeById(+id, notice);
    if (newNotice) {
      res.json(newNotice);
    } else {
      res.status(404);
      throw new Error('Notice Update Failed');
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/notice/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const id = req.params.id;
    const notice = await deleteNoticeById(+id);
    res.json(notice);
  } catch (error) {
    next(error);
  }
});
