import { Credentials, Token, UserResponse } from "../@Types/auth";
import { ParentWithStudents, ParentWithStudentsReply, ParentUser, StudentUser, TeacherUser, BaseUser, BaseOptionsUser, ParentExtend } from "../@Types/user";
import { Parent, Prisma, Student, Teacher, Tuition, User } from "@prisma/client";

// Services
interface IAuthServices {
  login(auth: Credentials): Promise<Token>;
  decodeUser(token: string | undefined): Promise<UserResponse>
}

interface IUserServices {
  createUser(user: Prisma.UserCreateInput, options?: BaseOptionsUser): Promise<User | ParentExtend>;
  getUserByEmail(user_email: string): Promise<User | null>;
  getUserById(userId: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(userId: number, data: Partial<BaseUser>): Promise<User>;
  deleteUser(userId: number): Promise<void>
}

interface IParentServices {
  createParent(parent: ParentUser, tx?: Prisma.UserDelegate): Promise<ParentExtend>;
  createParentWithStudents(parentStudent: ParentWithStudents): Promise<ParentWithStudentsReply>;
  getParentById(parentId: number, includeStudents: boolean): Promise<Parent>;
  getAllParents(includeStudents: boolean): Promise<Parent[]>;
  updateParent(parentId: number, dataUpdate: Partial<ParentUser>): Promise<User>;
  deleteParent(parentId: number): Promise<void>;
}

interface IStudentServices {
  generateUsername(name: string, lastName: string): string;
  createUniqueAccessCode(): Promise<string>;
  createStudent(student: Omit<StudentUser, "role">, parent_id: number, tx?: Prisma.UserDelegate): Promise<User>;
  createStudents(students: Omit<StudentUser, "role">[], parent_id: number, tx?: Prisma.UserDelegate): Promise<User[]>;
  getStudentById(studentId: number): Promise<Student>;
  getStudentByAccessCode(accessCode: string): Promise<Student>;
  getAllStudents(): Promise<Student[]>;
  updateStudent(studentId: number, data: Partial<StudentUser>): Promise<User>;
}

interface ITeacherServices {
  createTeacher(teacher: Omit<TeacherUser, "role">): Promise<User>;
  getTeacherById(teacherId: number): Promise<Teacher>;
  getAllTeachers(): Promise<Teacher[]>;
  updateTeacher(teacherId: number, data: Partial<TeacherUser>): Promise<User>;
}

interface ICryptoServices {
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}

interface ITuitionServices {
    createTuition(tuition: Omit<Tuition, "id" | "createdAt" | "updatedAt">, parentId: number): Promise<Tuition>;
    getAllTuitions(): Promise<Tuition[]>;
    getTuitionsByParentEmail(parentEmail: string): Promise<Tuition[]>
    updateLateFees(): Promise<Tuition[]>
}


export {
  IAuthServices,
  ICryptoServices,
  IUserServices,
  IParentServices,
  IStudentServices,
  ITeacherServices,
  ITuitionServices
}






