import express from 'express';
import { addPatient, getPatients, getPatient, updatePatient, deletePatient } from '../controllers/patientController.js';
import checkAuth from '../middlewares/authMiddleware.js';
const router = express.Router();
router.route('/')
        // Register a new patient
        .post(checkAuth, addPatient)
        // Get all patients from a vet
        .get(checkAuth,getPatients)
router.route('/:id')
        // Get an specific patient
        .get(checkAuth, getPatient)
        // Update a patient
        .put(checkAuth, updatePatient)
        // Delete a patient
        .delete(checkAuth, deletePatient)

export default router;