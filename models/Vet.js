import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
// To Trim in DB
import sequelizeTransforms from 'sequelize-transforms';

// Hash password
import bcrypt from 'bcrypt';

const saltRounds = 10;

 class Vet extends Model {
    validPassword (password) {
        return bcrypt.compareSync(password, this.password);
    }
 }


 Vet.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'email',
        trim: true,
        validate: {
            notEmpty: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        trim: true,
        defaultValue: null
    },
    web: {
        type: DataTypes.STRING,
        allowNull: true,
        trim: true,
        defaultValue: null
    },
/*     tokenId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    }, */
    token: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
    },
    confirm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
        sequelize,
        paranoid: true,
        modelName: 'Vet',
        hooks: {
           beforeCreate:  (vet) => {
                console.log("Ejecuando beforeCreate")
                const salt = bcrypt.genSaltSync(saltRounds);
                vet.password = bcrypt.hashSync(vet.password, salt);
            },
            beforeUpdate:  (vet) => {


                if(vet.password !== vet._previousDataValues.password) {
                    console.log("Cambiando contraseña")
                    const salt = bcrypt.genSaltSync(saltRounds);
                    vet.password = bcrypt.hashSync(vet.password, salt);
                }
           

        
            }
        }
    }

 
); 

sequelizeTransforms(Vet)

// the defined model is the class itself
console.log(Vet === sequelize.models.Vet); // true
export default Vet;