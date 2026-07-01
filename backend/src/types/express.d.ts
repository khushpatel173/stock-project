import User from "../models/User.ts";

interface IUser {
    _id: string;
    name: string;
    email: string;
    picture: string;
    googleId: string;
}

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}