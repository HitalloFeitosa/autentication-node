const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const { sql } = require('./db');

class DatabasePostgres {
    async create(user) {
        const userId = randomUUID();
        const { name, email, password } = user;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await sql`INSERT INTO users (id, name, email, password) VALUES (${userId}, ${name}, ${email}, ${hashedPassword})`;
    }

    async verifyPassword(email, password) {
        const user = await sql`SELECT password FROM users WHERE email = ${email}`;

        if (user.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        const hashedPassword = user[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        return isMatch
    }

    async getUserByEmail(email) {
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        return user.length > 0 ? user[0] : null;
    }

    async saveResetToken(email, token) {
        await sql`UPDATE users SET reset_token = ${token} WHERE email = ${email}`;
    }

    async verifyResetToken(email, token) {
        const user = await sql`SELECT reset_token FROM users WHERE email = ${email}`;
        return user.length > 0 && user[0].reset_token === token;
    }

    async updatePassword(email, newPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${email}`;
    }

    async deleteResetToken(email) {
        await sql`UPDATE users SET reset_token = NULL WHERE email = ${email}`;
    }
}

module.exports = DatabasePostgres;
