export type NestedParentData = {
    create: {};
};

export type NestedTeacherData = {
    create: {};
};

// export type NestedCoordinatorData = {
//     create: {};
// };

export type NestedStudentData = {
    create: {
        accessCode: string;
        username: string;
        parentId: number;
        isActive?: boolean;
    };
};

export type NestedUserData = NestedStudentData | NestedTeacherData | NestedParentData;