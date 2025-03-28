import { Class } from "@prisma/client";
import { Services } from "./BaseServices"
import { classSchema } from "../Validators/classValidator";
import { BadRequestError } from "../Errors/ClientError";
import { formatZodErrors } from "../Utils/utils";

export interface IClassServices {
    createClass(classData: Class): Promise<Class>;
    getClassByID(classId: number): Promise<Class>;
    getAllClasses(): Promise<Class[]>;
    updateClassInfor(classId: number, data: Partial<Class>): Promise<Class>;
    deleteClass(classId: number): Promise<void>;
}

export class ClassServices extends Services<"class"> implements IClassServices {

    constructor() {
        super("class")
    }

    // Private Methods
    private validateClassData(classData: Class) {
        const { error } = classSchema.safeParse(classData);
        if (error) {
            throw new BadRequestError(formatZodErrors(error));
        }

        if(classData.grade < 1 || classData.grade > 9) {
            throw new BadRequestError("Grade must be between 1 and 9");
        }

        if(!/^[A-Z]$/.test(classData.section)) {
            throw new BadRequestError("Section must be a single uppercase letter (Ex: A, B, C).");
        }
    };

    private async UniqueClass(classData: Class): Promise<void> {
        const foundClass = await this.findFirst({
            where: {
                grade: classData.grade,
                section: classData.section,
            }
        });

        if(foundClass) {
            throw new BadRequestError(`The class ${foundClass.grade}° year ${foundClass.section} already exists`);
        };
    }

    // Public Methods
    public async createClass(classData: Class): Promise<Class> {
        this.validateClassData(classData);
        await this.UniqueClass(classData);

        return await this.create({
            data: {
                grade: classData.grade,
                section: classData.section,
                subjectId: classData.subjectId,
                teacherId: classData.teacherId,
            },
            omit: {
                createdAt: true,
                updatedAt: true
            }
        })
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