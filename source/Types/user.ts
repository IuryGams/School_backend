import { $Enums, Parent, Student, User } from "@prisma/client";
import { NestedParentData, NestedStudentData, NestedTeacherData, NestedUserData } from "./nested_datas";

export interface BaseUser {
    name: string;
    email: string;
    password: string;
}

export interface StudentUser extends BaseUser {
    role: "STUDENT";
    student?: NestedStudentData;
}

export interface TeacherUser extends BaseUser {
    role: "TEACHER";
    teacher?: NestedTeacherData;
}

export interface ParentUser extends BaseUser {
    role: "PARENT";
    studentIds?: number[];
    parent?: NestedParentData;
}

export type UserType = StudentUser | TeacherUser | ParentUser;

export interface ParentWithStudents {
    parent: ParentUser;
    students: StudentUser[]
}

export interface ParentWithStudentsReply {
    parent:  User;
    students: User[]
}
