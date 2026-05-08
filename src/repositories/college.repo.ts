import College from "../database/models/College";
import { connectDB } from "../database/connection";

export const getAllColleges = async () => {
    await connectDB();
    return await College.find({});
};

export const getCollegesByCity = async (city: string) => {
    await connectDB();
    // Using case-insensitive regex for city matching
    return await College.find({ city: { $regex: new RegExp(city, "i") } });
};
