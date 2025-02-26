import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { ITeacherServices, IUserServices } from "../interfaces/Implements";
import { TeacherUser } from "../Types/user";
import { User } from "@prisma/client";


@injectable()
class TeacherServices implements ITeacherServices {


    constructor(@inject(TOKENS.UserServices) private userServices: IUserServices) {}
    
    // Public methods
    async createTeacher(teacher: Omit<TeacherUser, "role">): Promise<User> {
        const newTeacher = await this.userServices.createUser(
            {
                name: teacher.name,
                email: teacher.email,
                password: teacher.password,
                role: "TEACHER",
                teacher: {
                    create: {}
                }
            }
        );

        return newTeacher;
    }
}

export default TeacherServices;