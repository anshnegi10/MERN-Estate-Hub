import City from "../database/models/City";
import { connectDB } from "../database/connection";

export const getAllCities = async () => {
    await connectDB();
    return await City.find({});
};
