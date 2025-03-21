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
        const userLogin = await UserRepository.login(req.body)
        const token = jwt.sign(
            {
                name: userLogin.name, email: userLogin.email, id: userLogin._id

            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )
        res.cookie('access_token', token, {
            httpOnly: true, //la cookie solo se puede acceder en el servidor
            //scure:true //solo en produccion
            //sameSite: 'strict' solo se puede acceder a la cookie en el mismo dominio
        })
        res.status(200).json({ userLogin, token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const authenticateToken = (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Es necesario logear o registrar" });
    }

    const { user } = req.session

    try {
        res.json({ name: user.name, id: user.id, email: user.email });
    } catch (err) {
        res.status(403).json({ error: 'Access not authorized' })
    }
}

const logout = (req, res) => {
    res.clearCookie('access_token').json({ message: 'Logout succesful' })
}

module.exports = { createUser, loginUser, authenticateToken, logout }