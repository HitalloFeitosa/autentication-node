const { sql } = require('./db.js');

sql`
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

`.then(() => {
    console.log("Table created!");
}).catch(err => {
    console.error("Error creating table:", err);
});
