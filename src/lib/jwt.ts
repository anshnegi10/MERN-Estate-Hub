import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Note: JWT_SECRET is only required at runtime (not build time).

export const generateToken = (payload: object) => {
    if (!JWT_SECRET) {
        throw new Error("Please define JWT_SECRET in environment variables");
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    console.log("[JWT] Token generated successfully");
    return token;
};

export const verifyToken = (token: string) => {
    if (!JWT_SECRET) {
        throw new Error("Please define JWT_SECRET in environment variables");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("[JWT] Token verified successfully");
    return decoded;
};
