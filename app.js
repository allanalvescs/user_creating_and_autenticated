const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./src/models/user.model.js')
const ConnectToDataBase = require('./src/modules/connect');

const maskCPF = require('./src/utils/formatcpf.js');
const maskPhone = require('./src/utils/formatTel.js');

dotenv.config()

const port = 3001;


const app = express();

app.use(express.json())

ConnectToDataBase();

app.get('/', (req, res) => {
    return res.status(201).json({ message: 'Initial API', status: 'connect in the server' })
})

app.post('/user/singup', async (req, res) => {
    const { name, email, cpf, tel, password } = req.body

    if (!name) {
        return res.status(422).json({ message: 'name is required!' })
    }
    if (!email) {
        return res.status(422).json({ message: 'email is required!' })
    }
    if (!cpf) {
        return res.status(422).json({ message: 'cpf is required!' })
    }

    if (String(cpf).length != 11) {
        return res.status(422).json({ message: 'CPF needs 11 characters!' })
    }

    if (typeof cpf !== 'number') {
        return res.status(422).json({ message: 'invalid CPF' })
    }

    if (String(tel).length != 11) {
        return res.status(422).json({ message: 'invalid Phone number, phone number needs 11 characters!' })
    }

    if (!password) {
        return res.status(422).json({ message: 'password is required!' })
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
        return res.status(404).json({ message: 'user is already exist!' })
    }

    const salt = await bcrypt.genSalt(14);
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        cpf: maskCPF(cpf),
        tel: tel ? maskPhone(tel) : '',
        password: passwordHash
    });

    try {
        await user.save();
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: 'Error in the server' })
    }
})

app.post('/user/singin', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ message: 'email is required' })
    }

    if (!password) {
        return res.status(422).json({ message: 'password is required!' })
    }

    const CheckUser = await User.findOne({ email: email });

    if (!CheckUser) {
        return res.status(422).json({ message: 'This user is not exist!' })
    }

    const checkPassword = await bcrypt.compare(password, CheckUser.password);

    if (!checkPassword) {
        return res.status(404).json({ message: 'Incorrect password' })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: CheckUser._id
            },
            secret
        )

        const { name, cpf, tel } = CheckUser

        const user = {
            user: {
                id: CheckUser._id,
                name,
                email,
                cpf,
                tel
            },
            token
        }

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: 'Error in the server' })
    }
})

app.listen(port, () => console.log(`Rodando servidor na porta ${port}`))