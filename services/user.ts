import { User } from '@prisma/client';
import { prisma } from '../prisma/db';

import bcrypt from 'bcrypt';

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const createUserByEmailAndPassword = async (user: User) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return await prisma.user.create({
    data: user,
  });
};

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const deleteUserById = async (id: number) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

const updateUserById = async (id, user: User) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return await prisma.user.update({
    where: {
      id,
    },
    data: user,
  });
};

export { findUserByEmail, findUserById, createUserByEmailAndPassword, deleteUserById, updateUserById };
