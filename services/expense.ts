import { Expense } from '@prisma/client';
import { prisma } from '../prisma/db';
import { MAX_LIMIT } from '../configs';
import { findStudentById } from './student';
import { findTeacherById } from './teacher';

const findAllExpenses = async () => {
  return await prisma.expense.findMany();
};
const findExpensesBySchoolId = async (schoolId: number) => {
  return await prisma.expense.findMany({
    where: {
      schoolId,
    },
  });
};

const findExpenseById = async (id: number) => {
  return await prisma.expense.findUnique({
    where: {
      id,
    },
  });
};

const createExpense = async (expense: Expense) => {
  if (expense.studentId) {
    const student = await findStudentById(expense.studentId);
    if (!student || student.schoolId !== expense.schoolId) {
      throw new Error('student not found');
    }
  }
  if (expense.teacherId) {
    const teacher = await findTeacherById(expense.teacherId);
    if (!teacher || teacher.schoolId !== expense.schoolId) {
      throw new Error('teacher not found');
    }
  }
  return await prisma.expense.create({
    data: expense,
  });
};

const updateExpenseById = async (id: number, expense: Expense) => {
  if (expense.studentId) {
    const student = await findStudentById(expense.studentId);
    if (!student || student.schoolId !== expense.schoolId) {
      throw new Error('student not found');
    }
  }
  if (expense.teacherId) {
    const teacher = await findTeacherById(expense.teacherId);
    if (!teacher || teacher.schoolId !== expense.schoolId) {
      throw new Error('teacher not found');
    }
  }
  return await prisma.expense.update({
    where: {
      id,
    },
    data: expense,
  });
};

const deleteExpenseById = async (id: number) => {
  return await prisma.expense.delete({
    where: {
      id,
    },
  });
};

const findExpenseByIdAndSchoolId = async (id: number, schoolId: number) => {
  const existingExpense = await findExpenseById(+id);
  if (!existingExpense) {
    throw new Error('expense not found');
  }
  if (existingExpense.schoolId !== schoolId) {
    throw new Error('Unauthorized');
  }
  return existingExpense;
};

// Pagination for expenses by schoolId Example
const findExpensesBySchoolIdPagination = async (schoolId: number, page: number = 1, limit: number = 10) => {
  // Check page or limit is not negative or not zero or not a number
  if (page < 1 || limit < 1) {
    return [];
  }
  if (isNaN(page) || isNaN(limit)) {
    return [];
  }
  // Avoid Max Limit
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }
  return await prisma.expense.findMany({
    where: {
      schoolId,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
};

export {
  findExpensesBySchoolId,
  findExpenseById,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
  findAllExpenses,
  findExpensesBySchoolIdPagination,
  findExpenseByIdAndSchoolId,
};
