import { inject, injectable } from "tsyringe";
import { IStudentServices, IUserServices } from "../interfaces/Implements";
import { TOKENS } from "../Constants/tokensDI";
import { StudentUser } from "../Types/user";
import { NestedStudentData } from "../Types/nested_datas";
import { Prisma, User } from "@prisma/client";

@injectable()
class StudentServices implements IStudentServices {

    constructor(@inject(TOKENS.UserServices) private userServices: IUserServices) { }

    // Private Methods
    private createAccessCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Public Methods
    public async createStudent(student: Omit<StudentUser, "role">, parent_id: number): Promise<User> {
        const accessCode = this.createAccessCode();

        const newStudent: User = await this.userServices.createUser({
            name: student.name,
            email: student.email,
            password: student.password,
            role: "STUDENT",
            student: {
                create: {
                    parentId: parent_id,
                    accessCode,
                    isActive: true
                }
            }
        });

        return newStudent;
    }
}

export default StudentServices;