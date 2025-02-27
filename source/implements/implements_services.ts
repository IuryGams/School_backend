import { LoginRequest, Token, UserResponse } from "../Types/auth";
import { ParentWithStudents, ParentWithStudentsReply, ParentUser, StudentUser, TeacherUser, UserType, BaseUser } from "../Types/user";
import { Parent, Prisma, Student, Teacher, User } from "@prisma/client";

// Services
interface IAuthServices {
  login(auth: LoginRequest): Promise<Token>;
  decodeUser(token: string | undefined): Promise<UserResponse>
}

interface IUserServices {
  createUser<T extends UserType>(user: T, tx?: Prisma.TransactionClient): Promise<User>;
  getUserByEmail(user_email: string): Promise<User>;
  getUserById(userId: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(userId: number, data: Partial<BaseUser>): Promise<User>;
  deleteUser(userId: number): Promise<void>
}

interface IParentServices {
  createParent(parent: ParentUser, tx?: Prisma.TransactionClient): Promise<User>;
  createParentWithStudents(parentStudent: ParentWithStudents): Promise<ParentWithStudentsReply>;
  getParentById(parentId: number, includeStudents: boolean): Promise<Parent>;
  getAllParents(includeStudents: boolean): Promise<Parent[]>;
  updateParent(parentId: number, dataUpdate: Partial<ParentUser>): Promise<User>;
  deleteParent(parentId: number): Promise<void>;
}

interface IStudentServices {
  createStudent(student: Omit<StudentUser, "role">, parent_id: number, tx?: Prisma.TransactionClient): Promise<User>;
  createStudents(students: Omit<StudentUser, "role">[], parent_id: number, tx?: Prisma.TransactionClient): Promise<User[]>;
  getStudentById(studentId: number): Promise<Student>;
  getStudentByAccessCode(accessCode: string): Promise<Student>;
  getAllStudents(): Promise<Student[]>;
  updateStudent(studentId: number, data: Partial<StudentUser>): Promise<User>;
  deleteStudent(studentId: number): Promise<void>;
}

interface ITeacherServices {
  createTeacher(teacher: Omit<TeacherUser, "role">): Promise<User>;
  getTeacherById(teacherId: number): Promise<Teacher>;
  getAllTeachers(): Promise<Teacher[]>;
  updateTeacher(teacherId: number, data: Partial<TeacherUser>): Promise<User>;
  deleteTeacher(teacherId: number): Promise<void>;
}

interface ICryptoServices {
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}


export {
  IAuthServices,
  ICryptoServices,
  IUserServices,
  IParentServices,
  IStudentServices,
  ITeacherServices,
}






