import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Constants/tokensDI";
import { ICoordinatorServices } from "../../Services/Users";
import { StatusCodes } from "http-status-codes";
import { IClassServices } from "../../Services/ClassServices";

export interface ICoordinatorController {
    createCoordinator(req: Request, res: Response, next: NextFunction): Promise<void>
    createClass(req: Request, res: Response, next: NextFunction): Promise<void>
    updateCoordinator(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteCoordinator(req: Request, res: Response, next: NextFunction): Promise<void>
}

@injectable()
export class CoordinatorController implements ICoordinatorController {

    constructor(
        @inject(TOKENS.services.CoordinatorServices) private coordinatorServices: ICoordinatorServices,
        @inject(TOKENS.services.ClassServices) private classServices: IClassServices,
    ) {}


    async createCoordinator(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.coordinatorServices.createCoordinator(req.body);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

    async createClass(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {teacher_id} = req.params;
            const response = await this.classServices.createClass("", 1, Number(teacher_id));
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

    async updateCoordinator(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {coordinator_id} = req.params;
            const response = await this.coordinatorServices.updateCoordinator(Number(coordinator_id), req.body);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

    async deleteCoordinator(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {coordinator_id} = req.params;
            const response = await this.coordinatorServices.deleteCoordinator(Number(coordinator_id));
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error)
        }
    }
}