import { Request, Response, NextFunction } from "express";


// Controllers
interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  getInformationUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface IParentController {
  createParent(req: Request, res: Response, next: NextFunction): Promise<void>;
  createParentWithStudents(req: Request, res: Response, next: NextFunction): Promise<void>;
}
interface IStudentController {
  createStudent(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface ITeacherController {
  createTeacher(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface ITuitionController {
  createTuition(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTuition(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllTuitions(req: Request, res: Response, next: NextFunction): Promise<void>
}

export  {
    IAuthController,
    IUserController,
    IParentController,
    IStudentController,
    ITeacherController,
    ITuitionController
}