import Property from "../database/models/Property";
import { connectDB } from "../database/connection";

export const getAllProperties = async () => {
    await connectDB();
    return await Property.find({});
};

export const getPropertyById = async (id: string) => {
    await connectDB();
    return await Property.findById(id);
};

export const findPropertiesNear = async (lng: number, lat: number, radius: number) => {
    await connectDB();
    return await Property.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: radius
            }
        }
    });
};
