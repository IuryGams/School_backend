export type NestedParentData = {
    create: {};
};

export type NestedTeacherData = {
    create: {};
};

export type NestedStudentData = {
    create: {
        accessCode: string;
        parentId: number;
        isActive?: boolean;
    };
};

export type NestedUserData = NestedStudentData | NestedTeacherData | NestedParentData;