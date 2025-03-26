const express = require('express')
const router = express.Router()
const app = express()
const { createUser, loginUser, authenticateToken, logout, refreshToken } = require('../services/userController')

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/', authenticateToken)
router.get('/logout', logout)
router.post('/refresh-token', refreshToken)
module.exports = router