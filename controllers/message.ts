import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../middlewares/auth';
import { createMessage, deleteMessage, findAllMessages, findMessageById, findMessagesByUserId, updateMessage } from '../services/message';
import { SUPER_ADMIN_EMAIL } from '../configs';
const router: Router = Router();

/**
 * GET /message/:id
 *
 * @summary get a message
 * @param {number} id the id fo the message
 * @returns {object} 200 - success response
 * @returns {object} 401 - Unauthorized response
 * @example response - 200 - success response messageple
 *   {
 *     "_id": "Bury the light",
 *     "name": "lorem ipsum",
 *   }
 */

router.get('/message/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const payload = req.payload;
    if (!['teacher', 'student', 'admin'].includes(payload.role)) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const message = await findMessageById(+id);
    res.json(message);
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Get all messages
 */

router.get('/messages', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (!payload.role) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    if (payload.email == SUPER_ADMIN_EMAIL) {
      const messages = await findAllMessages();
      res.json({ messages });
      return;
    }
    const userMessages = await findMessagesByUserId(payload.userId);
    res.json(userMessages);
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Create a message
 */
router.post('/message', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (!payload.role) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const message = await createMessage(req.body);
    res.json(message);
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Update a message
 */
router.put('/message/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (!payload.role) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const id = req.params.id;
    const currMsg = await findMessageById(+id);
    if (currMsg.userId !== payload.userId) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const message = await updateMessage(+id, req.body);
    res.json(message);
  } catch (error) {
    next(error);
  }
});

/**
 * @summary Delete a message
 */

router.delete('/message/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.payload;
    if (!payload.role) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const id = req.params.id;
    const currMsg = await findMessageById(+id);
    if (currMsg.userId !== payload.userId) {
      res.status(401);
      throw new Error('🚫User is Un-Authorized 🚫');
    }
    const message = await deleteMessage(+id);
    res.json(message);
  } catch (error) {
    next(error);
  }
});

export default router;
