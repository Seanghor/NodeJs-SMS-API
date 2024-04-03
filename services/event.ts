import { Event } from '@prisma/client';
import { prisma } from '../prisma/db';

const findEventById = async (id: number) => {
  return await prisma.event.findUnique({
    where: {
      id,
    },
  });
};

const findAllEvents = async () => {
  return await prisma.event.findMany();
};

const findEventByTeacherId = async (teacherId: number) => {
  return await prisma.event.findMany({
    where: {
      teacherId,
    },
  });
};

const findEventByStudentId = async (studentId: number) => {
  return await prisma.event.findMany({
    where: {
      studentId,
    },
  });
};

const createEvent = async (event: Event) => {
  return await prisma.event.create({
    data: event,
  });
};

const updateEvent = async (event: Event) => {
  await prisma.event.update({
    where: {
      id: event.id,
    },
    data: event,
  });
};

const deleteEventById = async (id: number) => {
  return await prisma.event.delete({
    where: {
      id,
    },
  });
};

export { findEventById, findEventByTeacherId, findEventByStudentId, findAllEvents, createEvent, updateEvent, deleteEventById };
