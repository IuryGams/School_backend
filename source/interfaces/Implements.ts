import { NextFunction, Request, Response } from "express";
import { LoginRequest, Token, UserResponse } from "../Types/auth";
import { ParentWithStudents, ParentWithStudentsReply, ParentUser, StudentUser, TeacherUser, UserType, BaseUser } from "../Types/user";
import { Prisma, User } from "@prisma/client";
import { NestedUserData } from "../Types/nested_datas";

// Controllers

export interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>
  getInformationUser(req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IParentController {
  createParent(req: Request, res: Response, next: NextFunction): Promise<void>;
  createParentWithStudents(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export interface IStudentController {
  createStudent(req: Request, res: Response, next: NextFunction): Promise<void>
}


// Services
export interface IAuthServices {
  login(auth: LoginRequest): Promise<Token>;
  decodeUser(token: string | undefined): Promise<UserResponse>
}

export interface IUserServices {
  createUser<T extends UserType>(user: T, tx?: Prisma.TransactionClient): Promise<User>;
  getUserByEmail(email: string): Promise<BaseUser>;
}

export interface IParentServices {
  createParent(parent: ParentUser, tx?: Prisma.TransactionClient): Promise<User>
  createParentWithStudents(parentStudent: ParentWithStudents): Promise<ParentWithStudentsReply>;
}

export interface IStudentServices {
  createStudent(student: StudentUser, parent_id: number, tx?: Prisma.TransactionClient): Promise<User>;
  createStudents(students: Omit<StudentUser, "role">[], parent_id: number, tx?: Prisma.TransactionClient): Promise<User[]>;
}

export interface ITeacherServices {
  createTeacher(teacher: TeacherUser): Promise<User>
}




export interface ICryptoServices {
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}







