import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../repositories/user.repo";
import { generateToken, verifyToken as verifyJwtToken } from "../lib/jwt";

export const registerUser = async (userData: any) => {
    console.log("[Auth] Register attempt for email:", userData.email);

    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        console.warn("[Auth] Registration failed — email already exists:", userData.email);
        throw new Error("User with this email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = await createUser({
        ...userData,
        password: hashedPassword,
    });

    console.log("[Auth] User registered and saved to MongoDB:", newUser.email, "| role:", newUser.role);

    const token = generateToken({ userId: newUser._id, email: newUser.email, role: newUser.role });
    console.log("[Auth] JWT generated for new user:", newUser.email);

    return {
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        token,
    };
};

export const loginUser = async (loginData: any) => {
    console.log("[Auth] Login attempt for email:", loginData.email);

    const user = await findUserByEmail(loginData.email);
    if (!user) {
        console.warn("[Auth] Login failed — email not found:", loginData.email);
        throw new Error("Invalid email or password");
    }

    console.log("[Auth] User fetched from DB:", user.email);

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
        console.warn("[Auth] Login failed — password mismatch for:", loginData.email);
        throw new Error("Invalid email or password");
    }

    const token = generateToken({ userId: user._id, email: user.email, role: user.role });
    console.log("[Auth] JWT generated for user:", user.email);
    console.log("[Auth] User login success:", user.email, "| role:", user.role);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

export const verifyToken = (token: string) => {
    const payload = verifyJwtToken(token);
    console.log("[Auth] Token verified");
    return payload;
};
