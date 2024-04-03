import { GenderEnumType } from '@prisma/client';
// import { Request } from 'express';

export interface TokenPayload {
  exp: number;
  email: string;
  role: string;
  userId: number;
  schoolId: number;
  jti?: string;
}
declare global {
  namespace Express {
    interface Request {
      payload: TokenPayload;
    }
  }
}

export interface CreateStudentInputDto {
  firstname: string;
  lastname: string;
  email: string;
  gender: GenderEnumType;
  phone: string;
  address: string;
  password: string;
}

export interface CreateTeacherInputDto {
  firstname: string;
  lastname: string;
  email: string;
  gender: GenderEnumType;
  phone: string;
  address: string;
  password: string;
}

export interface StudentAttendance {
  subject: string;
  total: number;
  present: number;
  absent: number;
  leave: number;
}

export interface TeacherSubject {
  id: number;
  className: string;
  name: string;
  code: string;
}

export interface StudentExam {
  id: number;
  date: Date;
  subject: string;
  mark: Float;
}

export interface SchoolExam {
  id: number;
  name: string;
  date: Date;
  subject: string;
}
