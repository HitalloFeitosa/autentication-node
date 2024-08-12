const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DatabasePostgres = require('./postgres.js');
require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const database = new DatabasePostgres();
const JWT_SECRET = process.env.JWT_SECRET;

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email e senha são obrigatórios.');
    }

    try {
        const isMatch = await database.verifyPassword(email, password);

        if (isMatch) {
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ success: true, token });
        } else {
            res.status(401).send('Email ou senha incorretos.');
        }
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).send('Erro no servidor.');
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Nome, email e senha são obrigatórios.');
    }

    try {
        await database.create({
            name: name,
            email: email,
            password: password
        });

        res.status(201).send('Usuário criado com sucesso!');
    } catch (err) {
        console.error('Erro ao criar o usuário:', err);
        res.status(500).send('Erro no servidor.');
    }
});

app.get('/users', async (req, res) => {
    try {
        const result = await sql`SELECT * FROM users`;
        res.status(200).json(result);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro no servidor.');
    }
});

app.listen({
    port: 3000,
})

