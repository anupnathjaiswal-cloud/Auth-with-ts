import express from "express";
import { authenticationMiddleware } from "./auth/middleware/auth.middleware.js";
import { authRouter } from "./auth/routes.js";
// import type { Express } from "express";

export function createApplication() {
    const app = express();

    // Middlewares

    app.use(express.json());
    app.use(authenticationMiddleware());

    // Routers
    app.get("/", (req, res) => {
        return res.json({
            message: "Welcome to Chai Authentication service..",
        });
    });

    app.use("/auth", authRouter);

    return app;
}
