import {} from "express";
import jwt, {} from "jsonwebtoken";
export const authMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        try {
            const decoded = jwt.decode(token);
            const userRole = decoded["custom:role"] || "";
            req.user = {
                id: decoded.sub,
                role: userRole
            };
            const hasAccess = allowedRoles.includes(userRole.toLowerCase());
            if (!hasAccess) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
        }
        catch (error) {
            console.log("Middleware Error");
            res.status(400).json({ message: "Access Denied" });
            return;
        }
        next();
    };
};
//# sourceMappingURL=authMiddleware.js.map