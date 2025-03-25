import { inject, injectable } from "tsyringe";
import { ITeacherController, ITeacherServices } from "../../implements";
import { TOKENS } from "../../Constants/tokensDI";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

@injectable()
class TeacherController implements ITeacherController {

    constructor(@inject(TOKENS.services.TeacherServices) private teacherServices: ITeacherServices) {}

    async createTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body;
            const response = await this.teacherServices.createTeacher(body);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}


export {TeacherController};