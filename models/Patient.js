import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
// To Trim in DB
import sequelizeTransforms from 'sequelize-transforms';

let d = new Date().toLocaleString()
class Patient extends Model {}

Patient.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        validate: {
            notEmpty: true
        }
    },
    owner: {
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
        trim: true,
        validate: {
            notEmpty: true
        }
    },
    discharged: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        //defaultValue: new Date(),
        validate: {
            notEmpty: true
        }
    },
    symptom: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
},{
    sequelize,
    paranoid: true,
    modelName: 'Patient'
});
sequelizeTransforms(Patient)
//console.log(Patient === sequelize.models.Patient); // true

export default Patient;