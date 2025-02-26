import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { ITeacherServices, IUserServices } from "../interfaces/Implements";
import { TeacherUser } from "../Types/user";
import { Teacher, User } from "@prisma/client";
import { Services } from ".";
import { BadRequestError, NotFoundError } from "../Errors/ClientError";


@injectable()
class TeacherServices extends Services<"teacher"> implements ITeacherServices {


    constructor(@inject(TOKENS.UserServices) private userServices: IUserServices) {
        super("teacher")
    }
    
    // Private Methods
    private async findTeacher(teacherId: number): Promise<Teacher | null> {
        const foundTeacher = await this.findUnique({
            where: { id: teacherId}
        });
        return foundTeacher;
    }

    // Public methods
    public async validateTeacher(teacherId: number): Promise<void> {
        const teacher = await this.findTeacher(teacherId);
        if(teacher) {
            throw new BadRequestError("Teachs already exists");
        }
    }

    public async createTeacher(teacher: Omit<TeacherUser, "role">): Promise<User> {

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