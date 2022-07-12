import {
    request,
    response
} from "express";
import moment from "moment-timezone";

import {
    Patient
} from "../models/association.js"

const addPatient = async (req, res) => {
    const {
        name,
        owner,
        email,
        discharged,
        symptom
    } = req.body;

    try {
        const patient = await Patient.create({
            name,
            owner,
            email,
            discharged,
            symptom,
            VetId: req.vet.id
        })

        res.json(patient)


    } catch (error) {
        console.log(error)
    }
}
/* 
1.- Get all patients' vet
*/
const getPatients = async (req, res = response) => {
    try {
        const patients = await Patient.findAll({
            where: {
                VetId: req.vet.id
            }
        })
        // console.log(patients)
        res.status(200).json(patients)
    } catch (error) {
        console.log("Error al imprimir pacientes de vet", error)
    }
}
/* 
1.- if id doesn't exist get an error msg
2.- If id's patient don't belown to patient from login vet get a error msg
3.- If all is ok get patient info
*/
const getPatient = async (req = request, res = response) => {
    const {
        id
    } = req.params;
    
    try {
        if (!id) {
            const error = new Error('Información no disponible')
            return res.status(403).json({
                msg: error.message
            });
        }

        const patient = await Patient.findOne({
            where: {
                id,
                VetId: req.vet.id
            }
        });

        if (!patient) {
            const error = new Error('Este paciente no existe o no cuentas con los permisos necesarios para ver la información');
            return res.status(403).json({
                msg: error.message
            });
        }

        res.json({
            patient
        })

    } catch (error) {
        console.log(error)
    }

}

const updatePatient = async (req, res) => {

    const {
        name,
        owner,
        email,
        discharged,
        symptom
    } = req.body;

    const {
        id
    } = req.params;

    try {
        let patient = await Patient.findOne({
            where: {
                id,
                VetId: req.vet.id
            }
        })

        if (!patient) {
            const error = new Error('No fue posible actualizar este paciente, verifica que estas logueado con la cuenta correcta');
            return res.status(403).json({
                msg: error.message
            });
        }
        if(name) {
            patient.name = name
        }
        if(owner) {
            patient.owner = owner
        }
        if(email){
            patient.email = email
        }
        if(email){
            patient.discharged = discharged
        }

        if(symptom){
            patient.symptom = symptom
        }

        await patient.save()

        // console.log(patient)/*  */
        res.status(201).json(patient)
    } catch (error) {
        console.log(error)

    }



}
const deletePatient = async (req = request, res = response) => {
    const {
        id
    } = req.params;
    if (!id) {
        const error = new Error('Solicitud no valida verifica que estas ingresando la información correcta');
        return res.status(403).json({
            msg: error.message
        })
    }
    try {
        const patientDelete = await Patient.destroy({
            where: {
                id,
                VetId: req.vet.id
            }
        })
       
        if (!patientDelete) {
            const error = new Error('No puedes eliminar este paciente');
           return res.status(403).json({
                msg: error.message
            })
        }

        res.status(200).json({
            msg: "Paciente eliminado correctamente"
        })
    } catch (error) {
        console.log("Error al eliminar un paciente", error)
    }
}
export {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
}