const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://eidcynxe:J-MuRt17gXR90535dvYBje5nFz9ehRk9@surus.db.elephantsql.com/eidcynxe", // Puede encontrarse en la página de detalles de ElephantSQL
});
//Posibilidad de conectarse mediante psql URL
module.exports = pool;