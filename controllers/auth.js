const User = require("../models/user");
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');

const transporter = require("../config/mailer");

// Obtener todos los usuarios
exports.getAll = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Obtener un usuario por ID
exports.getById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse('Usuario no encontrado', 404));
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Actualizar un usuario por ID
exports.updateById = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedUser) {
            return next(new ErrorResponse('Usuario no encontrado', 404));
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// Eliminar un usuario por ID
exports.deleteById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse('Usuario no encontrado', 404));
        }
        await user.remove();
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};

exports.signup = async (req, res, next) => {
    const { email } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return next(new ErrorResponse("El correo electrónico ya existe", 400));
        }

        const user = await User.create(req.body);

        // Sending email
        const confirmationUrl = "http://localhost:8000/";
        const imageUrl = "https://cdn-icons-png.flaticon.com/512/2621/2621505.png"; // Image URL
        const facebookUrl = "https://www.facebook.com/"; // Facebook URL
        const whatsappUrl = "https://api.whatsapp.com/"; // WhatsApp URL
        const info = await transporter.sendMail({
            from: '"SISTEMA DE CITAS MEDICAS" <maddison53@ethereal.email>',
            to: email,
            subject: "Confirmación de registro",
            html: `
        <div style="background-color: #f4f4f4; padding: 20px;">
          <h2 style="color: #333;">¡Bienvenido a nuestro sistema de citas médicas!</h2>
          <p style="color: #666;">Para comenzar a utilizar nuestros servicios, por favor, ingrese haciendo clic en el siguiente boton:</p>
          <a href="${confirmationUrl}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sistema de citas medicas</a>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <img src="${imageUrl}" alt="Citas Médicas" style="display: block; width: 150px; height: auto; margin: 20px auto;">
          <div style="text-align: center;">
            <a href="${facebookUrl}" style="margin-right: 10px;"><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 30px; height: 30px;"></a>
            <a href="${whatsappUrl}"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" style="width: 30px; height: 30px;"></a>
          </div>
        </div>
      `,
        });

        res.status(201).json({
            success: true,
            user,
            emailSent: info.messageId,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};





exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse('Se requiere correo electrónico y contraseña', 400));
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+password'); // Include password field in query results

        if (!user) {
            return next(new ErrorResponse('Credenciales no válidas', 401)); // 401 for unauthorized
        }

        // Verify user's password
        const isMatched = await user.comparePassword(password);

        if (!isMatched) {
            return next(new ErrorResponse('Credenciales no válidas', 401)); // 401 for unauthorized
        }

        // Generate token upon successful authentication
        generateToken(user, 200, res);
    } catch (error) {
        console.error(error);
        next(new ErrorResponse('No se puede iniciar sesión, verifique sus credenciales', 500));
    }
};




exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse('Usuario no encontrado', 404));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send email with reset link
        const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-password/${resetToken}`;
        const message = `
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
          <a href="${resetUrl}">Restablecer contraseña</a>
        `;

        await transporter.sendMail({
            from: '"SISTEMA DE CITAS MEDICAS" <maddison53@ethereal.email>',
            to: user.email,
            subject: 'Restablecimiento de contraseña',
            html: message
        });

        res.status(200).json({ success: true, message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.' });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse('Error al solicitar restablecimiento de contraseña', 500));
    }
};



exports.resetPassword = async (req, res, next) => {
    try {
        const resetToken = req.params.token;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorResponse('Token de restablecimiento de contraseña no válido o ha expirado', 400));
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse('Error al restablecer la contraseña', 500));
    }
};

const generateToken = async (user, statusCode, res) =>{

    const token = await user.jwtGenerateToken();

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.EXPIRE_TOKEN)
    };

    res
    .status(statusCode)
    .cookie('token', token, options )
    .json({success: true, token})
}


//LOG OUT USER
exports.logout = (req, res, next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Desconectado"
    })
}



// USESR PROFILE
exports.userProfile = async (req, res, next)=>{

    const user = await User.findById(req.user.id);
    res.status(200).json({
        sucess: true,
        user
    });
}


exports.singleUser = async (req, res, next)=>{

    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            sucess: true,
            user
        })

    } catch (error) {
        next(error)

    }

}

exports.editRoles = async (req, res) => {
    try {
        const { userId, roles } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        user.roles = roles;
        await user.save();

        res.json({ msg: 'Roles actualizados exitosamente.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};