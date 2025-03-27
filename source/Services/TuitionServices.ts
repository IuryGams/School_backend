import { PaymentDates, PaymentStatus, Tuition } from "@prisma/client";
import { Services } from "./BaseServices";
import { BadRequestError, NotFoundError } from "../Errors/ClientError";
import { ITuitionServices } from "../implements";
import { injectable } from "tsyringe";
import { tuitionSchema } from "../Validators/tuitionValidator";
import { formatZodErrors } from "../Utils/utils";
import { differenceInDays, isAfter } from "date-fns";

interface ValidTuition {
    amount: number;
    dueDate: Date;
    paymentStatus: PaymentStatus;
    parentId: number;
    paymentDate: PaymentDates;
}

@injectable()
class TuitionServices extends Services<"tuition"> implements ITuitionServices {
    private readonly mappingPaymentDates: Record<PaymentDates, number> = {
        "FIVE": 5,
        "TENTH": 10,
        "FIFTEENTH": 15
    }
    private readonly today: Date = new Date();
    private readonly month: number = this.today.getMonth();
    private readonly year: number = this.today.getFullYear();
    private readonly interestRate: number = 0.00066;

    constructor() {
        super("tuition")
    }

    // Private Methods
    private async calculateLatePayment(tuitions: Tuition[]): Promise<void> {
        for (const tuition of tuitions) {
            const dueDate = new Date(tuition.dueDate);
            const daysLate = differenceInDays(this.today, dueDate);
            const updatedAmount = tuition.amount * (1 + this.interestRate * daysLate);

            await this.update({
                where: { id: tuition.id },
                data: {
                    amount: updatedAmount
                }
            })

            console.log(`💰 Mensalidade ${tuition.id} atualizada: R$ ${updatedAmount.toFixed(2)}`);
        }

        console.log("✅ Atualização concluída.");
    }


    private validateTuition(tuition: ValidTuition): void {
        const { error } = tuitionSchema.safeParse(tuition);
        if (error) {
            throw new BadRequestError(formatZodErrors(error));
        }
    }

    private getDueDate(paymentDate: PaymentDates): number {
        return this.mappingPaymentDates[paymentDate];
    }

    private calculateDueDate(paymentDate: PaymentDates): Date {
        const day = this.getDueDate(paymentDate);
        return new Date(this.year, this.month + 1, day);
    }

    public async updateLateFees(): Promise<Tuition[]> {
        console.log("🔄 Iniciando atualização de mensalidades vencidas...");

        const overudeTuitions = await this.findMany({
            where: {
                paymentStatus: PaymentStatus.PENDING,
                dueDate: {
                    lt: this.today
                }
            }
        });

        if (overudeTuitions.length === 0) {
            console.log("🔄 Não há mensalidades vencidas.");
            return overudeTuitions;
        };

        await this.calculateLatePayment(overudeTuitions);

        return overudeTuitions;
    }

    private tenDaysBeforeDueDate(): void {
        if (this.today < new Date(this.today.getDate() - 10)) {
            throw new BadRequestError("O boleto só pode ser gerado 10 dias antes do vencimento.");
        }
    }

    private async checkDuplicateTuition(parentId: number, paymentDate: PaymentDates): Promise<void> {
        const dueDate = new Date(this.year, this.month + 1, this.getDueDate(paymentDate));

        const dueYear = dueDate.getFullYear();
        const dueMonth = dueDate.getMonth();

        const firstDayOfDueMonth = new Date(dueYear, dueMonth, 1);
        const lastDayOfDueMonth = new Date(dueYear, dueMonth + 1, 0); 

        const existingTuition = await this.findFirst({
            where: {
                parentId,
                paymentStatus: PaymentStatus.PENDING,
                dueDate: {
                    gte: firstDayOfDueMonth,
                    lte: lastDayOfDueMonth
                }
            }
        });

        if (existingTuition) {
            const monthName = dueDate.toLocaleDateString("pt-BR", { month: "long" });
            throw new BadRequestError(`Já existe um boleto para o mês de ${monthName}.`);
        }
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
    public async createTuition(tuition: Omit<Tuition, "id" | "createdAt" | "updatedAt">, parentId: number): Promise<Tuition> {

        this.validateTuition({ ...tuition, parentId });
        this.tenDaysBeforeDueDate();
        await this.checkDuplicateTuition(tuition.parentId, tuition.paymentDate);

        return await this.create({
            data: {
                ...tuition,
                dueDate: this.calculateDueDate(tuition.paymentDate),
                parentId
            },
            omit: {
                createdAt: true,
                updatedAt: true,
            }
        });
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

    public async getAllTuitions(): Promise<Tuition[]> {
        const tuitions = await this.findMany({
            include: {
                parent: {
                    omit: {
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            },
            omit: {
                createdAt: true,
                updatedAt: true,
            }
        });

        return tuitions;
    }

    public async getTuitionsByParentEmail(parentEmail: string): Promise<Tuition[]> {
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
                paymentStatus: tuition.paymentStatus !== undefined ? tuition.paymentStatus : foundTuition.paymentStatus,
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