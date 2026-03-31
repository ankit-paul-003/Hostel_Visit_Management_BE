import jwt from "jsonwebtoken";
import User from "../Models/user.js";


export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false,
                message: "No token provided or missing." });

                
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=>{
            if(err){
                if(err.name === "TokenExpiredError"){
                    return res.status(401).json({
                        success: false,
                        message: "Token expired."
                    })
                }
                return res.status(401).json({
                    success: false,
                    message: "Token is missing or invalid."
                })
            }
        

        const {id} = decoded;
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found."
            })
        }

        // If tokenVersion doesn't match, the user has logged out (or otherwise invalidated tokens)
        const decodedTokenVersion = decoded?.tokenVersion ?? 0;
        const currentTokenVersion = user?.tokenVersion ?? 0;
        if (decodedTokenVersion !== currentTokenVersion) {
            return res.status(401).json({
                success: false,
                message: "Token is missing or invalid."
            });
        }

        // Attach user info for downstream middlewares/controllers
        req.userId = user._id;
        req.user = {
            id: user._id,
            role: user.role,
            status: user.status,
            email: user.email,
            name: user.name,
        };

        next();
    });
    } catch (error) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid token" });
    }
}

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only."
        });
    }
    next();
};