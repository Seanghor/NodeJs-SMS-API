import { School } from './../node_modules/.prisma/client/index.d';
import { prisma } from '../prisma/db';

const createSchool = async (school: School) => {
  return prisma.school.create({
    data: school,
  });
};

const findSchoolById = async (id: number) => {
  return await prisma.school.findUnique({
    where: {
      id,
    },
  });
};

const findSchoolByName = async (name: string) => {
  return await prisma.school.findUnique({
    where: {
      name,
    },
  });
};

const findSchools = async () => {
  return await prisma.school.findMany();
};

const updateSchool = async (id: number, school: School) => {
  return await prisma.school.update({
    where: {
      id,
    },
    data: school,
  });
};

const deleteSchool = async (id: number) => {
  return await prisma.school.delete({
    where: {
      id,
    },
  });
};

export { createSchool, findSchoolById, findSchoolByName, findSchools, updateSchool, deleteSchool };
