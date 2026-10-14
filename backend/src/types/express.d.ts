import User from "../models/User.ts";

interface IUser {
    _id: Types.ObjectId;
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


import type User from "../models/User.js";

type UserDocument = InstanceType<typeof User>;

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}

export {};