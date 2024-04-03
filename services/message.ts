import { Message } from '@prisma/client';
import { prisma } from '../prisma/db';

const findMessageById = async (id: number) => {
  return await prisma.message.findUnique({
    where: {
      id,
    },
  });
};

const findMessagesByUserId = async (userId: number) => {
  return await prisma.message.findMany({
    where: {
      userId,
    },
  });
};
const findAllMessages = async () => {
  return await prisma.message.findMany();
};

const createMessage = async (data: Message) => {
  return await prisma.message.create({
    data,
  });
};

const updateMessage = async (id: number, data: Message) => {
  return await prisma.message.update({
    where: {
      id,
    },
    data,
  });
};

const deleteMessage = async (id: number) => {
  return await prisma.message.delete({
    where: {
      id,
    },
  });
};

export { findMessageById, createMessage, updateMessage, findMessagesByUserId, findAllMessages, deleteMessage };
