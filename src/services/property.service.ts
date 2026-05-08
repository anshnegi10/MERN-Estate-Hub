import { getAllProperties, getPropertyById, findPropertiesNear } from "../repositories/property.repo";

export const fetchProperties = async () => {
    return await getAllProperties();
};

export const fetchProperty = async (id: string) => {
    return await getPropertyById(id);
};

export const findNearbyProperties = async (lng: number, lat: number, radius: number) => {
    return await findPropertiesNear(lng, lat, radius);
};
