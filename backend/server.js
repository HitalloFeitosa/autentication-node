const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DatabasePostgres = require('./postgres.js');
const nodemailer = require('nodemailer');
const { sql } = require('./db');
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

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const mailOptions = {
    from: '"Your App Name" <no-reply@yourapp.com>',
    to: 'test@example.com',
    subject: 'Test Email',
    text: 'This is a test email sent using Mailtrap.',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Nome, email e senha são obrigatórios.');
    }

    try {
        // Create user in the database
        await database.create({ name, email, password });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

        // Save OTP and expiration time to the database
        await sql`UPDATE users SET otp = ${otp}, otp_expires_at = ${otpExpiresAt} WHERE email = ${email}`;

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Seu Código de Verificação',
            text: `Seu código OTP é ${otp}. Ele expira em 15 minutos.`,
        });

        res.status(201).send('Usuário criado com sucesso! Verifique seu email para o código OTP.');
    } catch (err) {
        console.error('Erro ao criar o usuário:', err);
        res.status(500).send('Erro no servidor.');
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).send('Email e OTP são obrigatórios.');
    }

    try {
        const user = await database.getUserByEmail(email);

        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        const { otp: savedOtp, otp_expires_at: otpExpiresAt } = user;

        if (otp !== savedOtp || new Date() > new Date(otpExpiresAt)) {
            return res.status(400).send('OTP inválido ou expirado.');
        }

        // If OTP is valid, you can proceed with activating the user or any other logic
        res.status(200).send('OTP verificado com sucesso.');
    } catch (err) {
        console.error('Erro ao verificar OTP:', err);
        res.status(500).send('Erro no servidor.');
    }
});

app.post('/request-reset-password', async (req, res) => {
    const { email } = req.body;

    if(!email) {
        return res.status(400).send('Email é obrigatório');
    }

    try {
        const user = await database.getUserByEmail(email);
        if(!user) {
            return res.status(404).send('Usuário não cadastrado');
        }

        const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        await database.saveResetToken(email, resetToken);

        console.log(`Token de reset enviado para o e-mail: ${email}, token: ${resetToken}`);

        res.status(200).send('Um token foi enviado para você, por favor verifique seu e-mail.');
    } catch (err) {
        console.error('Erro ao solicitar reset de senha:', err);
        res.status(500).send('Erro no servidor.');
    }
})

app.post('/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
        return res.status(400).send('Email, token e nova senha são obrigatórios.');
    }

    try {
        jwt.verify(token, JWT_SECRET);

        const validToken = await database.verifyResetToken(email, token);
        if (!validToken) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        await database.updatePassword(email, newPassword);

        await database.deleteResetToken(email);

        res.status(200).send('Senha atualizada com sucesso.');
    } catch (err) {
        console.error('Erro ao resetar senha:', err);
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

