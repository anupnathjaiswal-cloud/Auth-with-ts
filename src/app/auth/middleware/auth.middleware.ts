import type { Request, Response, NextFunction } from "express";
import { verifyUserToken } from "../utills/token.js";

export function authenticationMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers["authorization"];

        if (!header) next();

        if (!header?.startsWith("Bearer")) {
            return res.status(400).json({
                error: "authorization header must be start wth Bearer...",
            });

            const token = header?.split(" ")[1];

            if (!token)
                return res.status(400).json({
                    error: "authorization must be start with Bearer and followed by token",
                });

            const user = verifyUserToken(token!);

            req.body = user;
            next();
        }
    };
}

export function restrictToAuthenticationUser() {
    return function (req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        if (!req.user)
            return res.status(401).json({
                error: "Authentication required",
            });
        return next();
    };
}
