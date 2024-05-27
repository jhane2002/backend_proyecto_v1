const User = require("../models/user");
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');


// Obtener todos los usuarios
exports.getAll = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};