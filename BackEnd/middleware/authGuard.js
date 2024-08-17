const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    // check if auth header is present
    console.log(req.headers)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: "Authorization header missing!"
        })
    }

    // split auth header and get token
    // Format : 'Bearer ghfdrgthyuhgvfghjkiujhghjuhjg'
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success: false,
            message: "Token missing!"
        })
    }

    // verify token
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) return res.status(401).json({ error: err.message });
            req.user = payload;
            console.log(req.user);
            next();
          });

    } catch (error) {
        res.json({
            success: false,
            message: "Invalid token!"
        })
    }
};


const authGuardAdmin = (req, res, next) => {
    // Check if auth header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: "Authorization header missing!"
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success: false,
            message: "Token missing!"
        });
    }

    // Verify token
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;

        // Check if the userType is "admin"
        if (req.user.userType !== "admin") {
            return res.json({
                success: false,
                message: "Permission denied! Admin access only."
            });
        }
        next();
    } catch (error) {
        return res.json({
            success: false,
            message: "Invalid token!"
        });
    }
};


module.exports = {
    authGuard,
    authGuardAdmin
};