import { inject, injectable } from "tsyringe";
import { IStudentServices, IUserServices } from "../interfaces/Implements";
import { TOKENS } from "../Constants/tokensDI";
import { StudentUser } from "../Types/user";
import { NestedStudentData } from "../Types/nested_datas";
import { Prisma, User } from "@prisma/client";
import { Services } from ".";

@injectable()
class StudentServices extends Services<"student"> implements IStudentServices {

    constructor(@inject(TOKENS.UserServices) private userServices: IUserServices) {
        super("student");
     }

    // Private Methods
    private createAccessCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Public Methods
    public async createStudent(student: Omit<StudentUser, "role">, parent_id: number, tx?: Prisma.TransactionClient): Promise<User> {
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
        }, tx);

        return newStudent;
    }

    // TODO Refactor this method
    public async createStudents(students: Omit<StudentUser, "role">[], parent_id: number, tx?: Prisma.TransactionClient): Promise<User[]> {
        return Promise.all(students.map(async student => await this.createStudent(student, parent_id, tx)));
    }
}

export default StudentServices;