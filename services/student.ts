import { prisma } from '../prisma/db';
import { RoleEnumType, Student, User } from '@prisma/client';
import { createUserByEmailAndPassword, deleteUserById, findUserByEmail, updateUserById } from './user';
import { CreateStudentInputDto } from '../interfaces';

// create
const createStudent = async (schoolId: number, studentDataInput: CreateStudentInputDto) => {
  const email = studentDataInput.email;
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new Error('Email is already in used.');
  }
  // create user
  const userData = {
    email: studentDataInput.email,
    password: studentDataInput.password,
    role: RoleEnumType.student,
    schoolId: schoolId,
  } as User;
  const user = await createUserByEmailAndPassword(userData);

  // create student
  const studentData = {
    firstname: studentDataInput.firstname,
    lastname: studentDataInput.lastname,
    gender: studentDataInput.gender,
    email: studentDataInput.email,
    phone: studentDataInput.phone,
    address: studentDataInput.address,
    schoolId: user.schoolId,
    userId: user.id,
  } as Student;
  return await prisma.student.create({
    data: studentData,
  });
};

// update
const updateStudentData = async (id, student: Student) => {
  return await prisma.student.update({
    where: {
      id,
    },
    data: student,
  });
};

// find
const findAllStudents = async () => {
  return await prisma.student.findMany();
};

const findStudentsBySchoolId = async (schoolId: number) => {
  return await prisma.student.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      firstname: 'asc',
    },
  });
};

const findStudentById = async (id: number) => {
  return await prisma.student.findUnique({
    where: {
      id,
    },
  });
};

const findStudentByIdAndSchoolId = async (id: number, schoolId: number) => {
  const existingStudent = await findStudentById(+id);
  if (!existingStudent) {
    throw new Error('student not found ...');
  }
  if (existingStudent.schoolId !== schoolId) {
    throw new Error('user is Un-authorized ...');
  }
  return existingStudent;
};

const findStudentByEmail = async (email: string) => {
  return await prisma.student.findUnique({
    where: {
      email,
    },
  });
};

const findStudentByUserId = async (userId: number) => {
  return await prisma.student.findFirst({
    where: {
      userId,
    },
  });
};

const findStudentsOfOneTeacher = async (teacherId: number, schoolId: number) => {
  const studentAttendances = await prisma.attendance.findMany({
    where: {
      AND: [{ teacherId }, { schoolId }],
    },
    distinct: ['studentId'],
    orderBy: {
      Student: { firstname: 'asc' },
    },
    select: {
      Student: true,
    },
  });
  const allStudentsOfTeacher: Partial<Student>[] = [];
  studentAttendances.forEach((data) => {
    allStudentsOfTeacher.push(data.Student);
  });

  return allStudentsOfTeacher;
};

const deleteStudentById = async (id: number) => {
  return await prisma.student.delete({
    where: {
      id,
    },
  });
};

// update user and student
const updateStudentByIdAndSchoolId = async (id, schoolId: number, studentDataInput: CreateStudentInputDto) => {
  await findStudentByIdAndSchoolId(id, schoolId);
  const email = studentDataInput.email;
  const existingStudent = await findStudentById(+id);
  const existingEmail = await findUserByEmail(email);

  if (existingEmail && existingStudent.email !== email) {
    throw new Error('Email already in used ...');
  }
  // update User
  const newUserData = {
    email: studentDataInput.email,
    password: studentDataInput.password,
  } as User;
  const userId = existingStudent.userId;
  const newUser = await updateUserById(+userId, newUserData);

  // update student
  const newStdData = {
    firstname: studentDataInput.firstname,
    lastname: studentDataInput.lastname,
    gender: studentDataInput.gender,
    email: newUser.email,
    phone: studentDataInput.phone,
    address: studentDataInput.address,
  } as Student;

  return await updateStudentData(+id, newStdData);
};

const deleteStudentByIdAndSchoolId = async (id, schoolId: number) => {
  const student = await findStudentByIdAndSchoolId(+id, schoolId);
  const userId = student.userId;
  // delete user --> student also delete
  await deleteUserById(+userId);
  return student;
};

export {
  createStudent,
  updateStudentData,
  findAllStudents,
  findStudentById,
  findStudentByEmail,
  updateStudentByIdAndSchoolId,
  deleteStudentById,
  findStudentByUserId,
  findStudentsBySchoolId,
  findStudentByIdAndSchoolId,
  deleteStudentByIdAndSchoolId,
  findStudentsOfOneTeacher,
};
