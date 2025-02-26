import { inject, injectable } from "tsyringe";
import { TOKENS } from "../Constants/tokensDI";
import { IStudentServices, IUserServices } from "../interfaces/Implements";
import { ParentWithStudents, ParentWithStudentsReply, ParentUser } from "../Types/user";
import { Prisma, User } from "@prisma/client";
import { Services } from ".";


@injectable()
class ParentServices extends Services<"parent"> {

    constructor(
        @inject(TOKENS.UserServices) private userServices: IUserServices,
        @inject(TOKENS.StudentServices) private studentServices: IStudentServices
    ) {
        super("parent");
    }

    public async createParent(parent: ParentUser): Promise<User> {
        const newParent = await this.userServices.createUser(
            {
                name: parent.name,
                email: parent.email,
                password: parent.password,
                role: "PARENT",
                parent: {
                    create: {}
                }
            }
        );

        return newParent;
    }

    // public async createParentWithStudents(parentStudent: ParentWithStudents): Promise<ParentWithStudentsReply> {

    //     const { parent, students } = parentStudent;

    //     const parentUser: User = await this.createParent(parent);

    //     const createdStudents: User[] = await Promise.all(students.map(async (student) => await this.studentServices.createStudent({ ...student, parentId: parentUser.id })));

    //     return {
    //         parent: parentUser,
    //         students: createdStudents
    //     }
    // }

    public async createParentWithStudents(parentStudent: ParentWithStudents): Promise<ParentWithStudentsReply> {
        const { parent, students } = parentStudent;

        return this.withTransactions(async (prisma) => {

            const newParent = await prisma.user.create({
                data: {
                    name: parent.name,
                    email: parent.email,
                    password: parent.password,
                    role: "PARENT",
                    parent: {
                        create: {}
                    }
                }
            });

            const createdStudents = await Promise.all(
                students.map(async student => {
                    return await prisma.user.create({
                        data: {
                            name: student.name,
                            email: student.email,
                            password: student.password,
                            role: "STUDENT",
                            student: {
                                create: {
                                    parentId: newParent.id,
                                    accessCode: Math.floor(1000 + Math.random() * 9000).toString()
                                }
                            }
                        }
                    });
                })
            );

            return {
                parent: newParent,
                students: createdStudents
            }
        })
    }
    
}

export default ParentServices;