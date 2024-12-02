const jwt = require('jsonwebtoken');
require('dotenv').config()
function verifytoken(request,response,next){
    const token = request.headers['token'];
    if(!token){
        return response.status(401).json({
            message: "Unauthorized",
            success: false
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        request.user = decoded;
        next(); 
    }catch(error){
        return response.status(401).json({
            message:error.message,
            success:false
        })
    }
}
module.exports = {verifytoken}