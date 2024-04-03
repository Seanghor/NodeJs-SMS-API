import { Payment } from '@prisma/client';
import { prisma } from '../prisma/db';

const findPaymentById = async (id: number) => {
  return await prisma.payment.findUnique({
    where: {
      id,
    },
  });
};

const findAllPayments = async () => {
  return await prisma.payment.findMany();
};

const createPayment = async (payment: Payment) => {
  return await prisma.payment.create({
    data: payment,
  });
};

const updatePaymentById = async (id: number, payment: Payment) => {
  return await prisma.payment.update({
    where: {
      id,
    },
    data: payment,
  });
};

const deletePaymentById = async (id: number) => {
  return await prisma.payment.delete({
    where: {
      id,
    },
  });
};

const findPaymentsBySchoolId = async (schoolId: number) => {
  return await prisma.payment.findMany({
    where: {
      schoolId,
    },
  });
};

const findPaymentByIdAndSchoolId = async (id: number, schoolId: number) => {
  return await prisma.payment.findFirst({
    where: {
      AND: [{ id }, { schoolId }],
    },
    include: {
      Student: true,
      Teacher: true,
    },
  });
};

export {
  findPaymentById,
  findAllPayments,
  createPayment,
  updatePaymentById,
  deletePaymentById,
  findPaymentsBySchoolId,
  findPaymentByIdAndSchoolId,
};
