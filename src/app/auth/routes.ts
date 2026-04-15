import express from "express";
import type { Router } from "express";
import AuthenticationController from "./controller.js";
import { restrictToAuthenticationUser } from "./middleware/auth.middleware.js";

export const authRouter: Router = express.Router();

const authenticationController = new AuthenticationController();
authRouter.post(
    "/sign-up",
    authenticationController.handleSingup.bind(authenticationController),
);
authRouter.post(
    "/sign-in",
    authenticationController.handleSignin.bind(authenticationController),
);

authRouter.get(
    "/me",
    restrictToAuthenticationUser(),
    authenticationController.handleMe.bind(authenticationController),
);
