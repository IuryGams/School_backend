import { $Enums } from "@prisma/client";

export enum Roles {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    COORDINATOR = "COORDINATOR"
}

export interface Credentials {
    email?: string;       // Opcional: usado para login tradicional
    password?: string;    // Opcional: usado para login tradicional
    accessCode?: string;  // Opcional: usado para login de estudante
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
  
  export interface Token {
    accessToken: string;
    user: UserResponse;
  }