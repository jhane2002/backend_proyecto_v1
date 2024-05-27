const express = require('express');
const router = express.Router(); 
const {getAll } = require("../controllers/getusuarios");
const {signup, signin, logout, singleUser } = require("../controllers/user");


router.post('/registrarse', signup );
router.post('/login', signin );
router.get('/cerrarsesion', logout );
router.get('/user/:id', singleUser );
router.get('/usuarios', getAll );


module.exports = router;