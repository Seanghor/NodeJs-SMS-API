import { Result } from '@prisma/client';
import { prisma } from '../prisma/db';

const findResultById = async (id: number) => {
  return await prisma.result.findUnique({
    where: {
      id,
    },
  });
};

const findResultByStudentId = async (studentId: number) => {
  return await prisma.result.findMany({
    where: {
      studentId,
    },
    select: {
      id: true,
      exam: {
        select: {
          subject: true,
          date: true,
        },
      },
      mark: true,
    },
  });
};

const findAllResults = async (schoolId: number) => {
  return await prisma.result.findMany({
    where: {
      schoolId,
    },
  });
};

const deleteResult = async (id: number) => {
  return await prisma.result.delete({
    where: {
      id,
    },
  });
};

const updateResult = async (id: number, data: Result) => {
  return await prisma.result.update({
    where: {
      id,
    },
    data,
  });
};

const createResult = async (data: Result) => {
  return await prisma.result.create({
    data,
  });
};

const findResultsByTeacher = async (teacherId: number) => {
  const subjects = await prisma.subject.findMany({
    where: {
      teacherId,
    },
    select: {
      Exam: {
        select: {
          id: true,
          Result: {
            select: {
              id: true,
              mark: true,
              student: true,
            },
          },
        },
      },
    },
  });
  const results = [];
  subjects.forEach((subject) => {
    subject.Exam.forEach((exam) => {
      exam.Result.forEach((result) => {
        results.push(result);
      });
    });
  });
  return results;
};

export { findResultById, findResultByStudentId, findAllResults, deleteResult, updateResult, createResult, findResultsByTeacher };
