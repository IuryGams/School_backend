import { Prisma, User } from "@prisma/client";
import { NestedParentData, NestedStudentData, NestedTeacherData, NestedUserData } from "./nested_datas";

export interface BaseUser {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export interface StudentUser extends Prisma.UserCreateInput {
    username: string;
    role: "STUDENT";
    student?: Prisma.StudentCreateWithoutUserInput;
}

export interface TeacherUser extends BaseUser {
    role: "TEACHER";
    teacher?: NestedTeacherData;
}

// export interface CoordinatorUser extends BaseUser {
//     role: "COORDINATOR";
//     coordinator?: NestedCoordinatorData;
// }

export interface ParentUser extends BaseUser {
    role: "PARENT";
    studentIds?: number[];
    parent?: Prisma.ParentCreateWithoutUserInput;
}

export type UserType = StudentUser | TeacherUser | ParentUser;  //| CoordinatorUser;

export interface StudentUserUpdate extends Partial<BaseUser> {
    student?: Partial<NestedStudentData>;
}

export interface TeacherUserUpdate extends Partial<BaseUser> {
    teacher?: Partial<NestedTeacherData>;
}

export interface ParentUserUpdate extends Partial<BaseUser> {
    parent?: Partial<NestedParentData>;
}

export type UserUpdateData = StudentUserUpdate | TeacherUserUpdate | ParentUserUpdate;

export interface ParentWithStudents {
    parent: ParentUser;
    students: StudentUser[]
}

export interface ParentWithStudentsReply {
    parent:  User;
    students: User[]
}
