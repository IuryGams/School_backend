import { Class } from "@prisma/client";
import { Services } from "./BaseServices"

export interface IClassServices {
    createClass(name: string, subjectId: number, teacherId: number): Promise<Class>
    getClassByID(classId: number): Promise<Class>;
    getAllClasses(): Promise<Class[]>;
    updateClassInfor(classId: number, data: Partial<Class>): Promise<Class>;
    deleteClass(classId: number): Promise<void>;
}

export class ClassServices extends Services<"class"> implements IClassServices {


    // Private Methods



    // Public Methods
    public async createClass(name: string, subjectId: number, teacherId: number) {
        const newClass = await this.create({
            data: {
                name,
                teacherId,
                subjectId
            }
        });

        return newClass;
    }

    public async getClassByID(classId: number): Promise<Class> {
        return await this.validateRecordExists(async () => await this.findUnique({
            where: { id: classId },
            include: {
                subject: true,
                teacher: true,
                enrollments: true
            },
        }),
            "Class not found"
        );
    }

    public async getAllClasses(): Promise<Class[]> {
        return await this.findMany({
            include: {
                subject: true,
                teacher: true,
                enrollments: true
            }
        });
    }

    public async updateClassInfor(classId: number, data: Partial<Class>): Promise<Class> {
        return await this.update({
            where: { id: classId },
            data: {
                ...data
            }
        })
    }

    public async deleteClass(classId: number): Promise<void> {
        await this.delete({
            where: { id: classId }
        });
    }
}