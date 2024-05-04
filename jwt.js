// middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    
    jwt.verify(token, 'KH_secret_key', (err, decoded) => {
        if (err) {
            console.log(err  )
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        req.userId = decoded.userId;
        console.log(req.userId )

        next();
    });
};

module.exports = authenticate;