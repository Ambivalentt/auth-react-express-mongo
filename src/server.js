require('dotenv').config()
const express = require('express');
const app = express();
const connectDB = require('./db');
const router = require('../routes/usersRoutes.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwt = require("jsonwebtoken");

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173", // Reemplazar al frontend localhost
    credentials: true
  }));

  app.use((req, res, next) => {
    const token = req.cookies?.access_token
    if (!token) return next();


    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        console.error("Token inválido o expirado:", err.message);
    }
});




app.use('/', router)


app.use((req, res)=>{
    res.status(404).json({error:'page not found 404'})
})

const startServer = async (port) => {
    try {
        await connectDB();
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use. Trying next port...`);
                startServer(port + 1); // Intenta con el siguiente puerto
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

const PORT = parseInt(process.env.PORT) || 3000;
startServer(PORT);

