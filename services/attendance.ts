import { Attendance} from '@prisma/client';
import { prisma } from '../prisma/db';

const findAttendanceById = async (id: number) => {
  return await prisma.attendance.findUnique({
    where: {
      id,
    },
  });
};

const createAttendance = async (attendance: Attendance) => {
  return await prisma.attendance.create({
    data: attendance,
  });
};

const updateAttendanceById = async (id, attendance: Attendance) => {
  return await prisma.attendance.update({
    where: {
      id,
    },
    data: attendance,
  });
};

const findAttendanceBySchoolId = async (id) => {
  return await prisma.attendance.findMany({
    where: {
      schoolId: id,
    },
  });
};

const deleteAttendanceById = async (id) => {
  return await prisma.attendance.delete({
    where: {
      id,
    },
  });
};

const getAllAttendanceOfOneStudentById = async (id) => {
  return await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      Attendance: {
        select: {
          id: true,
          date: true,
          description: true,
          attendanceType: true,
          Subject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};


export {
  getAllAttendanceOfOneStudentById,
  deleteAttendanceById,
  findAttendanceById,
  createAttendance,
  updateAttendanceById,
  findAttendanceBySchoolId,
};
