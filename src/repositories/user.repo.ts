import User from "../database/models/User";
import { connectDB } from "../database/connection";

export const createUser = async (userData: any) => {
    await connectDB();
    const user = new User(userData);
    return await user.save();
};

export const findUserByEmail = async (email: string) => {
    await connectDB();
    return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
    await connectDB();
    return await User.findById(id);
};
