import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../../Errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            error: err.nameError,
            description: err.message,
            statusCode: err.statusCode,
        });
    }

    // Erros não tratados
    if (process.env.NODE_ENV !== 'production') {
        console.error("Erro não tratado:", err);
    }



    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        description: "Erro interno do servidor",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
};