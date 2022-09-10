const mongoose = require('mongoose');

const ConnectToDataBase = async () => {
    await mongoose.connect(
        `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGOBD_PASSWORD}@cluster0.bwvkt1c.mongodb.net/?retryWrites=true&w=majority`,
        (error) => {
            if (error) {
                return console.log(`Erro ao se conectar com o banco de dados: ${error}`)
            }

            return console.log('Conexão com o banco de dados!')
        })
}

module.exports = ConnectToDataBase