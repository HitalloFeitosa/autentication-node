const { sql } = require('./db.js');

sql`
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

`.then(() => {
    console.log("Table created!");
}).catch(err => {
    console.error("Error creating table:", err);
});
