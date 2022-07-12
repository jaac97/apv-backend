import jwt from 'jsonwebtoken';
import {Vet} from '../models/association.js';
const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get it the token part and compare the authenticity's token then find vet info and saved on the Request function
            token = req.headers.authorization.split((" "))[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.vet = await Vet.findOne({
                attributes: {
                    exclude: ['password', 'token', 'confirm', 'createdAt', 'updatedAt', 'deletedAt']
                },
                where: {
                    id: decode.id
                }
            }).then(data => data.dataValues)
            // console.log(req.vet)
            return next();
        } catch (error) {
            if (!token) {
                error = new Error('Token no valido o inexistente');
                res.status(403).json({
                    msg: e.message
                })
            }
        }
    }else {
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({
            msg: error.message
        })
    }


}
export default checkAuth;