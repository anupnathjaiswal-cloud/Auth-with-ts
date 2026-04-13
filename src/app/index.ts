import express from "express";
// import type { Express } from "express";

export function createApplication() {
    const app = express();

    // Middlewares

    // app.use(express.json());
    // app.use(express.json())

    // Routers
    app.get("/", (req, res) => {
        return res.json({
            message: "Welcome to Chai Authentication service..",
        });
    });

    return app;
}
