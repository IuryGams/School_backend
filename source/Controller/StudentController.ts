import { inject, injectable } from "tsyringe";
import StudentServices from "../Services/StudentServices";
import { TOKENS } from "../Constants/tokensDI";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { StudentUser } from "../Types/user";
import { IStudentController, IStudentServices } from "../implements";

@injectable()
class StudentController implements IStudentController {

    constructor(@inject(TOKENS.services.StudentServices) private studentServices: IStudentServices) { }


    async createStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userStudent: StudentUser = req.body;
            const {parent_id} = req.params;
            const response = await this.studentServices.createStudent(userStudent, Number(parent_id));
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);            
        }
    }
}


export {StudentController};