import { $Enums } from "@prisma/client";

export enum Roles {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    COORDINATOR = "COORDINATOR"
}

export interface Credentials {
    email?: string;      
    password?: string;   
    accessCode?: string;
}

export interface Token {
    accessToken: string;
    user: UserResponse;
}

export interface TokenParams {
    id: string;
    email: string;
    role: Roles;
    iat: number;
    exp: number;
}

export interface UserResponse {
    name: string;
    email: string;
    role: Roles | $Enums.Roles;
}