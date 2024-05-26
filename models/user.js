const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({

   nombre: {
       type: String,
       trim: true,
       required : [true, 'Por favor ingrese su nombre completo'],
       maxlength: 32
   },
    ci: {
        type: String,
        trim: true,
        required: [true, 'Por favor ingrese su CI']
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
    estadoCivil: {
        type: String,
        trim: true
    },
    numeroHistoriaClinica: {
        type: String,
        unique: true,

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
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    role: {
        type: Number,
        default: 0,

    },




}, {timestamps: true});



// AUTO GENERACION DE NUM. HISTORIA CLINICA
userSchema.pre('save', async function(next){
    const ultimoNumero = await this.constructor.findOne({}, {}, { sort: { 'numeroHistoriaClinica': -1 } });
    let nuevoNumero;
    if (!ultimoNumero) {
        nuevoNumero = 1;
    } else {
        nuevoNumero = parseInt(ultimoNumero.numeroHistoriaClinica) + 1;
    }
    this.numeroHistoriaClinica = nuevoNumero.toString().padStart(4, '0');
    next();
});

// cifrar la contraseña antes de guardar
userSchema.pre('save', async function(next){


    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});



// verifica la contarsena
userSchema.methods.comparePassword = async function(yourPassword){
    return await bcrypt.compare(yourPassword, this.password);
}

// obtine el token
userSchema.methods.jwtGenerateToken = function(){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}


module.exports = mongoose.model("Usuario", userSchema);