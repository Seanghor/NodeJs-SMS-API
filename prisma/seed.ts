// Seed data to be used in development
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const superAdminschool = await prisma.school.create({
    data: {
      id: 0,
      name: 'Super School of Code',
      email: 'school@email.com',
      address: 'London',
    },
  });
  console.table({ superAdminschool });

  const user = await prisma.user.create({
    data: {
      schoolId: superAdminschool.id,
      email: superAdminschool.email,
      password: await hash('password', 12),
      role: 'admin',
    },
  });
  console.table({ user });

  for (let i = 1; i < 3; i++) {
    const school = await prisma.school.create({
      data: {
        name: `School of Code ${i}`,
        email: `school${i}@email.com`,
        address: 'London',
      },
    });
    const user = await prisma.user.create({
      data: {
        schoolId: school.id,
        email: school.email,
        password: await hash('password', 12),
        role: 'admin',
      },
    });
    console.table({ school });

    // Create 30 students
    for (let j = 1; j < 16; j++) {
      //   Create student User
      let gender;
      if (j % 2 == 0) {
        gender = 'female';
      } else {
        gender = 'male';
      }
      if (i == 1) {
        const studentUser = await prisma.user.create({
          data: {
            schoolId: school.id,
            email: `student${j}@sms.com`,
            password: await hash('password', 12),
            role: 'student',
          },
        });
        console.table({ studentUser });

        const student = await prisma.student.create({
          data: {
            schoolId: school.id,
            firstname: `Student${j}`,
            lastname: `Name${j}`,
            gender: gender,
            email: studentUser.email,
            address: 'London',
            phone: '020 1234 5678',
            userId: studentUser.id,
          },
        });
        console.table({ student });
      } else if (i == 2) {
        const studentUser = await prisma.user.create({
          data: {
            schoolId: school.id,
            email: `student${j + 15}@sms.com`,
            password: await hash('password', 12),
            role: 'student',
          },
        });
        console.table({ studentUser });

        const student = await prisma.student.create({
          data: {
            schoolId: school.id,
            firstname: `Student${j + 15}`,
            lastname: `Name${j + 15}`,
            gender: gender,
            email: studentUser.email,
            address: 'London',
            phone: '020 1234 5678',
            userId: studentUser.id,
          },
        });
        console.table({ student });
      }
    }
    //   Create 10 teachers
    for (let j = 1; j < 6; j++) {
      let gender;
      if (i % 2 == 0) {
        gender = 'male';
      } else {
        gender = 'female';
      }
      if (i == 1) {
        // Create 5 user teacher
        const teacherUser = await prisma.user.create({
          data: {
            schoolId: school.id,
            email: `teacher${j}@sms.com`,
            password: await hash('password', 12),
            role: 'teacher',
          },
        });
        const teacher = await prisma.teacher.create({
          data: {
            schoolId: school.id,
            firstname: `Teacher${j}`,
            lastname: `name${j}`,
            gender: gender,
            email: teacherUser.email,
            address: 'London',
            phone: '020 1234 5678',
            userId: teacherUser.id,
          },
        });

        console.table({ teacher });
      } else if (i == 2) {
        // Create 5 user teacher
        const teacherUser = await prisma.user.create({
          data: {
            schoolId: school.id,
            email: `teacher${j + 5}@sms.com`,
            password: await hash('password', 12),
            role: 'teacher',
          },
        });
        const teacher = await prisma.teacher.create({
          data: {
            schoolId: school.id,
            firstname: `Teacher${j + 5}`,
            lastname: `name${j + 5}`,
            gender: gender,
            email: teacherUser.email,
            address: 'London',
            phone: '020 1234 5678',
            userId: teacherUser.id,
          },
        });
        console.table({ teacher });
      }
    }
    //   Create 8 Classes: 4 * 2= 8
    for (let j = 1; j < 5; j++) {
      if (i == 1) {
        const classD = await prisma.class.create({
          data: {
            schoolId: school.id,
            name: `Class ${j}`,
            description: `Descriptiopn ${j}`,
          },
        });
        console.table({ classD });
        //   Create 4 subjects
        const subject = await prisma.subject.create({
          data: {
            schoolId: school.id,
            name: `Subject ${j}`,
            code: `SUB_${j}`,
            classId: classD.id,
            teacherId: (await Math.floor(Math.random() * (5 - 1))) + 1,
          },
        });
        console.table({ subject });
        //   Create 4 Exams
        const exam = await prisma.exam.create({
          data: {
            schoolId: school.id,
            name: `Exam ${j}`,
            date: new Date(),
            subjectId: subject.id,
          },
        });
        console.table({ exam });
      } else if (i == 2) {
        const classD = await prisma.class.create({
          data: {
            schoolId: school.id,
            name: `Class ${j + 4}`,
            description: `Descriptiopn ${j + 4}`,
          },
        });
        console.table({ classD });
        //   Create 4 subjects
        const subject = await prisma.subject.create({
          data: {
            schoolId: school.id,
            name: `Subject ${j + 4}`,
            code: `SUB_${j + 4}`,
            classId: classD.id,
            teacherId: (await Math.floor(Math.random() * (10 - 6))) + 1 + 4,
          },
        });
        console.table({ subject });
        //   Create 4 Exams
        const exam = await prisma.exam.create({
          data: {
            schoolId: school.id,
            name: `Exam ${j + 4}`,
            date: new Date(),
            subjectId: subject.id,
          },
        });
        console.table({ exam });
      }
      //   Create 6 results : 3*2=6
      for (let j = 1; j < 4; j++) {
        if (i == 1) {
          const result = await prisma.result.create({
            data: {
              schoolId: school.id,
              studentId: j,
              examId: 1,
              mark: Math.random() * 100,
            },
          });
          console.table({ result });
        } else if (i == 2) {
          const result = await prisma.result.create({
            data: {
              schoolId: school.id,
              studentId: j,
              examId: 5,
              mark: Math.random() * 100,
            },
          });
          console.table({ result });
        }
      }
    }
    //   Create 30 attendance
    for (let j = 1; j < 16; j++) {
      const rndInt = Math.floor(Math.random() * 3) + 1;
      let att;
      if (rndInt == 1) {
        att = 'present';
      } else if (rndInt == 2) {
        att = 'absent';
      } else {
        att = 'leave';
      }

      if (i == 1) {
        const attendance = await prisma.attendance.create({
          data: {
            schoolId: school.id,
            date: new Date(),
            studentId: j,
            attendanceType: att,
            description: 'N/A',
            subjectId: 3,
            teacherId: 1,
          },
        });
        console.table({ attendance });
      } else if (i == 2) {
        const attendance = await prisma.attendance.create({
          data: {
            schoolId: school.id,
            date: new Date(),
            studentId: j + 15,
            attendanceType: att,
            description: 'N/A',
            subjectId: (await Math.floor(Math.random() * (8 - 5))) + 1,
            teacherId: (await Math.floor(Math.random() * (10 - 6))) + 1,
          },
        });
        console.table({ attendance });
      }
    }

    // Create 20 Notices
    for (let j = 1; j < 11; j++) {
      if (i == 1) {
        const notice = await prisma.notice.create({
          data: {
            schoolId: school.id,
            title: `Notice ${j}`,
            date: new Date(),
            details: `Notice ${j} details`,
          },
        });
        console.table({ notice });
      } else if (i == 2) {
        const notice = await prisma.notice.create({
          data: {
            schoolId: school.id,
            title: `Notice ${j + 10}`,
            date: new Date(),
            details: `Notice ${j + 10} details`,
          },
        });
        console.table({ notice });
      }
    }
    // create 6 message
    for (let j = 1; j < 4; j++) {
      if (i == 1) {
        const message = await prisma.message.create({
          data: {
            schoolId: school.id,
            name: `Message ${j}`,
            email: `email${j}@mail.com`,
            message: `Message ${j} message`,
            phone: `020 123 456${j}`,
          },
        });
        console.table({ message });
      } else if (i == 2) {
        const message = await prisma.message.create({
          data: {
            schoolId: school.id,
            name: `Message ${j + 3}`,
            email: `email${i + 3}@mail.com`,
            message: `Message ${i + 3} message`,
            phone: `020 123 456${j + 3}`,
          },
        });
        console.table({ message });
      }
    }
    // Create 6 Setting
    for (let j = 1; j < 4; j++) {
      if (i == 1) {
        const setting = await prisma.setting.create({
          data: {
            schoolId: school.id,
            name: `Setting ${j}`,
            value: `Setting ${j} value`,
          },
        });
        console.table({ setting });
      } else if (i == 2) {
        const setting = await prisma.setting.create({
          data: {
            schoolId: school.id,
            name: `Setting ${j + 3}`,
            value: `Setting ${j + 3} value`,
          },
        });
        console.table({ setting });
      }
    }
    // Create 30 Payment for each school
    for (let j = 1; j < 31; j++) {
      const payment = await prisma.payment.create({
        data: {
          schoolId: school.id,
          studentId: j <= 15 ? Math.floor(Math.random() * 5) + 1 : null,
          teacherId: j > 15 ? Math.floor(Math.random() * 5) + 1 : null,
          amount: Math.random() * 1000,
          date: new Date(),
          description: `Payment ${j > 15 ? 'Teacher' : 'Student'} description (Currency $)`,
        },
      });
      console.table({ payment });
    }
    // Create 30 Expenses for each school
    for (let j = 1; j < 31; j++) {
      const expense = await prisma.expense.create({
        data: {
          schoolId: school.id,
          amount: Math.random() * 1000,
          date: new Date(),
          description: `Expense description ${j > 15 ? 'Salary' : 'Event Internal'} (Currency $)`,
          name: `${j > 15 ? 'Salary' : 'Expense Internal'} ${j}`,
          other: `Expense ${j} other`,
          studentId: i == 1 ? (j <= 15 ? Math.floor(Math.random() * 5) + 1 : null) : j <= 15 ? Math.floor(Math.random() * 4) + 5 : null,
          teacherId: i == 1 ? (j > 15 ? Math.floor(Math.random() * 5) + 1 : null) : j > 15 ? Math.floor(Math.random() * 4) + 5 : null,
          type: j <= 15 ? 'card' : 'card',
        },
      });
      console.table({ expense });
    }

    // Create 100 Events
    for (let j = 1; j < 100; j++) {
      const event = await prisma.event.create({
        data: {
          studentId: i == 1 ? (j <= 50 ? Math.floor(Math.random() * 5) + 1 : null) : j <= 50 ? Math.floor(Math.random() * 4) + 5 : null,
          subjectId: Math.floor(Math.random() * 4) + 1,
          teacherId: i == 1 ? (j > 50 ? Math.floor(Math.random() * 5) + 1 : null) : j > 50 ? Math.floor(Math.random() * 4) + 5 : null,
          schoolId: school.id,
          title: `Time Table Event ${i}`,
          // random date
          start: new Date(new Date().getTime() + Math.random() * 24 * 60 * 60 * 1000),
          end: new Date(new Date().getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000),
          allDay: true,
        },
      });
      console.table({ event });
    }
  }
}

main();
