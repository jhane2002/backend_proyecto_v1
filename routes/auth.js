const express = require('express');
const router = express.Router(); 
const {signup, signin, logout, singleUser, userProfile, requestPasswordReset, resetPassword ,getAll ,getById,updateById ,deleteById} = require("../controllers/auth");
const {isAuthenticated, isAdmin} = require("../middleware/auth");
const {addDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor} = require("../controllers/medicoController");


router.post('/registrarse', signup );
router.post('/login', signin );
router.get('/cerrarsesion', logout );
router.get('/getme',  userProfile );
router.get('/user/:id', singleUser );
// Request password reset
router.post('/forgot-password', requestPasswordReset);

// Reset password
router.post('/reset-password/:token', resetPassword);

//USUARIOS
router.get('/usuarios', getAll );
router.get('/usuario/:id', getById );
router.put('/usuario/:id', updateById );
router.delete('/usuario/:id', deleteById);


// MEDICO

router.post('/medico', addDoctor );
// Ruta para obtener todos los médicos
router.get('/medico', getAllDoctors);

// Ruta para obtener un médico por su ID
router.get('/medico/:id',getDoctorById);

// Ruta para actualizar un médico
router.put('/medico/:id',updateDoctor);

// Ruta para eliminar un médico
router.delete('/medico/:id',deleteDoctor);



module.exports = router;