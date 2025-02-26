// src/middlewares/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { Roles } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../../Errors/ClientError';


export const roleMiddleware = (allowedRoles: Roles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Verifica se o usuário está autenticado
        if (!req.user) {
            return next(new UnauthorizedError("Usuário não autenticado"));
        }

        // Verifica se a role do usuário está na lista de roles permitidas
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError("Acesso negado"));
        }

        // Passa para o próximo middleware
        next();
    };
};