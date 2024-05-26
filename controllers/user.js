const User = require("../models/user");
const ErrorResponse = require('../utils/errorResponse');


exports.signup = async (req, res, next)=>{

    const {email} = req.body;
    const userExist = await User.findOne({email});
    
    // if (userExist){
      
    //  return  next(new ErrorResponse('El correo ya existe', 400))
    // }

    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
        
    } catch (error) {
        console.log(error);
        next(error);
        
    }
   
}


exports.signin = async (req, res, next)=>{

    try{
        const {email, password} = req.body;
        if(!email || !password){
       
            return  next(new ErrorResponse('Se requiere correo electrónico y contraseña', 400))
        }

        // comprobar el correo  del usuario
        const user = await User.findOne({email});
        if(!user){
           
            return  next(new ErrorResponse('Credenciales no válidas', 400))
        }

        // verify user password
        const isMatched = await user.comparePassword(password);
        if (!isMatched){
         
          return  next(new ErrorResponse('Credenciales no válidas', 400))
        }

        generateToken(user, 200, res);
    }
    catch(error){
        console.log(error);
       
        next(new ErrorResponse('No puedo iniciar sesión, verifique sus credenciales', 400))
    }
   
}


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


//CERRAR SESIÓN DE USUARIO
exports.logout = (req, res, next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Desconectado"
    })
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