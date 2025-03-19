import { Enrollment } from "@prisma/client";
import { Services } from "./BaseServices";
import { NotFoundError } from "../Errors/ClientError";


class EnrollmentServices extends Services<"enrollment"> {
    
    constructor() {
        super("enrollment")
    }
    // private Methods
    private async findEnrollment(enrollmentId: number) {
        const foundEnrollment = await this.findUnique({
            where: {id: enrollmentId}
        });
        if(!foundEnrollment) {
            throw new NotFoundError("Enrollment not found");
        }

        return foundEnrollment;
    }

    // Public Methods
    public async createEnrollment(enrollment: Omit<Enrollment, "id" | "createdAt" | "updatedAt">) {
        
        const newEnrollemnt = await this.create({
            data: {
                ...enrollment
            }
        });

        return newEnrollemnt
    }

    public async getEnrollmentById(enrollmentId: number) {
        return this.findUnique({
            where: {id: enrollmentId},
            include: {
                student: true,
                class: true
            }
        });
    }

    public async getAllEnrollment() {
        return this.findMany({
            include: {
                student: true,
                class: true
            }
        })
    }

    public async updateEnrollment(enrollmentId: number, updateData: Partial<Omit<Enrollment, "id" | "createdAt" | "updatedAt">>) {

        const foundEnrollment = await this.findEnrollment(enrollmentId);

        return this.update({
            where: {id: enrollmentId},
            data: {
                grade: updateData.grade || foundEnrollment.grade,
                attendance: updateData.attendance || foundEnrollment.attendance,   
            }
        })
    }

    public async deleteEnrollment(enrollmentId: number) {
        return this.delete({
            where: {id: enrollmentId}
        })
    };

    public async getEnrollmentsByStudentId(studentId: number) {
        return this.findMany({
            where: { studentId},
            include: {
                class: true
            }
        })
    }

    public async getEnrollmentsByClassId(classId: number) {
        return this.findMany({
            where: { classId},
            include: {
                student: true
            }
        })
    }
}

export {EnrollmentServices }