import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { SUPER_ADMIN_EMAIL } from '../configs';
import { createSetting, deleteSetting, findAllSettings, findSettingById, updateSetting } from '../services/setting';
import { Setting } from '@prisma/client';
const router: Router = Router();

router.get('/setting/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    const id = req.params.id;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const setting = await findSettingById(+id);
    if (setting) {
      res.json(setting);
    } else {
      res.status(404);
      throw new Error('Setting not found');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/settings', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const settings = await findAllSettings();
    if (settings) {
      res.json({ settings });
    } else {
      res.status(404);
      throw new Error('Settings not found');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/setting', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, value } = req.body
    if (!name || !value) {
      res.status(400)
      throw new Error("Bad request ...")
    }
    const settingData = {
      name,
      value,
      schoolId: payload.schoolId
    } as Setting
    const newSetting = await createSetting(settingData);
    res.json(newSetting);
  } catch (error) {
    next(error);
  }
});

router.put('/setting/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const id = req.params.id;
    const { name, value } = req.body;
    const settingData = {
      name,
      value
    } as Setting
    const newSetting = await updateSetting(+id, settingData);
    res.json(newSetting);
  } catch (error) {
    next(error);
  }
});

router.delete('/setting/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (payload.email !== SUPER_ADMIN_EMAIL) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const id = req.params.id;
    const setting = await deleteSetting(+id);
    res.json(setting);
  } catch (error) {
    next(error);
  }
});

export default router;
