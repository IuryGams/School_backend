import { PaymentDates, Tuition } from "@prisma/client";
import { Services } from "./BaseServices";
import { NotFoundError } from "../Errors/ClientError";
import { toZonedTime } from "date-fns-tz";
import { addMonths, isPast, set } from "date-fns";

const paymentDateMapping: Record<PaymentDates, number> = {
    FIVE: 5,
    TENTH: 10,
    FIFTEENTH: 15,
    TWENTIETH: 20,
};

class TuitionServices extends Services<"tuition"> {

    constructor() {
        super("tuition")
    }


    // Private Methods
    private calculateDueDate(dueDate?: PaymentDates): PaymentDates {
        return dueDate ?? PaymentDates.TENTH;
    }

    private async findTuition(tuitionId: number): Promise<Tuition> {
        const foundTuition = await this.findUnique({
            where: { id: tuitionId }
        });
        if (!foundTuition) {
            throw new NotFoundError("Tuition not found");
        }

        return foundTuition;
    }

    // Public Methods
    public async createTuition(tuition: Omit<Tuition, "id" | "creadtedAt" | "updatedAt">) {

        const newTuition = await this.create({
            data: {
                ...tuition,
                dueDate: this.calculateDueDate(tuition.dueDate)
            }
        });

        return newTuition;
    }

    public async getTuitionById(tuitionId: number) {

        const tuition = await this.findUnique({
            where: { id: tuitionId },
            include: {
                parent: true
            }
        });

        return tuition;
    }

    public async getAllTuition() {
        const tuitions = await this.findMany({
            include: {
                parent: true
            }
        });

        return tuitions;
    }

    public async getTuitionByParentEmail(parentEmail: string) {
        const tuitionsParent = await this.findMany({
            where: {
                parent: {
                    user: {
                        email: parentEmail
                    }
                }
            },
            include: {
                parent: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return tuitionsParent;
    }

    public async updateTuition(tuition: Tuition) {

        const foundTuition = await this.findTuition(tuition.id);

        const updatedTuition = await this.update({
            where: { id: tuition.id },
            data: {
                amount: tuition.amount || foundTuition.amount,
                dueDate: tuition.dueDate || foundTuition.dueDate,
                paid: tuition.paid !== undefined ? tuition.paid : foundTuition.paid,
            }
        });

        return updatedTuition;
    }

    public async deleteTuition(tuition: Pick<Tuition, "id">) {
        await this.delete({
            where: { id: tuition.id }
        })
    }

}

export { TuitionServices };