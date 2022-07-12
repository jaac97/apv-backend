// Modules
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailRecoveryPassword from '../helpers/emailRecoveryPassword.js';
import emailRegister from '../helpers/emailRegister.js';
// Helpers
import generatedJWT from '../helpers/generateJWT.js';
import {
    v4 as uuidv4,
    validate as uuidValidate
} from 'uuid';
// Models
import {
    Vet
} from "../models/association.js";
import { request, response } from 'express';

// Register Vet
const register = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    let vet;

    // Prevenir usuarios duplicados
    const userExist = await Vet.findOne({
        where: {
            email
        }
    })
    // console.log(userExist)
    if (userExist) {
        const error = new Error('Este usuario ya existe, reincia la contraseña para recuperar tu cuenta')
        return res.status(400).json({
            msg: error.message
        })
    } else {
        try {
            const vetDB = await Vet.create({
                name: name,
                email: email,
                password: password
            })
            console.log("Vet's auto-generated ID:", vetDB.id);
            vet = vetDB;
        } catch (error) {
            console.log("Error al ingresar user", error);
        }
        emailRegister({
            name,
            email,
            token: vet.dataValues.token
        })
        res.json({
            vet
        })
    }

}
// Login vet
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        const vetDB = await Vet.findOne({
            where: {
                email
            },
            attributes: {
                exclude: ['createdAt', 'deletedAt', 'updatedAt']
            }
        })
        // console.log(vetDB)
        // If the email exist, evaluat password and token
        if (!vetDB) {
            const error = new Error('Correo electronico o contraseña incorrectos o cuenta no activa')
            res.status(403).json({
                msg: error.message
            })
        } else {
            // Compare password from form with password hashed
            const checkPassword = vetDB.validPassword(password);
            if (!vetDB.confirm || !checkPassword) {
                const error = new Error('Correo electronico o contraseña incorrectos o cuenta no activa')
                res.status(403).json({
                    msg: error.message
                })
            } else {
                vetDB.token = generatedJWT(vetDB.id, '30d')
                delete vetDB.password
                delete vetDB.confirm
                const vet = {
                    id: vetDB.id,
                    name: vetDB.name,
                    email: vetDB.email,
                    token: vetDB.token,
                }
                res.json(vet)
            }
        }

    } catch (error) {
        console.log(error)
    }

}


// Confirm account with token
const confirmVet = async (req, res) => {
    const {
        token
    } = req.params;

    const userConfirm = await Vet.findOne({
        where: {
            token
        }
    })
    if (!userConfirm) {
        const error = new Error('Token no valido');
        return res.status(400).json({
            msg: error.message
        })
    } else {
        try {
            // Update token info to null and confirm Camp in DB to True
            await Vet.update({
                token: null,
                confirm: true
            }, {
                where: {
                    id: userConfirm.id
                }
            })
            res.status(201).json({
                msg: "Cuenta confirmada puedes iniciar sesión"
            })
        } catch (error) {

            console.log("Error al confirmar datos de Vet", error)
        }
    }

    return;
}


const profile = (req, res) => {
    const {
        vet
    } = req;
    res.json(vet)
}

const updateProfile = async (req, res) => {
    let {
        name,
        email,
        phone,
        web
    } = req.body;
    if (phone == '') {
        phone = null;
    }

    if (web == '') {
        web = null;
    }

    const vet = await Vet.findOne({
        where: {
            id: req.params.id
        }
    })

    if (!vet) {
        const error = new Error('Hubo un error');
        return res.status(400).json({
            msg: error.message
        })
    }

    if (email !== vet.email) {
        const emailExist = await Vet.findOne({
            where: {
                email
            }
        })
        if (emailExist) {
            return res.status(400).json({
                msg: "Email ya en uso"
            })
        }

    }
    try {
        vet.update({
            name,
            email,
            phone,
            web
        })
        res.status(200).json(vet)

    } catch (error) {
        console.log(error)
    }
}


const checkPassword = async(req, res) => {
    try {
        const {cuPassword} = req.body;
        const {id} = req.vet;
        const vetDB = await Vet.findOne({
            where: {
                id
            }
        })
        const checkPassword = vetDB.validPassword(cuPassword);
        if(!checkPassword){
            return res.status(400).json({msg: "La contraseña no coincide"})
        }else{
            return res.status(200).json({msg: "Ingresa tu nueva contraseña"})
        }

    } catch (error) {
        console.log(error)
    }
}

const updatePassword = async (req = request, res = response) => {
    try {
        const {password} = req.body
        const {id} = req.vet;
        const vetDB = await Vet.findOne({
            where: {
                id
            }
        })
        vetDB.password = password
        vetDB.save()
        res.status(200).json({
            msg: "Contraseña cambiada exitosamente"
        })
        
    } catch (error) {
        console.log(error)
    }
}

/* 
1.- Check if Vet send and Email
2.- Check if the email existed 
3.- Send token
*/
const recoveryPassword = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) {
            const error = new Error('Verifica que el email este bien escrito');
            res.status(403).json({
                msg: error.message
            })

        } else {
            const vetExits = await Vet.findOne({
                where: {
                    email
                }
            });
            if (!vetExits) {
                const error = new Error('Verifica que el email este bien escrito');
                res.status(403).json({
                    msg: error.message
                })
            } else {
                // Created temporal token
                const tokenGenerated = uuidv4()
                await Vet.update({
                    token: tokenGenerated
                }, {
                    where: {
                        email: email
                    }
                })
                emailRecoveryPassword({
                    email,
                    name: vetExits.name,
                    token: tokenGenerated
                })

                res.json({
                    msg: 'Hemos enviado un email con las instrucciones para recuperar tu contraseña'
                })
            }
        }
    } catch (error) {
        console.log(error)
        const e = new Error('Verifica que el email este bien escrito');
        res.status(403).json({
            msg: error.message
        })
    }

}

/* 
1.- Get token form URL
2.- Check out if token hasn't already used
3.- If all ok in the future this should show a form to reset password or opposite case a button to generate a new token
*/
const recoveryPasswordToken = async (req, res) => {
    const {
        token
    } = req.params;
    // console.log(token)
    /*     const decode = jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
            
            if(err) {
                const error = new Error('Token no valido');
                return;
                
            }
            return;
        }); */
    const decode = uuidValidate(token)
    // console.log(decode)
    if (!decode) {
        const error = new Error('Enlace expirado o no valido, por favor genera una nueva solicitud para recuperar la contraseña');
        return res.status(403).json({
            msg: error.message
        })
    } else {
        const vetDB = await Vet.findOne({
            where: {
                token
            }
        })
        if (!vetDB) {
            const error = new Error('Solicitud no valida, enlace incorrecto o ya utilizado');
            return res.status(403).json({
                msg: error.message
            })
        }
        return res.status(200).json({
            msg: 'Enlace valido, por favor cambia tu contraseña'
        })

    }
    return;
}
/* 
1.- Get token form URL and Password from form
2.- Check out if token exist in DB, oppositive case this will fail
3.-If everything is ok set and hash de the new password and delete the token
    in the future this will redirect to login page
*/
const recoverySetNewPassword = async (req, res) => {
    const {
        token
    } = req.params;
    const {
        password
    } = req.body
    const vetDB = await Vet.findOne({
        where: {
            token
        }
    })
    if (!vetDB) {
        const error = new Error('Hubo un error');
        return res.status(400).json({
            msg: error.message
        })
    } else {
        try {
            vetDB.password = password;
            vetDB.token = null;
            await vetDB.save();

        } catch (error) {
            console.log(error)
        }
        res.status(200).json({
            msg: 'Contraseña cambiada'
        })
    }
}

export {
    register,
    login,
    confirmVet,
    profile,
    updateProfile,
    checkPassword,
    updatePassword,
    recoveryPassword,
    recoveryPasswordToken,
    recoverySetNewPassword
}