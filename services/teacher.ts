import { RoleEnumType, Student, Teacher, User } from '@prisma/client';
import { CreateTeacherInputDto } from '../interfaces';
import { prisma } from '../prisma/db';
import { createUserByEmailAndPassword, deleteUserById, findUserByEmail, updateUserById } from './user';

// Find
const findTeacherByUserId = async (userId) => {
  return await prisma.teacher.findFirst({
    where: {
      userId,
    },
  });
};

const findTeacherById = async (id: number) => {
  return await prisma.teacher.findUnique({
    where: {
      id,
    },
  });
};

const findTeacherByIdAndSchoolId = async (id: number, schoolId: number) => {
  const existingTeacher = await findTeacherById(+id);
  if (!existingTeacher) {
    throw new Error(' teacher not found ...');
  }
  if (existingTeacher.schoolId !== schoolId) {
    throw new Error('user is Un-authorized ...');
  }
  return existingTeacher;
};

const findAllTeachers = async () => {
  return await prisma.teacher.findMany();
};

const findAllTeacherBySchoolId = async (schoolId: number) => {
  const arrOfTeachers = await prisma.teacher.findMany({
    where: {
      schoolId,
    },
  });

  if (!arrOfTeachers) {
    throw new Error('Student not found ...');
  }
  return arrOfTeachers;
};

// update
const updateTeacherData = async (id, teacher: Teacher) => {
  return await prisma.teacher.update({
    where: {
      id,
    },
    data: teacher,
  });
};

const updateTeacherByIdAndSchoolId = async (id, teacherDataInput: CreateTeacherInputDto, schoolId: number) => {
  await findTeacherByIdAndSchoolId(+id, +schoolId); // call function to check if teacher not found, it will throw error from : findTeacherByIdAndSchoolId()
  const email = teacherDataInput.email;
  const existingTeacher = await findTeacherById(+id);
  const existingEmail = await findUserByEmail(email);

  if (existingEmail && existingTeacher.email !== teacherDataInput.email) {
    throw new Error('Email already in used ...');
  }
  // update
  const newUserData = {
    email: teacherDataInput.email,
    password: teacherDataInput.password,
  } as User;
  const userId = existingTeacher.userId;
  const newUser = await updateUserById(+userId, newUserData);

  // update
  const newStdData = {
    firstname: teacherDataInput.firstname,
    lastname: teacherDataInput.lastname,
    gender: teacherDataInput.gender,
    email: newUser.email,
    phone: teacherDataInput.phone,
    address: teacherDataInput.address,
  } as Teacher;
  return await updateTeacherData(+id, newStdData);
};

// Create
const createTeacherData = async (teacher: Teacher) => {
  return await prisma.teacher.create({
    data: teacher,
  });
};

const createTeacherBySchoolId = async (schoolId: number, teacherDataInput: CreateTeacherInputDto) => {
  const existingEmail = await findUserByEmail(teacherDataInput.email);
  if (existingEmail) {
    throw new Error('Email is already in used.');
  }
  // creaete user
  const userData = {
    email: teacherDataInput.email,
    password: teacherDataInput.password,
    role: RoleEnumType.teacher,
    schoolId: schoolId,
  } as User;
  const user = await createUserByEmailAndPassword(userData);

  // create student
  const teacherData = {
    firstname: teacherDataInput.firstname,
    lastname: teacherDataInput.lastname,
    gender: teacherDataInput.gender,
    email: user.email,
    phone: teacherDataInput.phone,
    address: teacherDataInput.address,
    schoolId: user.schoolId,
    userId: user.id,
  } as Student;
  return await createTeacherData(teacherData);
};

// Delete
const deleteTeacherData = async (id: number) => {
  return await prisma.teacher.delete({
    where: {
      id,
    },
  });
};

const deleteTeacherByIdAndSchoolId = async (id: number, schoolId: number) => {
  const teacher = await findTeacherByIdAndSchoolId(+id, schoolId);
  const userId = teacher.userId;
  // delete user --> Teacher also delete
  await deleteUserById(+userId);
  return teacher;
};

export {
  findTeacherById,
  createTeacherData,
  findAllTeachers,
  updateTeacherData,
  deleteTeacherData,
  findTeacherByUserId,
  createTeacherBySchoolId,
  findAllTeacherBySchoolId,
  findTeacherByIdAndSchoolId,
  updateTeacherByIdAndSchoolId,
  deleteTeacherByIdAndSchoolId,
};
