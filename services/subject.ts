import { TeacherSubject } from './../interfaces/index.d';
import { Subject } from '@prisma/client';
import { prisma } from '../prisma/db';
import { findClassById } from './class';
import { findTeacherById } from './teacher';

// -- find
const findAllSubjects = async () => {
  return await prisma.subject.findMany();
};

const findSubjectById = async (id: number) => {
  return await prisma.subject.findUnique({
    where: {
      id,
    },
  });
};

const findSubjectByName = async (name: string) => {
  return await prisma.subject.findMany({
    where: {
      name,
    },
  });
};

const findSubjectsBySchoolId = async (schoolId: number) => {
  return await prisma.subject.findMany({
    where: {
      schoolId,
    },
    include: {
      Class: {
        select: {
          schoolId: true,
        },
      },
      Teacher: {
        select: {
          schoolId: true,
        },
      },
    },
  });
};

const findSubjectByIdClassIdTeacherIdAndSchoolId = async (id, classId:number, teacherId:number, schoolId:number) => {

  // check subjectId input
  const existingSubject = await findSubjectById(+id);
  if (!existingSubject) {
    throw new Error('Bad request, subject not found ...');
  }
  if (existingSubject.schoolId !== schoolId) {
    throw new Error('Un-Authorized');
  }

  // check classId input
  const classD = await findClassById(+classId)
  if (!classD) {
    throw new Error('Bad request, class not found ...');
  }
  if (classD.schoolId !== schoolId) {
    throw new Error('Un-Authorized(ClassId)');
  }

  // check teacherId input
  const teacher = await findTeacherById(+teacherId)
  if (!teacher) {
    throw new Error('Bad request, teacher not found ...');
  }
  if (teacher.schoolId !== schoolId) {
    throw new Error('Un-Authorized(TeacherId)');
  }
  return existingSubject
};


const findAllSubjectOfTeacherIdByTeacherIdAndSchoolId = async (teacherId: number, schoolId: number) => {
  const data = await prisma.subject.findMany({
    where: {
      AND: [{ teacherId }, { schoolId }],
    },
    select: {
      Class: {
        select: {
          name: true,
        },
      },
      code: true,
      name: true,
      id: true,
    },
  });
  const teacherSubjects: TeacherSubject[] = [];
  data.forEach((d) => {
    teacherSubjects.push({
      className: d.Class.name,
      name: d.name,
      id: d.id,
      code: d.code,
    });
  });
  return teacherSubjects;
};

// -- create
const createSubjectData = async (subject: Subject) => {
  return await prisma.subject.create({
    data: subject,
  });
};

const createSubjectBySchool = async (subject: Subject, schoolId: number) => {
  const teacherId = subject.teacherId;
  const curTeacher = await findTeacherById(+teacherId);
  if (!curTeacher) {
    throw new Error('Bad request, teacher not found ...');
  }
  if (curTeacher.schoolId !== schoolId) {
    throw new Error('Bad request, teacherId found but not belong to our school ...');
  }

  const classId = subject.classId;
  const curClass = await findClassById(+classId);
  if (!curClass) {
    throw new Error('Bad request, class not found ...');
  }
  if (curClass.schoolId !== schoolId) {
    throw new Error('Bad request, classId found but not belong to our school ...');
  }

  const subjectName = subject.name;
  const subOfSchool = await prisma.subject.findMany({
    where: {
      AND: [{ teacherId }, { classId }, { schoolId: schoolId }],
    },
  });

  const existingNameSub = subOfSchool.find((subjectData) => subjectData.name === subjectName);
  if (existingNameSub) {
    throw new Error('Bad request, Subject already exist ...)');
  }
  return await createSubjectData(subject);
};

// -- update
const updateSubjectByIdAndSchoolId = async (id, schoolId: number, subject:Subject) => {
  const teacherId = subject.teacherId
  const classId = subject.classId
  await findSubjectByIdClassIdTeacherIdAndSchoolId(id, classId, teacherId, schoolId)

  // check subject cant have same for 3 properties(name, classId, teacherId)
  const subjectName = subject.name
  const subOfSchool = await prisma.subject.findMany({
    where: {
      AND: [{ teacherId }, { classId }, { schoolId: schoolId }],
    },
  });
  const existingNameSub = subOfSchool.find((subjectData) => subjectData.name === subjectName);
  if (existingNameSub) {
    throw new Error('Bad request, Subject already exist ...)');
  }

  return await updateSubjectById(+id, subject)
}

const updateSubjectById = async (id: number, subject: Subject) => {
  return await prisma.subject.update({
    where: {
      id,
    },
    data: subject,
  });
};



// -- delete
const deleteSubjectData = async (id: number) => {
  return await prisma.subject.delete({
    where: {
      id,
    },
  });
};

const deleteSubjectByIdAndSchoolId = async (id, schoolId:number) => {
  const existingSubject = await findSubjectById(+id)
  if (!existingSubject) {
    throw new Error("Bad request, subject not found ...")
  }
  if (existingSubject.schoolId !== schoolId) {
    throw new Error("Un-Authorized ")
  }
  return await deleteSubjectData(+id)
}

export {
  findSubjectById,
  findSubjectByName,
  findAllSubjects,
  findSubjectsBySchoolId,
  findAllSubjectOfTeacherIdByTeacherIdAndSchoolId,
  findSubjectByIdClassIdTeacherIdAndSchoolId,
  createSubjectData,
  createSubjectBySchool,
  updateSubjectById,
  updateSubjectByIdAndSchoolId,
  deleteSubjectData,
  deleteSubjectByIdAndSchoolId
  
};
