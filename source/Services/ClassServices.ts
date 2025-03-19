import { Services } from "./BaseServices"

class ClassServices extends Services<"class"> {
    
    
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

    public async getClassByID(classId: number) {
        const foundClass = await this.findUnique({
            where: {id: classId},
            include: {
                subject: true,
                teacher: true,
                enrollments: true
            }
        });

        return foundClass;
    }


    public async getAllClasses() {
        const classes = await this.findMany({
            include: {
                subject: true,
                teacher: true,
                enrollments: true
            }
        });

        return classes;
    }

    public async updateClassInfor(classId: number, name?: string, subjectId?: number, teacherId?: number) {
        const updatedClass = await this.update({
            where: {id: classId},
            data: {
                name,
                subjectId,
                teacherId
            }
        })

        return updatedClass;
    }

    public async deleteClass(classId: number):Promise<void> {
        await this.delete({
            where: {id: classId}
        });
    }
}

export {ClassServices }