import JWT from "jsonwebtoken";

export interface UserTokenPayload {
    id: string;
}

const JWT_SECRET = "myjwtsecret";

export function creatUserToken(payload: UserTokenPayload) {
    return JWT.sign(payload, JWT_SECRET);
}

export function verifyUserToken(token: string) {
    try {
        const payload = JWT.verify(token, JWT_SECRET) as UserTokenPayload;
        return payload;
    } catch (error) {
        return null;
    }
}
