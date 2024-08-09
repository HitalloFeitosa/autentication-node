const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const { sql } = require('./db');

class DatabasePostgres {
    async create(user) {
        const userId = randomUUID();
        const { email, password } = user;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await sql`INSERT INTO users (id, email, password) VALUES (${userId}, ${email}, ${hashedPassword})`;
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
}

module.exports = DatabasePostgres;
