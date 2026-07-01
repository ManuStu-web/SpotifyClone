const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Login first" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Only for artist" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error('authArtist error:', err);
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { authArtist };