const User = require('../schema/user.js')
const bcrypt = require('bcryptjs')

class UserRepository {
    static async create({ name, email, password }) {
        Validation.name(name)
        Validation.email(email)

        const user = await User.findOne({ $or: [{ name }, { email }] })
        if (user) throw new Error("name or email already exist")

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User(
            {
                name,
                email,
                password: passwordHash
            }
        );
        await newUser.save();
        return newUser;
    }

    static async login({email, password }) {
        Validation.email(email)
        Validation.password(password)

        const user = await User.findOne({ email })
        if (!user) throw new Error('email does not exist!')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('Invailed password try again')


        return {
            id: user._id,
            name: user.name,
            email: user.email
        }
    }

    static async findById(id) {
        const user = await User.findById(id);
        if (!user) throw new Error("Usuario no encontrado");

        return {
            id: user._id,
            name: user.name,
            email: user.email
        };
    }
}

class Validation {
    static name(name) {
        if (typeof name !== "string") throw new Error('name must be a string')
        if (name.length < 3) throw new Error('name must be at least 3 characters long')

    }

    static email(email) {
        if (typeof email !== "string") throw new Error('email must be a string')
        if (email.length < 3) throw new Error('email must be at least 3 characters long')
    }

    static password(password) {
        if (typeof password !== "string") throw new Error('password must be a string')
        if (password.length < 3) throw new Error("Password must be at least 3 characters long")
    }
}

module.exports = UserRepository;