const express = require('express');
const app = express();
require('dotenv').config();  // Cargar variables de entorno
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const errorHandler = require('./middleware/error');

// IMPORTAR RUTAS
const authRoutes = require('./routes/auth');
const rolesRoutes = require('./routes/rolesRoutes');
//const productRoutes = require('./routes/product');
//const categoryRoutes = require('./routes/category');
// const bannerRoutes = require('./routes/banner');

// CONECTAR A LA BASE DE DATOS
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(() => console.log('DB conectado'))
.catch((err) => console.log('Error conectando a la base de datos:', err));

// MIDDLEWARES
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '10000mb'}));
app.use(bodyParser.urlencoded({
    limit: '10000mb',
    extended: true
}));
app.use(cookieParser());
app.use(cors());

// MIDDLEWARE DE RUTAS
app.use("/api", authRoutes);
//app.use("/api", categoryRoutes);
//app.use("/api", bannerRoutes);
app.use("/api", rolesRoutes);

// SERVIR ARCHIVOS ESTÁTICOS DEL FRONTEND
app.use('/sistema/medico', express.static(path.join(__dirname, 'client/build')));

// HANDLER CATCHALL PARA RUTAS DEL FRONTEND
app.get('/sistema/medico/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// MIDDLEWARE DE ERRORES
app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});