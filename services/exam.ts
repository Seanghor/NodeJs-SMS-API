import { Exam } from '@prisma/client';
import { SchoolExam, StudentExam } from '../interfaces';
import { prisma } from '../prisma/db';
import { findSubjectById } from './subject';

// find
const findExamById = async (id: number) => {
  return await prisma.exam.findUnique({
    where: {
      id,
    },
  });
};

const findAllExams = async () => {
  return await prisma.exam.findMany();
};

const findAllExamBySchoolId = async (schoolId: number) => {
  const allExam = await prisma.exam.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      subject: {
        id: 'asc',
      },
    },
    include: {
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const examsOfSchool: SchoolExam[] = [];
  allExam.forEach((data) => {
    examsOfSchool.push({
      id: data.id,
      name: data.name,
      date: data.date,
      subject: data.subject.name,
    });
  });
  // console.log(allExam);
  return examsOfSchool;
};

const findExamByIdAndSchoolId = async (id: number, schoolId: number) => {
  const curExam = await findExamById(+id);
  if (!curExam) {
    throw new Error('Bad request, exam not found ...');
  }
  if (curExam.schoolId !== schoolId) {
    throw new Error('Un-Authorized');
  }
  return curExam;
};

const findExamByIdSubjectIdAndSchoolId = async (id, subjectId: number, schoolId: number) => {
  const existingExam = await findExamById(+id);
  if (!existingExam) {
    throw new Error('Bad request, exam not found ...');
  }

  const existingSubject = await findSubjectById(+subjectId);
  if (!existingSubject) {
    throw new Error('Bad request, subject not found');
  }
  if (existingSubject.schoolId !== schoolId || existingExam.schoolId !== schoolId) {
    throw new Error('User is Un-Authorized');
  }
  return existingExam;
};

const findAllExamOfStudent = async (studentId: number, schoolId: number) => {
  const allResults = await prisma.result.findMany({
    where: {
      AND: [{ schoolId }, { studentId }],
    },
    select: {
      id: true,
      mark: true,
      schoolId: true,
      studentId: true,
      exam: {
        select: {
          id: true,
          name: true,
          date: true,
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
  const studentExam: StudentExam[] = [];
  allResults.forEach((data) => {
    studentExam.push({
      id: data.id,
      date: data.exam.date,
      subject: data.exam.subject.name,
      mark: data.mark,
    });
  });
  return studentExam;
};

const deleteExamData = async (id) => {
  return await prisma.exam.delete({
    where: {
      id,
    },
  });
};

const deleteExamByIdAndSchoolId = async (id: number, schoolId: number) => {
  const curExam = await findExamById(+id);
  if (!curExam) {
    throw new Error('Bad request, exam not found ...');
  }
  if (curExam.schoolId !== schoolId) {
    throw new Error('Un-Authorized');
  }
  return await deleteExamData(+id);
};

const updateExamData = async (id, exam: Exam) => {
  return await prisma.exam.update({
    where: {
      id,
    },
    data: exam,
  });
};

const updateExamByIdAndSchoolId = async (id, schoolId: number, exam: Exam) => {
  const subjectId = exam.subjectId;
  await findExamByIdSubjectIdAndSchoolId(+id, +subjectId, +schoolId);
  const examData = {
    name: exam.name,
    date: exam.date,
    subjectId: exam.subjectId,
  } as Exam;
  return await updateExamData(+id, examData);
};

// create
const createExamData = async (exam: Exam) => {
  return await prisma.exam.create({
    data: exam,
  });
};
const createExam = async (exam: Exam) => {
  const findSubject = await findSubjectById(+exam.subjectId);
  if (!findSubject) {
    throw new Error('❗️Bad request, subjectId not found ...');
  }
  if (findSubject.schoolId !== exam.schoolId) {
    throw new Error('Un-Authorized(cant assign this subject) ...');
  }
  return await createExamData(exam);
};

export {
  findExamById,
  findAllExams,
  findAllExamBySchoolId,
  findExamByIdAndSchoolId,
  findAllExamOfStudent,
  createExamData,
  createExam,
  deleteExamByIdAndSchoolId,
  deleteExamData,
  updateExamByIdAndSchoolId,
  updateExamData,
};
