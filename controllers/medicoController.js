const Doctor = require('../models/medico');

// Controlador para agregar un médico
exports.addDoctor = async (req, res) => {
    const { nombre, ci, sexo, fechaNacimiento, direccion, telefono, matricula, especialidad, email, password } = req.body;

    try {
        // Crear una instancia del médico con los datos proporcionados
        const newDoctor = new Doctor({
            nombre,
            ci,
            sexo,
            fechaNacimiento,
            direccion,
            telefono,
            matricula,
            especialidad,
            email,
            password
        });

        // Guardar el médico en la base de datos
        const doctor = await newDoctor.save();

        res.status(201).json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Controlador para obtener todos los médicos

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors); // Aquí se envían los datos como un array
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener un médico por su ID
exports.getDoctorById = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Médico no encontrado' });
        }
        res.status(200).json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Controlador para actualizar un médico
exports.updateDoctor = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Médico no encontrado' });
        }
        res.status(200).json({ success: true, doctor: updatedDoctor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Controlador para eliminar un médico
exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(id);
        if (!deletedDoctor) {
            return res.status(404).json({ success: false, message: 'Médico no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Médico eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
