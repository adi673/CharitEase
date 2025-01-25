const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/userModel')
exports.authMiddleware = async (req, res, next) => {
    // console.log("In here");
    var token = req.cookies.token;
    // console.log("token : ", req.headers)
    const authHeader = req.headers['authorization'];
    // console.log("Auth Header : ",authHeader)
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    token = authHeader.split(' ')[1]; // Bearer <token>
    

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        
        // console.log('Current Time:', currentTime);
        // console.log('Token Expiration Time:', decoded.exp);
        // console.log('Decoded Payload:', decoded);
        

        // if (currentTime > decoded.exp) {
        //      console.error('Token has expired');
        // } else {
        //     console.log('Token is valid');
        // }
        const decoded = verifyToken(token);
        // console.log(decoded)
        const user = await User.findOne({ user_id: decoded.id });
        // console.log("User", user);
        req.user = user;
        console.log(req.user.role);
        next();
    } catch (err) {
        //console.log("Sending token is invalid")
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};


