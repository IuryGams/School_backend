import { Prisma, User } from "@prisma/client";

export interface BaseUser {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export interface BaseOptionsUser extends Prisma.UserInclude {
    tx?: Prisma.UserDelegate
}

export interface StudentUser extends BaseUser {
    username: string;
    role: "STUDENT";
    student?: Prisma.StudentCreateWithoutUserInput;
}

export interface TeacherUser extends BaseUser {
    role: "TEACHER";
    teacher?: Prisma.TeacherCreateWithoutUserInput;
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


export interface ParentWithStudents {
    parent: ParentUser;
    students: StudentUser[]
}

export interface ParentWithStudentsReply {
    parent:  User;
    students: User[]
}
