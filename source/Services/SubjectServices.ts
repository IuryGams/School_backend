import { Subject } from "@prisma/client";
import { Services } from "./BaseServices";
import { NotFoundError } from "../Errors/ClientError";


class SubjectServices extends Services<"subject"> {
    constructor() {
        super("subject")
    }

    // Private Methods
    private async findSubject(subjectId: number): Promise<Subject> {
        const foundSubject = await this.findUnique({
            where: { id: subjectId }
        });
        if(!foundSubject) {
            throw new NotFoundError("Subject not found");
        }

        return foundSubject;
    }

    // Public Methods
    public async createSubject(name: string, description: string, teacherId: number) {

        const newSubject = await this.create({
            data: {
                name,
                description,
                teacherId,
            }
        });

        return newSubject;
    }

    public async getSubjectById(subjectId: number) {

        const foundSubject = await this.findUnique({
            where: {id: subjectId},
            include: {
                teacher: true,
                classes: true,
            }
        });

        return foundSubject;
    }

    public async getAllSubject() {
        
        const subjects = await this.findMany({
            include: {
                teacher: true,
                classes: true
            }
        });

        return subjects;
    }

    public async updateSubject(subjectId: number, updateData: Partial<Omit<Subject, "id" | "createdAt" | "updatedAt">>) {

        const foundSubject = await this.findSubject(subjectId);

        const updatedSubject = await this.update({
            where: {id: subjectId},
            data: {
                name: updateData.name || foundSubject.name,
                description: updateData.description || foundSubject.description,
                teacherId: updateData.teacherId || foundSubject.teacherId,
            }
        });

        return updatedSubject;
    }

    public async deleteSubject(subject: Pick<Subject, "id">) {
        await this.delete({
            where: {id: subject.id}
        })
    }
}

export {SubjectServices}