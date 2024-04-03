import { Class } from '@prisma/client';
import { prisma } from '../prisma/db';

const findClassById = async (id: number) => {
  return await prisma.class.findUnique({
    where: {
      id,
    },
  });
};

const findAllClassBySchoolId = async (schoolId: number) => {
  return await prisma.class.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

const createClass = async (data: Class) => {
  return await prisma.class.create({
    data,
  });
};

const updateClass = async (id: number, data: Class) => {
  return await prisma.class.update({
    where: {
      id,
    },
    data,
  });
};

const deleteClass = async (id: number) => {
  return await prisma.class.delete({
    where: {
      id,
    },
  });
};

export { findClassById, findAllClassBySchoolId, createClass, updateClass, deleteClass };
