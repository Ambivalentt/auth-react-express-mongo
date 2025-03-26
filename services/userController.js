require('dotenv').config()
const UserRepository = require('./userRepository')
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()


const createUser = async (req, res) => {

    try {
        const newUser = await UserRepository.create(req.body);
        res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const loginUser = async (req, res) => {
    try {
        const user = await UserRepository.login(req.body)

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        const token = jwt.sign(
            { name: user.name, email: user.email, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true, //la cookie solo se puede acceder en el servidor
            //scure:true //solo en produccion
            //sameSite: 'strict' solo se puede acceder a la cookie en el mismo dominio
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        })
        res.status(200).json({ user, token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "No hay refresh token" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await UserRepository.findById(decoded.id)
        const newAccesToken = jwt.sign(
            { name: user.name, email: user.email, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.cookie('access_token', newAccesToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: 'Strict',
            maxAge: 1 * 60 * 60 * 1000 // 1 hora
        });

        res.status(200).json(user, newAccesToken);
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}


const authenticateToken = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Es necesario logear o registrar" });
    }

    try {
        res.json({ name: req.user.name, id: req.user.id, email: req.user.email });
    } catch (err) {
        res.status(403).json({ error: 'Access not authorized' })
    }
}

const logout = (req, res) => {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.json({ message: 'Logout succesful' })
}

module.exports = { createUser, loginUser, authenticateToken, logout, refreshToken }