// models/Doctor.js

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    ci: {
        type: String,
        required: true,
        trim: true
    },
    sexo: {
        type: String,
        trim: true,
        required: [true, 'Por favor ingrese su Sexo']
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'Por favor ingrese su Fecha de Nacimiento']
    },
    direccion: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    matricula: {
        type: String,
        required: true,
        trim: true
    },
    especialidad: {
        type: String,

    },
    email: {
        type: String,
        trim: true,
        required : [true, 'ingrese un correo electronico'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, ingrese un correo válido'
        ]

    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: 6, // Adjust as needed
        select: false // Exclude password from query results by default
    },
    role: {
        type: Number,
        default: 0,

    },
    pacientes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente'
    }]
}, { timestamps: true });

const Doctor = mongoose.model('Medico', doctorSchema);

module.exports = Doctor;
