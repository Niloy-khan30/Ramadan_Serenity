const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token",
        });
    }
};

const authorizeUserEmail = (req, res, next) => {
    const tokenEmail = req.user?.email || req.user?.userEmail;

    // FIXED: req.body may be undefined for GET requests
    const requestedEmail = req.body?.userEmail || req.params.email;

    if (!tokenEmail || !requestedEmail) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: User email could not be verified",
        });
    }

    if (tokenEmail.toLowerCase() !== requestedEmail.toLowerCase()) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: You can only access your own prayer logs",
        });
    }

    next();
};

module.exports = {
    protect,
    authorizeUserEmail,
};