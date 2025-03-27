import { inject, injectable } from "tsyringe";
import { ITuitionController, ITuitionServices } from "../implements";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TOKENS } from "../Constants/tokensDI";


@injectable()
class TuitionController implements ITuitionController {

    constructor(@inject(TOKENS.services.TuitionServices) private tuitionServices: ITuitionServices) { }

    public async createTuition(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {parent_id} = req.params;
            const response = await this.tuitionServices.createTuition(req.body, Number(parent_id));
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    public async getAllTuitions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.tuitionServices.getAllTuitions();
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    public async getTuition(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(StatusCodes.OK).json();
        } catch (error) {
            next(error);
        }
    }
}

export { TuitionController}