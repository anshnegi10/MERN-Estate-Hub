import { getAllColleges, getCollegesByCity } from "../repositories/college.repo";
import { getAllCities } from "../repositories/city.repo";

export const fetchColleges = async (city?: string) => {
    if (city) {
        return await getCollegesByCity(city);
    }
    return await getAllColleges();
};

export const fetchCities = async () => {
    return await getAllCities();
};
