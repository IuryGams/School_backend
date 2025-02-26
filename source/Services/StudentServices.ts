import { inject, injectable } from "tsyringe";
import { ICryptoServices, IStudentServices, IUserServices } from "../interfaces/Implements";
import { TOKENS } from "../Constants/tokensDI";
import { StudentUser } from "../Types/user";
import { Prisma, User } from "@prisma/client";
import { Services } from ".";
import { studentSchema } from "../Validators/studentValidator";
import { BadRequestError } from "../Errors/ClientError";
import { formatZodErrors } from "../Utils/utils";

@injectable()
class StudentServices extends Services<"student"> implements IStudentServices {

    constructor(
        @inject(TOKENS.UserServices) private userServices: IUserServices,
        @inject(TOKENS.CryptoServices) private cryptoServices: ICryptoServices
    ) {
        super("student");
    }

    // Private Methods
    private async verifyAcessCode(code: string): Promise<string | undefined> {
        const foundCode = await this.findUnique({ where: {accessCode: code}});
        return foundCode?.accessCode;
    }

    private async validateAcessCode(code: string): Promise<void> {
        const {error} = studentSchema.safeParse(code);
        if(error) throw new BadRequestError(formatZodErrors(error));
        const foundCode = await this.verifyAcessCode(code);
        if(foundCode) {
            throw new BadRequestError("Access code belongs to another student")
        }
    }

    private async createAccessCode(): Promise<string> {
        const accessCode = Math.floor(1000 + Math.random() * 9000).toString();
        this.validateAcessCode(accessCode);
        return await this.cryptoServices.hash(accessCode);
    }

    // Public Methods
    public async createStudent(student: Omit<StudentUser, "role">, parent_id: number, tx?: Prisma.TransactionClient): Promise<User> {
        const accessCode = await this.createAccessCode();

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