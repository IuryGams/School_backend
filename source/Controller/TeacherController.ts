import { inject, injectable } from "tsyringe";
import { ITeacherController, ITeacherServices } from "../implements";
import { TOKENS } from "../Constants/tokensDI";

@injectable()
class TeacherController implements ITeacherController {

    constructor(@inject(TOKENS.services.TeacherServices) private teacherServices: ITeacherServices) {}

}


export {TeacherController};