import { Class, Coordinator, User } from "@prisma/client";
import { Services } from "../BaseServices";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Constants/tokensDI";
import { ITeacherServices, IUserServices } from "../../implements";
import { IClassServices } from "../ClassServices";

export interface ICoordinatorServices {
    createCoordinator(coordinator: User): Promise<User>;
    updateCoordinator(coordinatorId: number, data: Partial<User>): Promise<User>;
    deleteCoordinator(coordinatorId: number): Promise<void>;
    getCoordinatorById(coordinatorId: number): Promise<Coordinator>;
    assignTeacherToClass(classId: number, coordinatorId: number, teacherId: number): Promise<Class>;
}


@injectable()
export class CoordinatorServices extends Services<"coordinator"> implements ICoordinatorServices {

    constructor(
        @inject(TOKENS.services.UserServices) private userServices: IUserServices,
        @inject(TOKENS.services.TeacherServices) private teacherServices: ITeacherServices,
        @inject(TOKENS.services.ClassServices) private classServices: IClassServices
    ) {
        super("coordinator")
    }

    // Private Methods


    // Public Methods
    public async createCoordinator(coordinator: User): Promise<User> {
        return await this.userServices.createUser({
            name: coordinator.name,
            lastName: coordinator.lastName,
            email: coordinator.email,
            password: coordinator.password,
            role: "COORDINATOR",
            coordinator: {
                create: {}
            }
        })
    };


    public async getCoordinatorById(coordinatorId: number): Promise<Coordinator> {
        return await this.validateRecordExists(async () => await this.findUnique({
            where: { id: coordinatorId },
            include: { user: true },
        }),
            "Coordinator not found"
        );
    }

    public async assignTeacherToClass(classId: number, coordinatorId: number, teacherId: number): Promise<Class> {
        await this.getCoordinatorById(coordinatorId);

        await this.teacherServices.getTeacherById(teacherId);

        return await this.classServices.updateClassInfor(classId, {
            teacherId,
        });
    }

    public async updateCoordinator(coordinatorId: number, data: Partial<User>): Promise<User> {
        const foundCoordinator = await this.getCoordinatorById(coordinatorId);
        return await this.userServices.updateUser(foundCoordinator.userId, data);
    }

    public async deleteCoordinator(coordinatorId: number): Promise<void> {
        const foundCoordinator = await this.getCoordinatorById(coordinatorId);
        this.userServices.deleteUser(foundCoordinator.userId)
    }



}