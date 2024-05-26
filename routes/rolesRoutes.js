
const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middleware/auth");
const { editRoles } = require('../controllers/auth');

// Ruta para editar roles (requiere autenticación)
router.put('/edit-roles',isAuthenticated, editRoles);

module.exports = router;
