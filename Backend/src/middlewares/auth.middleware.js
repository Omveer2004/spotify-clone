const jwt = require("jsonwebtoken");

function extractToken(req) {
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
}

async function authArtist(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Forbidden: Artist role required" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

// Allows any authenticated user (both 'user' and 'artist')
async function authUser(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = { authArtist, authUser };