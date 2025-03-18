import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../Errors/ClientError";
import jwt from "jsonwebtoken";
import { TokenParams } from "../../@Types/auth";
import { JsonWebTokenCustomError, TokenExpiredCustomError } from "../../Errors/Token";

async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if(!accessToken) {
        next(new UnauthorizedError("Token is required"));
        return;
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as TokenParams;
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new TokenExpiredCustomError());
        } else if (error instanceof jwt.JsonWebTokenError) {
            return next(new JsonWebTokenCustomError());
        } else {
            return next(error);
        }
    }
}

export { authMiddleware };