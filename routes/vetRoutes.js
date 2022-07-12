import express, { Router } from 'express';
import { register, profile, confirmVet, login,recoveryPassword, recoveryPasswordToken, recoverySetNewPassword, updateProfile, checkPassword, updatePassword } from '../controllers/vetController.js';
import checkAuth from '../middlewares/authMiddleware.js';
const router = express.Router();
// Public Routes
// Register Vet
router.post('/', register);
// Confirm Vet account
router.get('/confirm/:token', confirmVet);
// Login Vet
router.post('/login', login);
// Recovery password
router.post('/account-recovery', recoveryPassword);
// Recovery password token
router.get('/account-recovery/:token', recoveryPasswordToken);
// Recovery new Password
router.post('/account-recovery/:token', recoverySetNewPassword);

// Private Routes
router.get('/profile',checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile);
router.post('/profile', checkAuth, checkPassword);
router.put('/profile', checkAuth, updatePassword);

export default router;