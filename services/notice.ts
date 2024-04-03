import { Notice } from '@prisma/client';
import { prisma } from '../prisma/db';

const findNoticeById = async (id: number) => {
  return await prisma.notice.findUnique({
    where: {
      id,
    },
  });
};

const findAllNotices = async () => {
  return await prisma.notice.findMany();
};

const createNotice = async (notice: Notice) => {
  return await prisma.notice.create({
    data: notice,
  });
};

const updateNoticeById = async (id: number, notice: Notice) => {
  return await prisma.notice.update({
    where: {
      id,
    },
    data: notice,
  });
};

const deleteNoticeById = async (id: number) => {
  return await prisma.notice.delete({
    where: {
      id,
    },
  });
};

export { findNoticeById, findAllNotices, createNotice, updateNoticeById, deleteNoticeById };
