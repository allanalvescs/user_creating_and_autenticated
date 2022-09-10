const express = require('express');
const dotenv = require('dotenv');
const ConnectToDataBase = require('./src/modules/connect');

dotenv.config()

const port = 3001;

const app = express();

ConnectToDataBase();

app.get('/', (req, res) => {
    return res.status(201).json({ message: 'Initial API', status: 'connect in the server' })
})

app.listen(port, () => console.log(`Rodando serrvidor na porta ${port}`))