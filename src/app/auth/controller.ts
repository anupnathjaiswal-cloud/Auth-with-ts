import type { Request, Response, NextFunction } from "express";
import { signupPayloadModel } from "./models.js";
// import { error } from "node:console";
import { db } from "../../db/index.js";

import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import { email } from "zod";

class AuthenticationController {
    public async handleSingup(req: Request, res: Response) {
        const validationResult = await signupPayloadModel.safeParseAsync(
            req.body,
        );

        if (validationResult.error)
            return res.status(400).json({
                message: "Body validation failed",
                error: validationResult.error,
            });

        const { firstName, lastName, email, password } = validationResult.data;

        const userEmailResult = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));
        if (userEmailResult.length > 0)
            return res.status(400).json({
                message: `User with email "${email}" already exists`,
                error: "Duplicate entry",
            });

        const salt = randomBytes(32).toString("hex");
        const hash = createHmac("sha256", salt).update(password).digest("hex");

        const [result] = await db
            .insert(usersTable)
            .values({
                firstName,
                lastName,
                email,
                password: hash,
                salt,
            })
            .returning({ id: usersTable.id });

        return res.status(201).json({
            message: "user has been created successfully",
            data: { id: result?.id },
        });
    }

    public async handleSignin(req: Request, res: Response) {
        const validationResult = await signupPayloadModel.safeParseAsync(
            req.body,
        );

        if (validationResult.error)
            return res.status(400).json({
                message: "Body validation failed",
                error: validationResult.error.issues,
            });

        const { email, password } = validationResult.data;
        const [userSelect] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!userSelect)
            return res
                .status(404)
                .json({ message: "User doesn't exits with :", email });

        const salt = userSelect.salt!;
        const hash = createHmac("sha256", salt).update(password).digest("hex");

        if (userSelect.password !== hash)
            return res
                .status(400)
                .json({ message: "Email or Password is incorrect" });

        // TODO: Token Banao
        return res.json({ message: "Signin success", data: { token: 1 } });
    }

    public async handleMe(req: Request, res: Response) {
        // @ts-ignore
        const { id } = req.user!;

        const [userResult] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));

        return res.json({
            firstName: userResult?.firstName,
            lastName: userResult?.lastName,
            email: userResult?.email,
        });
    }
}

export default AuthenticationController;
