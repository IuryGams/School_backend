import { Request, Response, NextFunction } from "express";


// Controllers
interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>
  getInformationUser(req: Request, res: Response, next: NextFunction): Promise<void>
}

interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface IParentController {
  createParent(req: Request, res: Response, next: NextFunction): Promise<void>;
  createParentWithStudents(req: Request, res: Response, next: NextFunction): Promise<void>;
}
interface IStudentController {
  createStudent(req: Request, res: Response, next: NextFunction): Promise<void>
}

interface ITeacherController {

}

export  {
    IAuthController,
    IUserController,
    IParentController,
    IStudentController,
    ITeacherController
}