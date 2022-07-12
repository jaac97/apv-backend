import jwt from 'jsonwebtoken';
const generatedJWT = (id, time) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: time,
        algorithm: 'HS256' 
    })
}

export default generatedJWT;